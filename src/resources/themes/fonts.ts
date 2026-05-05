import { Geist, Geist_Mono } from "next/font/google";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import type { FontsConfig } from "@/types";

/** Preset A — all Geist (original stack). */
const headingA = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyA = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const labelA = Geist({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
});

const codeA = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

/** Preset B — serif display + humanist sans body (classic editorial, still crisp on screen). */
const headingB = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const bodyB = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const labelB = Source_Sans_3({
  variable: "--font-label",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

const codeB = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const fontsPresetA: FontsConfig = {
  heading: headingA,
  body: bodyA,
  label: labelA,
  code: codeA,
};

export const fontsPresetB: FontsConfig = {
  heading: headingB,
  body: bodyB,
  label: labelB,
  code: codeB,
};
