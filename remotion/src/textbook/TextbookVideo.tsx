import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Grain, Vignette } from '../engine/anim';
import { Page } from './parts';
import { Cover, End, Hook, Notes, Plate } from './scenes';
import type { TextbookContent } from './schema';
import { tbCss } from './styles';
import { timeline } from './timeline';

// Vintage-textbook explainer on one 1080x1920 stage; every page turns in from the right.
export const TextbookVideo: React.FC<TextbookContent> = (c) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tl = timeline(c);
  const next = (i: number) => tl.pages[i + 1];
  const np = c.plates.length;
  return (
    <div className="tb">
      <style>{tbCss}</style>
      <Page t={t} start={0} next={next(0)} dur={tl.dur} first z={1} seed={1}>
        <Hook t={t} h={c.hook} />
      </Page>
      <Page t={t} start={tl.cover} next={next(1)} dur={tl.dur} z={2} seed={2}>
        <Cover t={t} t0={tl.cover} c={c.cover} />
      </Page>
      {c.plates.map((p, i) => (
        <Page key={i} t={t} start={tl.plates[i].start} next={next(2 + i)} dur={tl.dur} z={3 + i} seed={3 + i}>
          <Plate t={t} p={p} tm={tl.plates[i]} idx={i} head={c.runningHead} folio={c.firstPage + i} />
        </Page>
      ))}
      <Page t={t} start={tl.notes.start} next={next(2 + np)} dur={tl.dur} z={10} seed={9}>
        <Notes t={t} n={c.notes} tl={tl} idx={np} head={c.runningHead} folio={c.firstPage + np} />
      </Page>
      <Page t={t} start={tl.end} dur={tl.dur} z={11} seed={11}>
        <End t={t} t0={tl.end} e={c.end} head={c.runningHead} folio={c.firstPage + np + 1} />
      </Page>
      <Grain t={t} />
      <Vignette />
    </div>
  );
};
