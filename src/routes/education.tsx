import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz, type Question } from "@/components/quiz";
import { recommendPathway, clearAnswers, loadAnswers } from "@/lib/quiz-store";
import { Award, Clock, DollarSign, GraduationCap, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "Education Pathway — Trailblaze MM" },
      { name: "description", content: "Take the education quiz and discover the right academic pathway." },
      { property: "og:title", content: "Education Pathway — Trailblaze MM" },
      { property: "og:description", content: "GED, IGCSE, OSSD, Grade 12 & University Foundation explained." },
    ],
  }),
  component: EducationPage,
});

const eduQuestions: Question[] = [
  { id: "edu_age", question: "What is your age?", choices: ["Under 15 years old", "15–20 years old", "21–25 years old", "Above 25 years old"] },
  { id: "edu_background", question: "What is your current educational background?", choices: ["Primary School", "Secondary School", "High School"] },
  { id: "edu_english", question: "What is your current English proficiency level?", choices: ["Basic", "Elementary", "Intermediate", "Upper-Intermediate", "Advanced"] },
  { id: "edu_budget", question: "What is your estimated budget for your education?", choices: ["500,000–2,000,000 MMK", "2,100,000–5,000,000 MMK", "5,100,000–10,000,000 MMK", "Above 10,000,000 MMK"] },
  { id: "edu_location", question: "Where would you prefer to study?", choices: ["Locally (Myanmar)", "United Kingdom or Singapore", "Germany", "Other Asian countries, United States, or other international destinations"] },
  { id: "edu_duration", question: "How long would you like your study program to be?", choices: ["3–8 months", "9 months", "1 year", "2–3 years"] },
  { id: "edu_field", question: "Which field are you most interested in?", choices: ["Medical and Healthcare", "Business or Information Technology (IT)", "Engineering", "Education or Other Fields"] },
];

const pathways = [
  {
    name: "GED",
    full: "General Educational Development",
    gradient: "bg-gradient-hero",
    duration: "6–9 months",
    cost: "≈ 4,000,000 MMK",
    points: [
      "Alternative to a U.S. high school diploma",
      "Subjects: Math Reasoning · Science · RLA · Social Studies",
      "Accepted by many private colleges and universities",
      "Usually not suitable for Medicine",
      "Not a direct pathway to German universities",
      "Fast and affordable pathway",
    ],
  },
  {
    name: "IGCSE",
    full: "International General Certificate",
    gradient: "bg-gradient-mint",
    duration: "2+ years",
    cost: "Higher than GED",
    points: [
      "Internationally recognized qualification",
      "Accepted worldwide",
      "Suitable for UK, Singapore, Australia",
      "Specialize through subject selection",
      "Suitable for Medicine and competitive majors",
    ],
  },
  {
    name: "University Foundation",
    full: "Pre-university Program",
    gradient: "bg-gradient-sun",
    duration: "3–6 months",
    cost: "3,000,000–9,000,000 MMK",
    points: [
      "Direct route to international degree programs",
      "NCC Level 3 and HNC Level 3 options",
      "Can transfer abroad later",
    ],
  },
  {
    name: "Grade 12 (G12)",
    full: "Myanmar Education System",
    gradient: "bg-gradient-hero",
    duration: "Standard",
    cost: "Affordable",
    points: [
      "Biology STEM track",
      "Economics STEM track",
      "Suitable for Myanmar universities",
      "Suitable for Medicine and Engineering",
    ],
  },
  {
    name: "OSSD",
    full: "Ontario Secondary School Diploma",
    gradient: "bg-gradient-mint",
    duration: "≈ 9 months",
    cost: "USD 12,000–15,000",
    points: [
      "Canadian high school diploma",
      "Accepted by universities in Canada, Germany, UK, Australia",
      "Strong international pathway",
    ],
  },
];

function EducationPage() {
  const [tab, setTab] = useState("quiz");
  const [done, setDone] = useState(false);
  const result = done ? recommendPathway(loadAnswers()) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5 text-primary" /> Section 1
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Education Pathway</h1>
        <p className="mt-2 text-muted-foreground">Find the academic route that matches your goals.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-2 rounded-full bg-secondary p-1">
          <TabsTrigger value="quiz" className="rounded-full data-[state=active]:bg-gradient-hero data-[state=active]:text-white data-[state=active]:shadow-soft">
            Quiz
          </TabsTrigger>
          <TabsTrigger value="desc" className="rounded-full data-[state=active]:bg-gradient-hero data-[state=active]:text-white data-[state=active]:shadow-soft">
            Pathways
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-10">
          {!done ? (
            <Quiz questions={eduQuestions} onComplete={() => setDone(true)} />
          ) : result ? (
            <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
              <div className="card-elevated overflow-hidden p-1">
                <div className="rounded-[calc(var(--radius-2xl)-2px)] bg-gradient-hero p-6 text-white sm:p-8">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
                    <Award className="h-4 w-4" /> Your recommended pathway
                  </div>
                  <h2 className="mt-2 font-display text-4xl font-extrabold">{result.pathway}</h2>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
                    {result.match}% match
                  </div>
                  <p className="mt-4 text-sm leading-relaxed opacity-95">{result.reason}.</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Alternative options
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.alternates.map((a) => (
                    <div key={a.pathway} className="card-elevated p-4">
                      <div className="text-xs font-semibold text-primary">{a.match}% match</div>
                      <div className="mt-1 font-display font-bold">{a.pathway}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setTab("desc")} className="bg-gradient-hero text-white hover:opacity-90">
                  Explore all pathways
                </Button>
                <Button variant="outline" onClick={() => { clearAnswers(); setDone(false); }}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Retake quiz
                </Button>
                <Link to="/major" className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                  Continue to Major →
                </Link>
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="desc" className="mt-10">
          <div className="grid gap-5 md:grid-cols-2">
            {pathways.map((p) => (
              <article key={p.name} className="card-elevated card-elevated-hover overflow-hidden">
                <div className={`${p.gradient} p-5 text-white`}>
                  <h3 className="font-display text-2xl font-bold">{p.name}</h3>
                  <p className="text-sm opacity-90">{p.full}</p>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium">
                      <Clock className="h-3 w-3" /> {p.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium">
                      <DollarSign className="h-3 w-3" /> {p.cost}
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
