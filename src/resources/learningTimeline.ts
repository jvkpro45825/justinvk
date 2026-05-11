/**
 * Home scroll timeline — edit copy here.
 *
 * Each chapter has a start date and either:
 * - An explicit **end** (`endYear` / optional `endMonth`), e.g. 2010–2013 means
 *   set `endYear: 2013` (through December 2013), or
 * - No end → stays active until the **next** chapter’s start (same as before).
 *
 * **Gap after an explicit end:** If the next entry’s `year` is later (e.g. 2010–2013
 * then `year: 2015`), the next chapter **effectively** starts the month after the
 * previous one ends (e.g. Jan 2014) on the ruler and in the overlay, as long as that
 * next chapter begins in **January** (`month` omitted). Mid-year starts are not auto-shifted.
 *
 * Order of entries doesn't matter — they're sorted by date at lookup time.
 *
 * Months are 0-indexed: 0 = Jan, 1 = Feb, ..., 11 = Dec.
 * If `month` is omitted, it defaults to January (0).
 *
 * Optional **`imageSrc`** / **`imageAlt`**: path under `public/` (e.g. `/images/photo.jpg`).
 *
 * The Home and About pages share `cs50pWeekCurrent` so keep that one in sync.
 */

/**
 * Inclusive calendar range for the home-page month ruler.
 */
export const timelineStartYear = 2010;
export const timelineEndYear = 2027;

if (timelineEndYear < timelineStartYear) {
  throw new Error(
    `[learningTimeline] timelineEndYear (${timelineEndYear}) must be >= timelineStartYear (${timelineStartYear})`,
  );
}

/** Keep aligned with progress on Harvard CS50 Python — About page references this. */
export const cs50pWeekCurrent = 5;

export type TimelineChapter = {
  year: number;
  month?: number;
  endYear?: number;
  endMonth?: number;
  title: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
};

export const timelineChapters: TimelineChapter[] = [
  {
    year: 2010,
    endYear: 2013,
    title: "Biola: film—and the long walk",
    body:
      "I majored in film production at Biola with Hollywood in mind. Projects happened, but none turned into the break you dream about—still, it was the first stretch where I treated creative work like a craft. What stayed with me most wasn’t a reel: I left campus on foot and walked roughly four hundred miles toward San Jose over about a month—part pilgrimage, part stubborn proof that I could finish something that demanding.",
  },
  {
    year: 2014,
    endYear: 2014,
    title: "Gearing up",
    body:
      "A quieter year of preparation—wrapping up loose ends and getting ready for what came next: a YWAM mission in early 2015, then heading overseas later that year.",
  },
  {
    year: 2015,
    month: 0,
    endYear: 2015,
    endMonth: 7,
    title: "YWAM — Nepal",
    body:
      "I joined YWAM from January through August 2015. Mid-mission, Nepal was struck by a devastating earthquake in April—we made it through by grace; it was harrowing, and I’ll never forget how beautiful the country and its people were in the middle of so much loss.",
  },
  {
    year: 2015,
    month: 8,
    endYear: 2017,
    endMonth: 2,
    title: "Peace Corps — Mozambique",
    body:
      "In September I deployed with the Peace Corps to Mueda, in Mozambique’s Cabo Delgado province—rural compared to the cities, with more complexity than a short blurb can hold. My roommate and I wrestled with what education could realistically become there; it was sobering. Adaptation wasn’t optional, and sometimes you still fell short—but a few students might carry something forward, and that possibility kept me going. I left the field early, around March 2017, for safety reasons—but those seasons reshaped how I think about risk, humility, and showing up anyway.",
    imageSrc: "/images/little mueda 01.jpg",
    imageAlt: "Mozambique — Mueda",
  },
  {
    year: 2017,
    month: 3,
    endYear: 2019,
    endMonth: 11,
    title: "Finding footing at home",
    body:
      "After I returned in March 2017, I tried to pick filmmaking back up—some of that work lives in my Creative section—while I relearned how to feel at home in the U.S. Toward the end of 2019 I drove for Amazon and burned through podcasts just to stay oriented. I moved from San Jose to Surprise, Arizona in spring 2019, picked up odd jobs while I hunted for anything steady, and later that year started talking with the woman who’d become my wife. I landed a call-center role with Alaska USA (now Global Credit Union)—the anchor job that’s still part of my story today.",
  },
  {
    year: 2020,
    endYear: 2024,
    title: "Marriage, QA, and growing family",
    body:
      "We married in August 2020. I was promoted into quality assurance—where I still focus today—while life tilted toward being a husband and dad. Our daughter arrived in August 2022; most of my energy went toward showing up at home well, not chasing the spotlight.",
  },
  {
    year: 2025,
    endYear: 2027,
    title: "Twins & learning to code",
    body:
      "Our twins were born in January 2025—beautiful chaos. Later that year I committed to learning to code in earnest: I started Harvard’s CS50P (Python) in December 2025 and I’m still working through it—currently around Unit 5—while juggling family and Global Credit Union.",
  },
];

function warnIfChaptersOutsideTimelineRange() {
  if (process.env.NODE_ENV === "production") return;

  let earliest = Infinity;
  let latest = -Infinity;
  for (const c of timelineChapters) {
    earliest = Math.min(earliest, c.year);
    const endY = c.endYear ?? c.year;
    latest = Math.max(latest, endY, c.year);
  }

  if (earliest < timelineStartYear) {
    console.warn(
      `[learningTimeline] Earliest chapter year is ${earliest}, but timelineStartYear is ${timelineStartYear}. ` +
        `Lower timelineStartYear or those years will not appear on the ruler.`,
    );
  }
  if (latest > timelineEndYear) {
    console.warn(
      `[learningTimeline] Chapter data extends past ${latest}, but timelineEndYear is ${timelineEndYear}. ` +
        `Raise timelineEndYear or content after ${timelineEndYear} will be clamped.`,
    );
  }
}

warnIfChaptersOutsideTimelineRange();
