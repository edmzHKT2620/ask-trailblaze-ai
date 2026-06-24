import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Loader2, RefreshCw, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { loadAnswers } from "@/lib/quiz-store";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Counselor — Trailblaze MM" },
      { name: "description", content: "Chat with the Trailblaze AI Counselor for education, major and mental health guidance." },
      { property: "og:title", content: "AI Counselor — Trailblaze MM" },
      { property: "og:description", content: "Personalised education, career and wellbeing guidance for Myanmar students." },
    ],
  }),
  component: AiChatPage,
});

const STORAGE_KEY = "trailblaze.chat.v1";

const SUGGESTIONS = [
  "GED နဲ့ IGCSE ဘယ်ဟာ ပိုသင့်တော်လဲ?",
  "Should I choose IT or Business as my major?",
  "I feel stressed about exams — what can I do?",
  "Plan a 1-year roadmap to study in Germany",
];

function loadHistory(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function partsToText(parts: UIMessage["parts"]): string {
  return parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function AiChatPage() {
  const [initial] = useState<UIMessage[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "trailblaze-ai-counselor",
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleShareQuiz = async () => {
    if (isLoading) return;
    const answers = loadAnswers();
    if (!answers || Object.keys(answers).length === 0) {
      await handleSend(
        "I haven't completed the quizzes yet. Can you walk me through the main questions to figure out my best education pathway and major?",
      );
      return;
    }
    const summary = JSON.stringify(answers, null, 2);
    await handleSend(
      `Here are my latest Trailblaze quiz answers. Please analyse them and give me an Education Recommendation, a Major Recommendation with 2 alternatives, a Career Personality summary, a Career Roadmap (1y/3y/5y) and a Study Plan.\n\n\`\`\`json\n${summary}\n\`\`\``,
    );
  };

  const handleReset = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col px-3 pt-4 sm:h-[calc(100vh-6rem)] sm:px-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-hero text-white shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold">Trailblaze AI Counselor</div>
            <div className="text-xs text-muted-foreground">Education · Major · Mental Health</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareQuiz}
            disabled={isLoading}
            className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50 sm:inline-flex"
          >
            Use my quiz answers
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading || messages.length === 0}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-50"
            aria-label="Clear chat"
          >
            <RefreshCw className="h-3.5 w-3.5" /> New
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-3xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm sm:p-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-gradient-hero text-white shadow-soft">
              <Bot className="h-7 w-7" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">Hi! I'm your Trailblaze AI Counselor.</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ask me about your education pathway, choosing a major, career planning, studying abroad, study skills, or how you're feeling. မြန်မာဘာသာဖြင့်လည်း မေးနိုင်ပါသည်။
            </p>
            <div className="mt-6 grid w-full max-w-md gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {messages.map((m) => {
            const text = partsToText(m.parts);
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                {!isUser && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-hero text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-gradient-hero text-white shadow-soft"
                      : "bg-background/80 text-foreground",
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-2 prose-ol:my-2 prose-code:rounded prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5">
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {status === "submitted" && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-hero text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-background/80 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking…
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Something went wrong reaching the AI. Please try again in a moment.
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-3 flex items-end gap-2 rounded-3xl border border-border bg-card/80 p-2 shadow-soft backdrop-blur"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          placeholder="Ask anything about education, majors, careers, or how you feel…"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          aria-label="Send message"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-hero text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </form>
      <p className="mt-2 px-2 text-center text-[10px] text-muted-foreground">
        Trailblaze AI Counselor only answers Education, Major, Career and Mental Health questions.
      </p>
    </div>
  );
}