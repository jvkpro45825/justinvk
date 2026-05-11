"use client";

import { shortVersion } from "@/resources";
import type { CSSProperties } from "react";

type CardTheme = "cool" | "spectral" | "warm";

const themeForIndex = (index: number): CardTheme => {
  if (index === 0) return "cool";
  if (index === 1) return "spectral";
  return "warm";
};

const launchDelayForIndex = (index: number): string => {
  const offsets = ["0s", "1.4s", "2.8s"];
  return offsets[index] ?? "0s";
};

export default function TheShortVersion() {
  return (
    <section
      className="short-version-stage"
      aria-label="The short version — a summary of where I am and where I'm going"
    >
      <svg
        className="short-version-noise-defs"
        aria-hidden="true"
        focusable="false"
        width="0"
        height="0"
      >
        <filter id="short-version-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.6 0"
          />
        </filter>
      </svg>

      <div className="short-version-bloom short-version-bloom--cool" aria-hidden />
      <div className="short-version-bloom short-version-bloom--warm" aria-hidden />

      <div className="short-version-grid">
        {shortVersion.map((card, index) => {
          const theme = themeForIndex(index);
          const style = {
            "--launch-delay": launchDelayForIndex(index),
          } as CSSProperties;

          return (
            <article
              key={card.label}
              className="short-version-card"
              data-theme={theme}
              data-center={index === 1 ? "true" : "false"}
              style={style}
            >
              <div className="short-version-card-edge-bloom" aria-hidden />
              <div className="short-version-card-iridescence" aria-hidden />
              <div className="short-version-card-streaks" aria-hidden />
              <div className="short-version-card-launch-sweep" aria-hidden />
              <div className="short-version-card-noise" aria-hidden />

              <div className="short-version-card-content">
                <p className="short-version-card-label">{card.label}</p>
                <h3 className="short-version-card-title">{card.title}</h3>
                <p className="short-version-card-body">{card.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
