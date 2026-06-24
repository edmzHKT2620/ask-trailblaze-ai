import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz, type Question } from "@/components/quiz";
import { recommendMajor, clearAnswers, loadAnswers } from "@/lib/quiz-store";
import { Award, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/major")({
  head: () => ({
    meta: [
      { title: "Major Selection — Trailblaze MM" },
      { name: "description", content: "Discover the right university major for your interests and skills." },
      { property: "og:title", content: "Major Selection — Trailblaze MM" },
      { property: "og:description", content: "IT, Business, Engineering, Medical, Education & Media." },
    ],
  }),
  component: MajorPage,
});

const questions: Question[] = [
  { id: "major_qualification", question: "Which qualification are you planning to pursue or currently have?", choices: ["GED", "IGCSE", "Grade 12", "OSSD", "University Foundation Program"] },
  { id: "major_interest", question: "Which statement best describes your interests?", choices: ["Helping People & Healthcare", "Sharing Knowledge", "Leadership & Management", "Art & Creativity", "AI & Technology", "Designing, Planning & Building Structures"] },
  { id: "major_hard", question: "Which hard skills do you currently have?", multi: true, choices: ["Programming & Data Analysis", "Leadership & Management", "Mathematics & Technical Drawing", "Design & Innovation", "Science Knowledge"] },
  { id: "major_soft", question: "Which soft skills do you currently have?", multi: true, choices: ["Communication", "Leadership", "Empathy", "Creativity", "Teamwork", "Time Management"] },
];

const majors = [
  { name: "Information Technology (IT)", gradient: "bg-gradient-hero", items: ["Software Development", "Computer Science", "Cybersecurity", "Data Science", "Artificial Intelligence"] },
  { name: "Business", gradient: "bg-gradient-mint", items: ["Entrepreneurship", "Management", "Marketing", "Finance", "Human Resources", "International Business"] },
  { name: "Education", gradient: "bg-gradient-sun", items: ["Teaching", "Educational Technology", "Instructional Design", "Special Education", "Educational Leadership"] },
  { name: "Engineering", gradient: "bg-gradient-hero", items: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Biomedical Engineering"] },
  { name: "Medical & Healthcare", gradient: "bg-gradient-mint", items: ["Doctor", "Surgeon", "Nursing", "Pharmacy", "Biomedical Research", "Public Health"] },
  { name: "Media & Communications", gradient: "bg-gradient-sun", items: ["Journalism", "Public Relations", "Advertising", "Film Production", "Social Media Management"] },
];

function MajorPage() {
  const [tab, setTab] = useState("quiz");
  const [done, setDone] = useState(false);
  const result = done ? recommendMajor(loadAnswers()) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Section 2
        </div>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Major Selection</h1>
        <p className="mt-2 text-muted-foreground">Match your interests and skills to a field you'll love.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mx-auto grid h-auto w-full max-w-md grid-cols-2 rounded-full bg-secondary p-1">
          <TabsTrigger value="quiz" className="rounded-full data-[state=active]:bg-gradient-mint data-[state=active]:text-white data-[state=active]:shadow-soft">
            Quiz
          </TabsTrigger>
          <TabsTrigger value="desc" className="rounded-full data-[state=active]:bg-gradient-mint data-[state=active]:text-white data-[state=active]:shadow-soft">
            Majors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="mt-10">
          {!done ? (
            <Quiz questions={questions} onComplete={() => setDone(true)} accent="mint" />
          ) : result ? (
            <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
              <div className="card-elevated overflow-hidden p-1">
                <div className="rounded-[calc(var(--radius-2xl)-2px)] bg-gradient-mint p-6 text-white sm:p-8">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
                    <Award className="h-4 w-4" /> Your recommended major
                  </div>
                  <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{result.major}</h2>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
                    {result.match}% match
                  </div>
                  <p className="mt-4 text-sm leading-relaxed opacity-95">Based on your {result.reason}.</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Alternative majors
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.alternates.map((a) => (
                    <div key={a.major} className="card-elevated p-4">
                      <div className="text-xs font-semibold text-primary">{a.match}% match</div>
                      <div className="mt-1 font-display font-bold">{a.major}</div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setTab("desc")} className="bg-gradient-mint text-white hover:opacity-90">
                  Explore all majors
                </Button>
                <Button variant="outline" onClick={() => { clearAnswers(); setDone(false); }}>
                  <RotateCcw className="mr-1 h-4 w-4" /> Retake
                </Button>
                <Link to="/mental-health" className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                  Wellness support →
                </Link>
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="desc" className="mt-10">
          <div className="grid gap-5 md:grid-cols-2">
            {majors.map((m) => (
              <article key={m.name} className="card-elevated card-elevated-hover overflow-hidden">
                <div className={`${m.gradient} p-5 text-white`}>
                  <h3 className="font-display text-2xl font-bold">{m.name}</h3>
                  <p className="text-sm opacity-90">Includes</p>
                </div>
                <ul className="grid gap-2 p-5 text-sm sm:grid-cols-2">
                  {m.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
