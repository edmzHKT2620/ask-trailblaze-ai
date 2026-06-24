import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Heart, MessageCircle, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/mental-health")({
  head: () => ({
    meta: [
      { title: "Mental Health Support — Trailblaze MM" },
      { name: "description", content: "Mental health support and community for Myanmar students." },
      { property: "og:title", content: "Mental Health Support — Trailblaze MM" },
      { property: "og:description", content: "ရင်ဖွင့်လို့ရတဲ့ အဖော်တွေရှိပါတယ်။" },
    ],
  }),
  component: MentalHealthPage,
});

function MentalHealthPage() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="text-center animate-fade-in">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-sun text-white shadow-glow">
            <Heart className="h-8 w-8" />
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            Section 3
          </div>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Mental Health <span className="text-gradient">Support</span>
          </h1>

          <div className="card-elevated mt-8 p-6 text-left sm:p-8">
            <p className="font-mm text-lg leading-loose text-foreground">
              မင်းအတွက် မင်းစိတ်ညစ်စရာတွေရှိရင် ရင်ဖွင့်လို့ရတဲ့ အဖော်တွေရှိပါတယ်။
              အကြံဉာဏ်တောင်းချင်ရင် အောက်က Telegram Group ကို Join လုပ်နိုင်ပါတယ်။
            </p>
            <p className="mt-4 text-sm italic text-muted-foreground">
              You're not alone. If you ever feel overwhelmed, there are people here to listen.
              Join our Telegram community for support and conversation.
            </p>

            <a
              href="https://t.me/+kdO2f7UWNlIzYzI1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-sun px-6 py-4 text-base font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Join Support Group
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Shield, title: "Safe Space", desc: "A judgement-free community." },
              { icon: Users, title: "Real People", desc: "Talk with peers who understand." },
              { icon: Heart, title: "Always Here", desc: "Support whenever you need it." },
            ].map((f) => (
              <div key={f.title} className="card-elevated p-5 text-left">
                <f.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 font-display font-bold">{f.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
