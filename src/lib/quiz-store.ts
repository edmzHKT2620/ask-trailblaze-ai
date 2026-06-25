// Lightweight localStorage-backed answer store + recommendation logic.
export type Answers = Record<string, string | string[]>;

const KEY = "trailblaze.answers.v1";

export function loadAnswers(): Answers {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
export function saveAnswers(a: Answers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(a));
}
export function clearAnswers() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

// ------------------- Education recommendation -------------------
export type Pathway = "GED" | "IGCSE" | "University Foundation" | "Grade 12" | "OSSD";

export interface PathwayResult {
  pathway: Pathway;
  match: number;
  reason: string;
  alternates: { pathway: Pathway; match: number; reason: string }[];
}

export function recommendPathway(a: Answers): PathwayResult | null {
  const level = a.edu_level as string | undefined;
  const duration = a.edu_duration as string | undefined;
  const budget = a.edu_budget as string | undefined;
  const location = a.edu_location as string | undefined;
  const field = a.edu_field as string | undefined;

  if (!duration || !budget || !location || !field) return null;

  const scores: Record<Pathway, number> = {
    GED: 40,
    IGCSE: 40,
    "University Foundation": 40,
    "Grade 12": 40,
    OSSD: 40,
  };
  const reasons: Record<Pathway, string[]> = {
    GED: [],
    IGCSE: [],
    "University Foundation": [],
    "Grade 12": [],
    OSSD: [],
  };

  // Duration
  if (duration === "3–8 months") { scores.GED += 30; reasons.GED.push("short 3–8 month path"); }
  if (duration === "9 months") { scores.OSSD += 25; scores["University Foundation"] += 20; reasons.OSSD.push("~9 month timeline fits OSSD"); }
  if (duration === "1 year") { scores["University Foundation"] += 25; reasons["University Foundation"].push("1-year foundation fits"); }
  if (duration === "2–3 years") { scores.IGCSE += 30; scores["Grade 12"] += 25; reasons.IGCSE.push("longer 2–3 year commitment"); }

  // Budget
  if (budget === "500,000–2,000,000 MMK") { scores["Grade 12"] += 25; scores.GED += 15; reasons["Grade 12"].push("low budget"); }
  if (budget === "2,100,000–5,000,000 MMK") { scores.GED += 25; reasons.GED.push("budget around 4M MMK fits GED"); }
  if (budget === "5,100,000–10,000,000 MMK") { scores["University Foundation"] += 20; scores.IGCSE += 15; }
  if (budget === "Above 10,000,000 MMK") { scores.OSSD += 30; scores.IGCSE += 15; reasons.OSSD.push("high budget supports OSSD"); }

  // Location
  if (location === "Locally (Myanmar)") { scores["Grade 12"] += 30; reasons["Grade 12"].push("studying locally in Myanmar"); }
  if (location === "United Kingdom or Singapore") { scores.IGCSE += 30; reasons.IGCSE.push("UK/Singapore accept IGCSE"); }
  if (location === "Germany") { scores["University Foundation"] += 25; reasons["University Foundation"].push("foundation suits German entry"); }
  if (location?.includes("Other Asian")) { scores.OSSD += 20; scores.GED += 15; reasons.OSSD.push("strong international acceptance"); }

  // Field
  if (field === "Medical and Healthcare") { scores.IGCSE += 25; scores["Grade 12"] += 15; reasons.IGCSE.push("medicine requires IGCSE"); }
  if (field === "Engineering") { scores["Grade 12"] += 15; scores.IGCSE += 15; }
  if (field?.includes("Business")) { scores.GED += 15; scores["University Foundation"] += 15; }

  // Highest education level (incl. free-text "Other")
  if (level === "High School Diploma / GED") { scores.GED += 20; scores["Grade 12"] += 10; reasons.GED.push("already at high-school level"); }
  if (level === "Bachelor's Degree") { scores["University Foundation"] += 15; reasons["University Foundation"].push("bachelor's holder looking for advanced prep"); }
  if (level === "Master's Degree") { scores["University Foundation"] += 10; }
  if (level?.startsWith("Other:")) {
    const custom = level.slice(6).toLowerCase();
    const match = matchKeywords(custom, {
      GED: ["diploma", "ged", "secondary", "high school"],
      IGCSE: ["igcse", "o level", "cambridge", "a level"],
      "University Foundation": ["foundation", "associate", "ncc", "hnc", "pre-university", "diploma in"],
      "Grade 12": ["grade 12", "matriculation", "myanmar"],
      OSSD: ["ossd", "ontario", "canadian", "canada"],
    });
    if (match) {
      scores[match as Pathway] += 25;
      reasons[match as Pathway].push(`closest match to "${custom}"`);
    }
  }

  const sorted = (Object.keys(scores) as Pathway[])
    .map((p) => ({
      pathway: p,
      match: Math.min(99, scores[p]),
      reason: reasons[p].length ? reasons[p].join(", ") : "general fit based on your profile",
    }))
    .sort((a, b) => b.match - a.match);

  return { ...sorted[0], alternates: sorted.slice(1, 4) };
}

