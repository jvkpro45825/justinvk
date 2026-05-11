"use client";

import { shortVersion } from "@/resources";
import type { CSSProperties } from "react";

const launchDelayForIndex = (index: number): string => {
  const offsets = ["0s", "0.12s", "0.24s"];
  return offsets[index] ?? "0s";
};

export default function TheShortVersion() {
  return (
    <section
      className="short-version-stage"
      aria-label="The short version — a summary of where I am and where I'm going"
    >
      <div className="short-version-bloom short-version-bloom--floor" aria-hidden />

      <div className="short-version-grid">
        {shortVersion.map((card, index) => {
          const style = {
            "--launch-delay": launchDelayForIndex(index),
          } as CSSProperties;

          return (
            <article
              key={card.label}
              className="short-version-card"
              data-beam-slot={index}
              style={style}
            >
              <div className="short-version-card-beam-glow" aria-hidden />
              <div className="short-version-card-beam-core" aria-hidden />
              <div className="short-version-card-beam-rainbow" aria-hidden />
              <div className="short-version-card-launch-sweep" aria-hidden />

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
