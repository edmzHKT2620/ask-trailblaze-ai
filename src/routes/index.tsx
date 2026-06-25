import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Compass, GraduationCap, Heart, MessageCircle, Sparkles } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png.asset.json";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trailblaze MM — Discover · Decide · Develop" },
      { name: "description", content: "A modern educational and career guidance platform for Myanmar students." },
      { property: "og:title", content: "Trailblaze MM" },
      { property: "og:description", content: "Discover · Decide · Develop — guidance for Myanmar students." },
    ],
  }),
  component: Index,
});

const cards = [
  {
    to: "/education" as const,
    title: "Education Pathway",
    sub: "GED · IGCSE · OSSD & more",
    desc: "Find the right academic route — from local diplomas to international foundations.",
    icon: GraduationCap,
    gradient: "bg-gradient-hero",
    delay: "0ms",
  },
  {
    to: "/major" as const,
    title: "Major Selection",
    sub: "IT · Business · Engineering",
    desc: "Match your interests and skills to a major you'll actually love studying.",
    icon: Sparkles,
    gradient: "bg-gradient-mint",
    delay: "100ms",
  },
  {
    to: "/mental-health" as const,
    title: "Mental Health",
    sub: "Support & Community",
    desc: "မင်းတစ်ယောက်တည်း မဟုတ်ပါဘူး — ရင်ဖွင့်ဖို့ နေရာတစ်ခု ရှိပါတယ်။",
    icon: Heart,
    gradient: "bg-gradient-sun",
    delay: "200ms",
  },
];

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-70" />
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-gradient-hero opacity-30 blur-3xl animate-blob" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-gradient-sun opacity-25 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <Compass className="h-3.5 w-3.5 text-primary" />
              For Myanmar students · မြန်မာကျောင်းသားများအတွက်
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-gradient">Trailblaze</span>{" "}
              <span className="text-foreground">MM</span>
            </h1>
            <p className="mt-4 font-display text-xl font-semibold text-muted-foreground sm:text-2xl">
              Discover <span className="text-primary">·</span> Decide <span className="text-primary">·</span> Develop
            </p>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A modern educational and career guidance platform for Myanmar students.
              Take a short quiz and get a personalized pathway in minutes.
            </p>

            <div className="mx-auto mt-8 w-full max-w-3xl animate-fade-in">
              <img
                src={heroIllustration.url}
                alt="Students walking toward a glowing graduation cap along an educational pathway"
                className="w-full rounded-2xl shadow-soft"
                loading="eager"
                width={1200}
                height={675}
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

              <Link
                to="/ai-chat"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-hero px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Start Ai Chat
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#choose"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <BookOpen className="h-4 w-4" />
                Explore options
              </a>
            </div>
          </div>

          {/* Floating preview card */}
          <div className="relative mx-auto mt-16 max-w-3xl animate-float">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-hero opacity-20 blur-2xl" />
            <div className="card-elevated overflow-hidden rounded-3xl p-1">
              <div className="rounded-[calc(var(--radius-2xl)-2px)] bg-gradient-to-br from-card to-secondary p-8 sm:p-10">
                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    { num: "10+", label: "Pathway options" },
                    { num: "6", label: "Major fields" },
                    { num: "3 min", label: "To get matched" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">{s.num}</div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHOICES */}
      <section id="choose" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Choose your path</h2>
          <p className="mt-2 text-muted-foreground">Three guided journeys. Pick the one that fits you today.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to}
                to={c.to}
                style={{ animationDelay: c.delay }}
                className="card-elevated card-elevated-hover group relative animate-fade-in overflow-hidden p-6"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${c.gradient} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
                <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${c.gradient} text-white shadow-soft`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold">{c.title}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">{c.sub}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  Start <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