// ------------------- Major recommendation -------------------
export type Major =
  | "Information Technology (IT)"
  | "Business"
  | "Education"
  | "Engineering"
  | "Medical & Healthcare"
  | "Media & Communications";

export interface MajorResult {
  major: Major;
  match: number;
  reason: string;
  alternates: { major: Major; match: number; reason: string }[];
}

export function recommendMajor(a: Answers): MajorResult | null {
  const field = a.major_field as string | undefined;
  const interest = a.major_interest as string | undefined;
  const hard = (a.major_hard as string[] | undefined) ?? [];
  const soft = (a.major_soft as string[] | undefined) ?? [];

  if (!interest || hard.length === 0 || soft.length === 0) return null;

  const scores: Record<Major, number> = {
    "Information Technology (IT)": 30,
    Business: 30,
    Education: 30,
    Engineering: 30,
    "Medical & Healthcare": 30,
    "Media & Communications": 30,
  };
  const reasons: Record<Major, string[]> = {
    "Information Technology (IT)": [],
    Business: [],
    Education: [],
    Engineering: [],
    "Medical & Healthcare": [],
    "Media & Communications": [],
  };

  // Interests
  const intMap: Record<string, Major> = {
    "Helping People & Healthcare": "Medical & Healthcare",
    "Sharing Knowledge": "Education",
    "Leadership & Management": "Business",
    "Art & Creativity": "Media & Communications",
    "AI & Technology": "Information Technology (IT)",
    "Designing, Planning & Building Structures": "Engineering",
  };
  const primaryInterest = intMap[interest];
  if (primaryInterest) {
    scores[primaryInterest] += 35;
    reasons[primaryInterest].push(`interest in ${interest.toLowerCase()}`);
  }

  // Hard skills
  if (hard.includes("Programming & Data Analysis")) { scores["Information Technology (IT)"] += 20; reasons["Information Technology (IT)"].push("programming skill"); }
  if (hard.includes("Leadership & Management")) { scores.Business += 20; reasons.Business.push("management skill"); }
  if (hard.includes("Mathematics & Technical Drawing")) { scores.Engineering += 20; reasons.Engineering.push("math + technical"); }
  if (hard.includes("Design & Innovation")) { scores["Media & Communications"] += 15; scores.Engineering += 10; }
  if (hard.includes("Science Knowledge")) { scores["Medical & Healthcare"] += 20; reasons["Medical & Healthcare"].push("science foundation"); }

  // Soft skills
  if (soft.includes("Communication")) { scores.Education += 12; scores["Media & Communications"] += 12; }
  if (soft.includes("Leadership")) { scores.Business += 12; }
  if (soft.includes("Empathy")) { scores["Medical & Healthcare"] += 12; scores.Education += 8; }
  if (soft.includes("Creativity")) { scores["Media & Communications"] += 12; }
  if (soft.includes("Teamwork")) { scores.Business += 6; scores.Engineering += 6; }
  if (soft.includes("Time Management")) { scores.Business += 6; scores["Medical & Healthcare"] += 6; }

  // Preferred field of study (incl. free-text "Other")
  const fieldMap: Record<string, Major> = {
    "Computer Science / IT": "Information Technology (IT)",
    "Business Administration": "Business",
    Engineering: "Engineering",
  };
  if (field && fieldMap[field]) {
    scores[fieldMap[field]] += 30;
    reasons[fieldMap[field]].push(`stated preference for ${field}`);
  }
  if (field?.startsWith("Other:")) {
    const custom = field.slice(6).toLowerCase();
    const match = matchKeywords(custom, {
      "Information Technology (IT)": ["it", "computer", "software", "data", "ai", "cyber", "programming", "tech"],
      Business: ["business", "finance", "marketing", "management", "hr", "entrepreneur", "accounting", "economics"],
      Engineering: ["engineer", "civil", "mechanical", "electrical", "biomedical", "architecture"],
      "Medical & Healthcare": ["medical", "medicine", "nurse", "nursing", "doctor", "pharmacy", "health", "biomed"],
      Education: ["education", "teach", "teacher", "pedagogy", "instructional"],
      "Media & Communications": ["media", "journalism", "film", "design", "art", "communication", "pr", "advertising"],
    });
    if (match) {
      scores[match as Major] += 30;
      reasons[match as Major].push(`closest match to "${custom}"`);
    }
  }

  const sorted = (Object.keys(scores) as Major[])
    .map((m) => ({
      major: m,
      match: Math.min(99, scores[m]),
      reason: reasons[m].length ? reasons[m].join(", ") : "complementary fit to your profile",
    }))
    .sort((a, b) => b.match - a.match);

  return { ...sorted[0], alternates: sorted.slice(1, 4) };
}

// Simple keyword-based matcher for free-text "Other" answers.
function matchKeywords(text: string, dict: Record<string, string[]>): string | null {
  const t = text.toLowerCase();
  let best: { key: string; hits: number } | null = null;
  for (const [key, words] of Object.entries(dict)) {
    const hits = words.reduce((n, w) => (t.includes(w) ? n + 1 : n), 0);
    if (hits > 0 && (!best || hits > best.hits)) best = { key, hits };
  }
  return best?.key ?? null;
}
