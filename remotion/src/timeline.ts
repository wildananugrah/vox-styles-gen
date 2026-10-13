// Scene schedule as a pure function of the content (no DOM), shared by calculateMetadata,
// the scene components and scripts/stills.mjs. Constants are the old promo.html ones.
export const CARD_STEP = 2.45, INTRO = 1.6, SUMMARY = 1.0, SLIDE = 0.75;
export const TITLE_AT = 5.7, CHAPTERS_AT = 11.6, END_LEN = 5.6;

type Shape = { fps?: number; chapters: { cards: unknown[] }[] };

export type ChapterTimes = {
  start: number;
  headerAt: number;  // title settled into the header, no cards yet
  cards: number[];   // moment each card is slapped onto the page
  sumT: number;      // all cards come back to full opacity
  fullAt: number;    // good still time: every card visible
};
export type Timeline = {
  hook: number;
  title: number;
  chapters: ChapterTimes[];
  end: number;
  dur: number;
  sheets: { id: string; t: number }[];
};

export function timeline(c: Shape): Timeline {
  let t = CHAPTERS_AT;
  const chapters = c.chapters.map((ch) => {
    const start = t, n = ch.cards.length;
    const sumT = start + INTRO + n * CARD_STEP;
    t += INTRO + n * CARD_STEP + SUMMARY;
    return {
      start,
      headerAt: start + INTRO,
      cards: Array.from({ length: n }, (_, k) => start + INTRO + k * CARD_STEP),
      sumT,
      fullAt: sumT + 0.6,
    };
  });
  const end = t;
  return {
    hook: 0,
    title: TITLE_AT,
    chapters,
    end,
    dur: end + END_LEN,
    sheets: [
      { id: 'hook', t: 0 },
      { id: 'title', t: TITLE_AT },
      ...chapters.map((ch, i) => ({ id: `ch${i + 1}`, t: ch.start })),
      { id: 'end', t: end },
    ],
  };
}

export const durationInFrames = (c: Shape) => Math.round(timeline(c).dur * (c.fps ?? 24));
