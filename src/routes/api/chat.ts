import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { TRAILBLAZE_SYSTEM_PROMPT } from "@/lib/trailblaze-system-prompt";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

// Strict schema for incoming UIMessage parts. Keep permissive on `type`
// but cap text length so a single message cannot blow up the request.
const MAX_TEXT_LEN = 10_000;
const MAX_MESSAGES = 50;
const MAX_TOTAL_CHARS = 60_000;

const partSchema = z
  .object({
    type: z.string().max(64),
    text: z.string().max(MAX_TEXT_LEN).optional(),
  })
  .passthrough();

const messageSchema = z
  .object({
    id: z.string().max(128).optional(),
    role: z.enum(["system", "user", "assistant", "data"]),
    parts: z.array(partSchema).max(32),
  })
  .passthrough();

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(MAX_MESSAGES),
});

// Best-effort per-IP token bucket to limit anonymous abuse of the
// LOVABLE_API_KEY. Serverless workers are stateless across instances, so
// this is a soft cap rather than a strict guarantee.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const rateBucket = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.reset < now) {
    rateBucket.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count += 1;
  return true;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        if (!rateLimit(ip)) {
          return new Response("Too Many Requests", { status: 429 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) {
          return new Response("Invalid request payload", { status: 400 });
        }
        const { messages } = parsed.data;

        const totalChars = messages.reduce(
          (sum, m) =>
            sum +
            m.parts.reduce(
              (s, p) => s + (typeof p.text === "string" ? p.text.length : 0),
              0,
            ),
          0,
        );
        if (totalChars > MAX_TOTAL_CHARS) {
          return new Response("Payload too large", { status: 413 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: TRAILBLAZE_SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});