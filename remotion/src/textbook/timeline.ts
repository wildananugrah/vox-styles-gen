// Schedule for the textbook style, a pure function of the content (shared with scripts/stills.mjs).
export const T = {
  SLIDE: 0.8,
  HOOK: 4.6,
  COVER: 8.2,
  P_INTRO: 1.7, P_STEP: 2.3, P_TAIL: 1.4,
  N_INTRO: 1.2, N_STEP: 3.6, N_BARS: 1.2, N_TAIL: 1.0,
  END: 6.4,
};

type Shape = { fps?: number; plates: { items: unknown[] }[]; notes: { points: { bars?: unknown[] }[] } };

export type PlateTimes = { start: number; items: number[]; tail: number; fullAt: number };

export function timeline(c: Shape) {
  let t = T.HOOK + T.COVER;
  const plates: PlateTimes[] = c.plates.map((p) => {
    const start = t, n = p.items.length;
    const items = Array.from({ length: n }, (_, k) => start + T.P_INTRO + k * T.P_STEP);
    const tail = start + T.P_INTRO + n * T.P_STEP;
    t = tail + T.P_TAIL;
    return { start, items, tail, fullAt: tail + 0.9 };
  });
  const nStart = t;
  const points: number[] = [];
  t += T.N_INTRO;
  for (const p of c.notes.points) {
    points.push(t);
    t += T.N_STEP + (p.bars?.length ? T.N_BARS : 0);
  }
  const notes = { start: nStart, points, fullAt: t - 0.3 };
  t += T.N_TAIL;
  const end = t;
  const dur = end + T.END;
  const pages = [0, T.HOOK, ...plates.map((p) => p.start), notes.start, end];
  return {
    hook: 0,
    cover: T.HOOK,
    plates,
    notes,
    end,
    dur,
    pages,
    // what scripts/stills.mjs samples: one "full" moment per content page
    chapters: [...plates.map((p) => ({ fullAt: p.fullAt })), { fullAt: notes.fullAt }],
  };
}

export type Timeline = ReturnType<typeof timeline>;
export const durationInFrames = (c: Shape) => Math.round(timeline(c).dur * (c.fps ?? 24));
