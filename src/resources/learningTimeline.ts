/**
 * Learning path — edit weeks, milestones, and story beats as you progress.
 * Shown on the home page under “The journey”.
 */

/** Bump this when you move forward in CS50P. */
export const cs50pWeekCurrent = 5;

export type LearningMilestone = {
  phase: string;
  title: string;
  detail: string;
  current?: boolean;
};

export const learningTimeline: LearningMilestone[] = [
  {
    phase: "North star",
    title: "QA Automation & SDET",
    detail:
      "Quality engineering in software — automation, tests that earn trust, and the craft of breaking things on purpose so users don’t have to.",
  },
  {
    phase: "Now",
    title: "CS50P · Python · building in public",
    detail: `Harvard / edX CS50’s Python course — Week ${cs50pWeekCurrent}. Plus a strict custom AI mentor, slow nights after the kids are down, and zero interest in shortcuts.`,
    current: true,
  },
  {
    phase: "Foundation",
    title: "Quality before code",
    detail:
      "Years in call-center QA: scoring calls, running calibrations, coaching agents — the same obsession with standards, now aimed at software.",
  },
];
