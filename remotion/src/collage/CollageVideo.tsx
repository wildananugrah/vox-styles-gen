import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useCollageFonts } from './fonts';
import { Sheet } from './parts';
import { Bonus, End, Hook, Intro, LessonScene } from './scenes';
import type { CollageContent } from './schema';
import { clCss } from './styles';
import { timeline } from './timeline';

// Paper collage explainer on a 1080x1350 (4:5) stage: each scene is a sheet that slides in on
// twos; its pieces slap, stamp and slide in, then jitter at 6 fps. Vignette and grain on top.
export const CollageVideo: React.FC<CollageContent> = (c) => {
  useCollageFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tl = timeline(c);
  const next = (i: number) => tl.pages[i + 1];
  const n = c.lessons.length;
  const g = Math.floor(t * 12);
  return (
    <div className="cl">
      <style>{clCss}</style>
      <Sheet t={t} start={0} next={next(0)} first z={1}><Hook t={t} s={0} h={c.hook} photo={c.photo} /></Sheet>
      <Sheet t={t} start={tl.intro} next={next(1)} z={2}><Intro t={t} s={tl.intro} c={c.intro} n={n} photo={c.photo} /></Sheet>
      {c.lessons.map((l, i) => (
        <Sheet key={i} t={t} start={tl.lessons[i]} next={next(2 + i)} z={3 + i}>
          <LessonScene t={t} s={tl.lessons[i]} l={l} i={i} n={n} photo={c.photo} badge={c.badge} />
        </Sheet>
      ))}
      <Sheet t={t} start={tl.bonus} next={next(2 + n)} z={20}><Bonus t={t} s={tl.bonus} b={c.bonus} photo={c.photo} badge={c.badge} /></Sheet>
      <Sheet t={t} start={tl.end} z={21}><End t={t} s={tl.end} e={c.end} photo={c.photo} /></Sheet>
      <div className="vig" />
      <div className="grain" style={{ backgroundPosition: `${(g * 137) % 512}px ${(g * 241) % 512}px` }} />
    </div>
  );
};
