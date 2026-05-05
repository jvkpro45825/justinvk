import type { EffectsConfig, FontsConfig, StyleConfig } from "@/types";
import { fontsPresetA, fontsPresetB } from "./fonts";
import { effectsPresetA, stylePresetA } from "./presetA";
import { effectsPresetB, stylePresetB } from "./presetB";

export type ThemePresetId = "a" | "b";

/**
 * Active visual preset.
 * - Set in `.env.local`: `NEXT_PUBLIC_THEME_PRESET=a` or `b`
 * - `a` = original modern (Geist, cyan, playful, dots)
 * - `b` = classic / lighter (serif headings, sand, conservative, no dots)
 *
 * Default `b` while you try the classic look; switch to `a` anytime to compare.
 */
export function getActiveThemePreset(): ThemePresetId {
  const raw = process.env.NEXT_PUBLIC_THEME_PRESET?.trim().toLowerCase();
  if (raw === "a" || raw === "modern") return "a";
  if (raw === "b" || raw === "classic") return "b";
  return "b";
}

const styleByPreset: Record<ThemePresetId, StyleConfig> = {
  a: stylePresetA,
  b: stylePresetB,
};

const effectsByPreset: Record<ThemePresetId, EffectsConfig> = {
  a: effectsPresetA,
  b: effectsPresetB,
};

const fontsByPreset: Record<ThemePresetId, FontsConfig> = {
  a: fontsPresetA,
  b: fontsPresetB,
};

const active = getActiveThemePreset();

export const activeThemePreset: ThemePresetId = active;

export const style: StyleConfig = styleByPreset[active];

export const effects: EffectsConfig = effectsByPreset[active];

export const fonts: FontsConfig = fontsByPreset[active];
