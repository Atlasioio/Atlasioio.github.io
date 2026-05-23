type KickerVariant = { text: string; isQuestion: boolean };

const GENERAL_KICKERS: KickerVariant[] = [
  { text: "Ask about my work", isQuestion: false },
  { text: "Curious about the projects", isQuestion: true },
  { text: "Got questions", isQuestion: true },
  { text: "Want a tour", isQuestion: true },
];

const PROJECT_KICKERS: KickerVariant[] = [
  { text: "Ask about {name}", isQuestion: false },
  { text: "Curious about {name}", isQuestion: true },
  { text: "More on {name}", isQuestion: true },
  { text: "What can I tell you about {name}", isQuestion: true },
];

export type Kicker = { text: string; isQuestion: boolean };

export function getKicker(projectName: string | null, seed: number): Kicker {
  const list = projectName ? PROJECT_KICKERS : GENERAL_KICKERS;
  const variant = list[seed % list.length];
  return {
    text: projectName
      ? variant.text.replace("{name}", projectName)
      : variant.text,
    isQuestion: variant.isQuestion,
  };
}

const GENERAL_CHIPS = [
  "Which one should I look at first?",
  "Real client work?",
  "Show me your apps",
  "What's most recent?",
];

const PROJECT_CHIPS = [
  "What was your role?",
  "How long did it take?",
  "What did you learn?",
  "Tools you used?",
  "Show me a similar one",
];

export function getChips(projectSlug: string | null): string[] {
  return projectSlug ? PROJECT_CHIPS : GENERAL_CHIPS;
}
