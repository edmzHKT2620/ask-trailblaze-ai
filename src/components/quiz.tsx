import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { loadAnswers, saveAnswers, type Answers } from "@/lib/quiz-store";
import { cn } from "@/lib/utils";

export interface Question {
  id: string;
  question: string;
  choices: string[];
  multi?: boolean;
}

interface Props {
  questions: Question[];
  onComplete: () => void;
  accent?: "brand" | "coral" | "mint";
}

export function Quiz({ questions, onComplete, accent = "brand" }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [otherText, setOtherText] = useState("");

  useEffect(() => setAnswers(loadAnswers()), []);

  const q = questions[idx];
  const current = answers[q.id];
  const progress = ((idx + (current ? 1 : 0)) / questions.length) * 100;

  const isOtherChoice = (c: string) => c.toLowerCase().startsWith("other");
  const selectedIsOther =
    !q.multi && typeof current === "string" && current.startsWith("Other");

  const select = (choice: string) => {
    let next: Answers;
    if (q.multi) {
      const arr = Array.isArray(current) ? [...current] : [];
      const i = arr.indexOf(choice);
      if (i >= 0) arr.splice(i, 1); else arr.push(choice);
      next = { ...answers, [q.id]: arr };
    } else {
      next = { ...answers, [q.id]: choice };
    }
    setAnswers(next);
    saveAnswers(next);
    if (!q.multi && !isOtherChoice(choice)) {
      // auto-advance for single-choice
      setTimeout(() => {
        if (idx < questions.length - 1) setIdx(idx + 1);
        else onComplete();
      }, 250);
    } else if (!q.multi && isOtherChoice(choice)) {
      // wait for free-text input
      setOtherText("");
    }
  };

  const isSelected = (choice: string) =>
    q.multi ? Array.isArray(current) && current.includes(choice) : current === choice;

  const canNext = q.multi
    ? Array.isArray(current) && current.length > 0
    : !!current && (!selectedIsOther || otherText.trim().length > 0);

  const commitOther = () => {
    const value = `Other: ${otherText.trim()}`;
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    saveAnswers(next);
    if (idx < questions.length - 1) setIdx(idx + 1);
    else onComplete();
  };

  const accentClasses = {
    brand: "bg-gradient-hero",
    coral: "bg-gradient-sun",
    mint: "bg-gradient-mint",
  }[accent];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {idx + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div key={q.id} className="animate-fade-in space-y-6">
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
          {q.question}
        </h2>
        {q.multi && (
          <p className="text-sm text-muted-foreground">Select all that apply</p>
        )}

        <div className="grid gap-3">
          {q.choices.map((c) => {
            const selected = isSelected(c);
            return (
              <div key={c}>
              <button
                onClick={() => select(c)}
                className={cn(
                  "group relative flex w-full items-center gap-4 rounded-2xl border-2 bg-card px-5 py-4 text-left transition-all",
                  "hover:border-primary hover:shadow-soft hover:-translate-y-0.5",
                  selected ? "border-primary shadow-soft" : "border-border",
                )}
              >
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all",
                    selected ? "border-transparent text-white " + accentClasses : "border-border",
                  )}
                >
                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="flex-1 text-base font-medium">{c}</span>
              </button>
              {selected && isOtherChoice(c) && !q.multi && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    autoFocus
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Type your answer here…"
                    className="min-h-20"
                  />
                  <Button
                    onClick={commitOther}
                    disabled={otherText.trim().length === 0}
                    className="bg-gradient-hero text-white hover:opacity-90"
                  >
                    {idx === questions.length - 1 ? "See Results" : "Continue"}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          onClick={() => setIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        {q.multi && (
          <Button
            onClick={() => {
              if (idx < questions.length - 1) setIdx(idx + 1);
              else onComplete();
            }}
            disabled={!canNext}
            className="bg-gradient-hero text-white hover:opacity-90"
          >
            {idx === questions.length - 1 ? "See Results" : "Next"} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
