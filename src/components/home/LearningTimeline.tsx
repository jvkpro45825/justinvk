"use client";

import Image from "next/image";
import { Column } from "@once-ui-system/core";
import {
  timelineChapters,
  timelineStartYear,
  timelineEndYear,
  type TimelineChapter,
} from "@/resources/learningTimeline";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type WheelMetric = {
  proximity: number;
  offset: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type TimelineMonth = {
  index: number;
  year: number;
  month: number;
  key: string;
  label: string;
  isJanuary: boolean;
  isQuarter: boolean;
  isFiveYear: boolean;
};

type EffectiveRange = { chapter: TimelineChapter; start: number; end: number };

type TimelineModel = {
  timelineMonths: TimelineMonth[];
  sortedChapters: TimelineChapter[];
  effectiveChapterRanges: EffectiveRange[];
  chapterStartKeys: Set<string>;
  getChapterForMonth: (year: number, month: number) => TimelineChapter;
};

function chapterStartIndex(c: TimelineChapter): number {
  return c.year * 12 + (c.month ?? 0);
}

function monthIndexToRulerKey(monthIndex: number): string {
  const y = Math.floor(monthIndex / 12);
  const m = monthIndex % 12;
  return `${y}-${m + 1}`;
}

function formatChapterRangeLabel(start: number, end: number): string {
  const sy = Math.floor(start / 12);
  const sm = start % 12;
  const ey = Math.floor(end / 12);
  const em = end % 12;
  if (start === end) {
    return sm === 0 ? `${sy}` : `${monthNames[sm]} ${sy}`;
  }
  if (sy === ey && sm === 0 && em === 11) {
    return `${sy}`;
  }
  if (sm === 0 && em === 11) {
    return `${sy}–${ey}`;
  }
  return `${monthNames[sm]} ${sy} – ${monthNames[em]} ${ey}`;
}

function chapterPaneKey(c: TimelineChapter, index: number) {
  return `${c.year}-${(c.month ?? 0) + 1}-${c.endYear ?? "open"}-${c.endMonth ?? "e"}-${c.imageSrc ?? "noimg"}-${index}`;
}

/** Compare panes without relying on object identity (safe across Fast Refresh). */
function chapterPaneMatch(a: TimelineChapter, b: TimelineChapter): boolean {
  return (
    a.year === b.year &&
    (a.month ?? 0) === (b.month ?? 0) &&
    (a.endYear ?? null) === (b.endYear ?? null) &&
    (a.endMonth ?? null) === (b.endMonth ?? null) &&
    a.title === b.title &&
    (a.imageSrc ?? "") === (b.imageSrc ?? "")
  );
}

function buildTimelineModel(
  chapters: TimelineChapter[],
  startYear: number,
  endYear: number,
): TimelineModel {
  const timelineMonths: TimelineMonth[] = Array.from(
    { length: (endYear - startYear + 1) * 12 },
    (_, index) => {
      const year = startYear + Math.floor(index / 12);
      const month = index % 12;
      return {
        index,
        year,
        month,
        key: `${year}-${month + 1}`,
        label: `${monthNames[month]} ${year}`,
        isJanuary: month === 0,
        isQuarter: month % 3 === 0,
        isFiveYear: month === 0 && (year - startYear) % 5 === 0,
      };
    },
  );

  const last = timelineMonths[timelineMonths.length - 1]!;
  const TIMELINE_END_INDEX = last.year * 12 + last.month;

  const sortedChapters = [...chapters].sort((a, b) => {
    const am = a.month ?? 0;
    const bm = b.month ?? 0;
    return a.year - b.year || am - bm;
  });

  function chapterEndIndexInclusive(c: TimelineChapter, index: number): number {
    let end: number;
    if (c.endYear != null) {
      end = c.endYear * 12 + (c.endMonth ?? 11);
    } else {
      const next = sortedChapters[index + 1];
      end = next ? chapterStartIndex(next) - 1 : TIMELINE_END_INDEX;
    }
    return Math.min(end, TIMELINE_END_INDEX);
  }

  const declaredChapterEndIndex = sortedChapters.map((c, i) =>
    chapterEndIndexInclusive(c, i),
  );

  const effectiveChapterRanges = sortedChapters.map((c, i) => {
    let start = chapterStartIndex(c);
    if (i > 0) {
      const prevEnd = declaredChapterEndIndex[i - 1]!;
      const declaredStart = start;
      const startsInJanuary = (c.month ?? 0) === 0;
      if (startsInJanuary && declaredStart > prevEnd + 1) {
        start = prevEnd + 1;
      }
    }
    let end = declaredChapterEndIndex[i]!;
    if (end < start) {
      end = start;
    }
    return { chapter: c, start, end };
  });

  const chapterStartKeys = new Set(
    effectiveChapterRanges.map((r) => monthIndexToRulerKey(r.start)),
  );

  function getChapterForMonth(year: number, month: number): TimelineChapter {
    const t = year * 12 + month;
    let match: TimelineChapter | null = null;
    let bestStart = -Infinity;

    for (const { chapter, start, end } of effectiveChapterRanges) {
      if (t >= start && t <= end && start > bestStart) {
        match = chapter;
        bestStart = start;
      }
    }
    if (match) return match;

    for (const { chapter, start } of effectiveChapterRanges) {
      if (start <= t && start > bestStart) {
        match = chapter;
        bestStart = start;
      }
    }
    return match ?? sortedChapters[0]!;
  }

  return {
    timelineMonths,
    sortedChapters,
    effectiveChapterRanges,
    chapterStartKeys,
    getChapterForMonth,
  };
}

export default function LearningTimeline() {
  const model = useMemo(
    () => buildTimelineModel(timelineChapters, timelineStartYear, timelineEndYear),
    [timelineChapters, timelineStartYear, timelineEndYear],
  );

  const {
    timelineMonths,
    effectiveChapterRanges,
    chapterStartKeys,
    getChapterForMonth,
  } = model;

  const spacerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [metrics, setMetrics] = useState<WheelMetric[]>(() =>
    model.timelineMonths.map(() => ({ proximity: 0, offset: 0 })),
  );
  const [spacerHeight, setSpacerHeight] = useState<string>("100svh");
  const prefersReducedMotion = useRef(false);
  const rafId = useRef<number | null>(null);

  useLayoutEffect(() => {
    itemRefs.current = [];
    setMetrics(model.timelineMonths.map(() => ({ proximity: 0, offset: 0 })));
    setActiveIndex((i) =>
      Math.min(Math.max(0, i), Math.max(0, model.timelineMonths.length - 1)),
    );
  }, [model]);

  useLayoutEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const measureMaxTranslate = useCallback(() => {
    const wheel = wheelRef.current;
    const track = trackRef.current;
    if (!wheel || !track) return 0;
    return Math.max(0, track.offsetHeight - wheel.clientHeight);
  }, []);

  const updateFromScroll = useCallback(() => {
    const spacer = spacerRef.current;
    const wheel = wheelRef.current;
    const track = trackRef.current;
    if (!spacer || !wheel || !track) return;

    const spacerRect = spacer.getBoundingClientRect();
    const totalPageScroll = spacer.offsetHeight - window.innerHeight;
    const progress =
      totalPageScroll > 0
        ? Math.max(0, Math.min(1, -spacerRect.top / totalPageScroll))
        : 0;

    const maxTranslate = measureMaxTranslate();
    const trackY = progress * maxTranslate;
    track.style.transform = `translate3d(0, ${-trackY}px, 0)`;

    const wheelRect = wheel.getBoundingClientRect();
    const centerY = wheelRect.top + wheelRect.height / 2;
    let best = 0;
    let bestDist = Infinity;

    const n = timelineMonths.length;
    const nextMetrics: WheelMetric[] = [];

    for (let i = 0; i < n; i++) {
      const el = itemRefs.current[i];
      if (!el) {
        nextMetrics.push({ proximity: 0, offset: 0 });
        continue;
      }

      const itemRect = el.getBoundingClientRect();
      const midY = itemRect.top + itemRect.height / 2;
      const distance = midY - centerY;
      const normalizedOffset = Math.max(
        -1,
        Math.min(1, distance / (wheelRect.height * 0.42)),
      );
      const proximity = 1 - Math.min(Math.abs(distance) / (wheelRect.height * 0.48), 1);

      if (Math.abs(distance) < bestDist) {
        bestDist = Math.abs(distance);
        best = i;
      }

      nextMetrics.push({ proximity, offset: normalizedOffset });
    }

    setActiveIndex(Math.min(best, n - 1));
    setMetrics(nextMetrics);
  }, [measureMaxTranslate, timelineMonths]);

  const requestUpdate = useCallback(() => {
    if (rafId.current !== null) return;
    rafId.current = window.requestAnimationFrame(() => {
      rafId.current = null;
      updateFromScroll();
    });
  }, [updateFromScroll]);

  const recomputeSpacerHeight = useCallback(() => {
    const maxTranslate = measureMaxTranslate();
    if (maxTranslate <= 0) {
      setSpacerHeight("100svh");
      return;
    }
    setSpacerHeight(`calc(100svh + ${maxTranslate}px)`);
  }, [measureMaxTranslate]);

  useLayoutEffect(() => {
    recomputeSpacerHeight();
    requestUpdate();
  }, [model, recomputeSpacerHeight, requestUpdate]);

  useEffect(() => {
    const onScroll = () => requestUpdate();
    const onResize = () => {
      recomputeSpacerHeight();
      requestUpdate();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [requestUpdate, recomputeSpacerHeight]);

  const scrollToIndex = useCallback((index: number) => {
    const spacer = spacerRef.current;
    const wheel = wheelRef.current;
    const track = trackRef.current;
    const el = itemRefs.current[index];
    if (!spacer || !wheel || !track || !el) return;

    const maxTranslate = Math.max(0, track.offsetHeight - wheel.clientHeight);
    if (maxTranslate <= 0) return;

    const targetTrackY = el.offsetTop + el.offsetHeight / 2 - wheel.clientHeight / 2;
    const clamped = Math.max(0, Math.min(maxTranslate, targetTrackY));
    const progress = clamped / maxTranslate;

    const totalPageScroll = spacer.offsetHeight - window.innerHeight;
    const targetPageY = spacer.offsetTop + progress * totalPageScroll;

    window.scrollTo({
      top: targetPageY,
      behavior: prefersReducedMotion.current ? "auto" : "smooth",
    });
  }, []);

  const total = timelineMonths.length;
  const activeMonth = timelineMonths[activeIndex] ?? timelineMonths[0];
  const activeChapter = getChapterForMonth(activeMonth.year, activeMonth.month);

  return (
    <Column fillWidth horizontal="center" gap="m">
      <section
        ref={spacerRef as React.RefObject<HTMLElement>}
        className="timeline-pin-spacer"
        style={{ height: spacerHeight }}
        aria-label="Scrollable timeline ruler"
      >
        <div className="timeline-pin-sticky">
          <div ref={stageRef} className="timeline-stage mt-6 w-screen">
            <div
              className="timeline-center-window pointer-events-none absolute left-0 right-0 top-1/2 z-[4] h-24 -translate-y-1/2 border-y border-brand-alpha-medium"
              aria-hidden
            />
            <div
              className="timeline-ruler-spine pointer-events-none absolute bottom-0 left-[clamp(4rem,18vw,18rem)] top-0 z-[2] w-px"
              aria-hidden
            />
            <div
              className="timeline-hashmarks pointer-events-none absolute bottom-0 left-[clamp(4rem,18vw,18rem)] top-0 z-[2] w-12 opacity-80"
              aria-hidden
            />
            <div
              className="timeline-hashmarks pointer-events-none absolute bottom-0 right-[clamp(1.5rem,7vw,7rem)] top-0 z-[2] w-12 rotate-180 opacity-30"
              aria-hidden
            />

            <div
              className="timeline-active-chapter absolute left-[clamp(28rem,50vw,50rem)] right-[clamp(2rem,8vw,8rem)] top-1/2 z-[5] -translate-y-1/2"
              aria-live="polite"
            >
              {effectiveChapterRanges.map(({ chapter, start, end }, chapterIndex) => (
                <div
                  key={chapterPaneKey(chapter, chapterIndex)}
                  className="timeline-active-chapter-pane"
                  data-active={chapterPaneMatch(activeChapter, chapter) ? "true" : "false"}
                >
                  <div className="timeline-active-chapter-stack">
                    {chapter.imageSrc ? (
                      <div className="timeline-active-chapter-thumb-wrap">
                        <Image
                          src={encodeURI(chapter.imageSrc)}
                          alt={chapter.imageAlt ?? ""}
                          width={224}
                          height={144}
                          className="timeline-active-chapter-thumb"
                          sizes="224px"
                        />
                      </div>
                    ) : null}
                    <p className="timeline-active-chapter-period">{formatChapterRangeLabel(start, end)}</p>
                    <h3 className="timeline-active-chapter-title">{chapter.title}</h3>
                    <p className="timeline-active-chapter-body">{chapter.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={wheelRef}
              className="timeline-wheel timeline-wheel-full relative z-[3]"
              role="listbox"
              aria-label="Timeline month ruler"
            >
              <div ref={trackRef} className="timeline-track">
                {timelineMonths.map((item, i) => {
                  const isActive = i === activeIndex;
                  const metric = metrics[i] ?? { proximity: 0, offset: 0 };
                  const isChapterStart = chapterStartKeys.has(item.key);
                  const isMidYearChapterStart = isChapterStart && !item.isJanuary;
                  const style = {
                    "--timeline-proximity": prefersReducedMotion.current
                      ? 1
                      : metric.proximity,
                    "--timeline-offset": prefersReducedMotion.current
                      ? 0
                      : metric.offset,
                  } as CSSProperties;

                  return (
                    <button
                      key={item.key}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      type="button"
                      role="option"
                      data-active={isActive ? "true" : "false"}
                      tabIndex={isActive ? 0 : -1}
                      className={`timeline-wheel-item timeline-wheel-mark group relative flex w-full appearance-none items-center rounded-none border-0 bg-transparent p-0 text-left outline-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-strong ${
                        isActive
                          ? "text-neutral-strong"
                          : "text-neutral-weak hover:text-neutral-strong"
                      }`}
                      style={style}
                      onClick={() => scrollToIndex(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          scrollToIndex(i);
                        }
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          scrollToIndex(Math.min(i + 1, total - 1));
                        }
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          scrollToIndex(Math.max(i - 1, 0));
                        }
                      }}
                    >
                      <span
                        className={`timeline-ruler-tick ${
                          item.isFiveYear
                            ? "timeline-ruler-tick-major"
                            : item.isJanuary
                              ? "timeline-ruler-tick-year"
                              : isMidYearChapterStart
                                ? "timeline-ruler-tick-chapter"
                                : item.isQuarter
                                  ? "timeline-ruler-tick-quarter"
                                  : ""
                        }`}
                        aria-hidden
                      />
                      {item.isJanuary && (
                        <span
                          className={`timeline-year-label ml-6 ${
                            item.isFiveYear ? "timeline-year-label-major" : ""
                          }`}
                        >
                          {item.year}
                        </span>
                      )}
                      {isMidYearChapterStart && (
                        <span className="timeline-chapter-label ml-6">
                          {monthNames[item.month]} {item.year}
                        </span>
                      )}
                      {isActive && !item.isJanuary && !isMidYearChapterStart && (
                        <span className="ml-6 text-sm font-medium uppercase tracking-wider text-brand-strong">
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Column>
  );
}
