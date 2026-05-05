import type { EffectsConfig, StyleConfig } from "@/types";

/**
 * “Classic / editorial” — lighter, warmer, cooler motion, no dot grid, serif headlines.
 * Still uses Once UI tokens; not a full custom skin.
 */
export const stylePresetB: StyleConfig = {
  theme: "light",
  neutral: "sand",
  brand: "blue",
  accent: "indigo",
  solid: "color",
  solidStyle: "flat",
  border: "conservative",
  surface: "filled",
  transition: "micro",
  scaling: "100",
};

export const effectsPresetB: EffectsConfig = {
  mask: {
    cursor: false,
    x: 50,
    y: 0,
    radius: 100,
  },
  gradient: {
    display: false,
    opacity: 100,
    x: 50,
    y: 60,
    width: 100,
    height: 50,
    tilt: 0,
    colorStart: "accent-background-strong",
    colorEnd: "page-background",
  },
  dots: {
    display: false,
    opacity: 20,
    size: "2",
    color: "brand-background-strong",
  },
  grid: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-medium",
    width: "0.25rem",
    height: "0.25rem",
  },
  lines: {
    display: false,
    opacity: 100,
    color: "neutral-alpha-weak",
    size: "16",
    thickness: 1,
    angle: 45,
  },
};
