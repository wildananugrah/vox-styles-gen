import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { timeline } from '../textbook/timeline';
import { SetPiece } from './parts';
import { Cover, End, Hook, Notes, Plate } from './scenes';
import type { PaperContent } from './schema';
import { pcCss } from './styles';
import { VibeContext } from './vibe';

// Cut-paper diorama explainer on one 1080x1920 stage. Each scene is a set piece that slides
// up on twos; fibres, grain and miniature-set lighting sit over everything.
export const PaperVideo: React.FC<PaperContent> = (c) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tl = timeline(c);
  const next = (i: number) => tl.pages[i + 1];
  const np = c.plates.length;
  return (
    <VibeContext.Provider value={c.vibe ?? 'pastel'}>
    <div className={`pc ${c.vibe ?? 'pastel'}`}>
      <style>{pcCss}</style>
      <SetPiece t={t} start={0} next={next(0)} first z={1}><Hook t={t} h={c.hook} /></SetPiece>
      <SetPiece t={t} start={tl.cover} next={next(1)} z={2}><Cover t={t} t0={tl.cover} c={c.cover} /></SetPiece>
      {c.plates.map((p, i) => (
        <SetPiece key={i} t={t} start={tl.plates[i].start} next={next(2 + i)} z={3 + i}>
          <Plate t={t} p={p} tm={tl.plates[i]} idx={i} badge={c.badge} />
        </SetPiece>
      ))}
      <SetPiece t={t} start={tl.notes.start} next={next(2 + np)} z={10}><Notes t={t} n={c.notes} tl={tl} idx={np} badge={c.badge} /></SetPiece>
      <SetPiece t={t} start={tl.end} z={11}><End t={t} t0={tl.end} e={c.end} /></SetPiece>
      <div className="fibers" />
      <div className="light" />
      <div className="grain" style={{ backgroundPosition: `${(Math.floor(t * 12) * 137) % 512}px ${(Math.floor(t * 12) * 241) % 512}px` }} />
    </div>
    </VibeContext.Provider>
  );
};
