import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Grain, Sheet, Vignette } from './engine/anim';
import { Chapter } from './scenes/Chapter';
import { End } from './scenes/End';
import { Hook } from './scenes/Hook';
import { Title } from './scenes/Title';
import type { Content } from './schema';
import { css } from './styles';
import { timeline } from './timeline';

// The whole video on one 1080x1920 stage. Scenes work in absolute seconds (t), so every timing
// number matches the old promo.html engine.
export const VoxVideo: React.FC<Content> = (c) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tl = timeline(c);
  const vars = { count: c.chapters.reduce((n, ch) => n + ch.cards.length, 0), chapters: c.chapters.length };
  const next = (i: number) => tl.sheets[i + 1]?.t;

  return (
    <div className="vox">
      <style>{css}</style>
      <Sheet t={t} start={0} next={next(0)} dur={tl.dur} first z={1}>
        <Hook t={t} strips={c.hook.strips} lines={c.hook.lines} vars={vars} />
      </Sheet>
      <Sheet t={t} start={tl.title} next={next(1)} dur={tl.dur} z={2}>
        <Title t={t} kicker={c.titleCard.kicker} head={c.titleCard.head} item={c.item} vars={vars}
          toc={c.chapters.map((ch) => ({ toc: ch.toc, n: ch.cards.length }))} />
      </Sheet>
      {c.chapters.map((ch, ci) => (
        <Sheet key={ci} t={t} start={tl.chapters[ci].start} next={next(2 + ci)} dur={tl.dur} z={3 + ci}>
          <Chapter t={t} ci={ci} total={c.chapters.length} ch={ch} tm={tl.chapters[ci]} />
        </Sheet>
      ))}
      <Sheet t={t} start={tl.end} dur={tl.dur} z={20} className="end">
        <End t={t} TE={tl.end} kicker={c.end.kicker} head={c.end.head} save={c.end.save} ask={c.end.ask} vars={vars} />
      </Sheet>
      <Grain t={t} />
      <Vignette />
    </div>
  );
};
