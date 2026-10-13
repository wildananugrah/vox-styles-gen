// Schedule for the collage style, a pure function of the content (shared with scripts/stills.mjs).
export const T = { SLIDE: 0.5, HOOK: 4.4, INTRO: 5.8, LESSON: 7.4, BONUS: 7.6, END: 6.2 };

type Shape = { fps?: number; lessons: unknown[] };

export function timeline(c: Shape) {
  const intro = T.HOOK;
  const lessons = c.lessons.map((_, i) => intro + T.INTRO + i * T.LESSON);
  const bonus = intro + T.INTRO + c.lessons.length * T.LESSON;
  const end = bonus + T.BONUS;
  const dur = end + T.END;
  return {
    hook: 0,
    intro,
    lessons,
    bonus,
    end,
    dur,
    pages: [0, intro, ...lessons, bonus, end],
    // what scripts/stills.mjs samples: one "full" moment per content page
    chapters: [...lessons.map((s) => ({ fullAt: s + T.LESSON - 0.6 })), { fullAt: bonus + T.BONUS - 0.6 }],
  };
}

export type Timeline = ReturnType<typeof timeline>;
export const durationInFrames = (c: Shape) => Math.round(timeline(c).dur * (c.fps ?? 30));
