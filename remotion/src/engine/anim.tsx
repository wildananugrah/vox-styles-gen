import React, { forwardRef } from 'react';
import type { Seg } from '../markup';
import { SLIDE } from '../timeline';
import { kf, type Key } from './kf';

/** Same transform string the old engine wrote: translate, then scale, then rotate. */
export const tf = (x = 0, y = 0, s = 1, r = 0) => `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`;

/**
 * A paper sheet: the one transition. Slides up over the previous sheet, is pushed back and
 * shaded when the next one arrives, and drifts (slow zoom) the whole time it is on screen.
 * Renders nothing while off screen, so its children mount only when visible.
 */
export const Sheet: React.FC<{
  t: number; start: number; next?: number; dur: number; first?: boolean; z: number;
  className?: string; children: React.ReactNode;
}> = ({ t, start, next, dur, first, z, className, children }) => {
  if (t < start || (next !== undefined && t >= next + SLIDE)) return null;
  const yk: Key[] = first ? [[0, 0]] : [[start, 1920], [start + SLIDE, 0, 'inout']];
  if (next !== undefined) yk.push([next, 0], [next + SLIDE, -300, 'inout']);
  const drift = kf(t, [[start, 1], [next !== undefined ? next + SLIDE : dur, next !== undefined ? 1.03 : 1.02, 'lin']]);
  return (
    <div className={`sheet ${className ?? ''}`} style={{ zIndex: z, transform: tf(0, kf(t, yk)) }}>
      <div className="drift" style={{ transform: tf(0, 0, drift) }}>{children}</div>
      {next !== undefined && <div className="shade" style={{ opacity: kf(t, [[next, 0], [next + SLIDE, 0.45, 'inout']]) }} />}
    </div>
  );
};

/** Highlighter swept left to right behind its parent (.hlwrap / .tag). */
export const Sweep: React.FC<{ t: number; t0: number; d?: number }> = ({ t, t0, d = 0.4 }) => (
  <i className="mk" style={{ transform: `scaleX(${kf(t, [[t0, 0], [t0 + d, 1, 'out']])})` }} />
);

/** A hand-drawn stroke revealed along its length between t0 and t1. */
export const Ink: React.FC<{ t: number; t0: number; t1: number; d: string; width?: number }> = ({ t, t0, t1, d, width }) => {
  const off = kf(t, [[t0, 1], [t1, 0, 'inout']]);
  return <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={off} strokeWidth={width} opacity={off >= 1 ? 0 : 1} />;
};

/** A full-stage SVG overlay for ink strokes. */
export const InkLayer: React.FC<{ className?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ className, style, children }) => (
  <svg className={`ink ${className ?? ''}`} width={1080} height={1920} style={style}>{children}</svg>
);

/**
 * One word that rises out of its mask. Highlighted words carry their sweep;
 * `color` lets the end card flip a word's colour when the highlighter reaches it.
 */
export const RiseWord = forwardRef<HTMLSpanElement, {
  seg: Seg; t: number; t0: number; dist: number; sweep?: [number, number]; color?: string;
}>(({ seg, t, t0, dist, sweep, color }, ref) => (
  <span className="m">
    <span ref={ref} className={`w${seg.kind === 'hl' ? ' hlwrap' : ''}`} style={{ transform: tf(0, kf(t, [[t0, dist], [t0 + 0.75, 0, 'expo']])), color }}>
      {seg.text}
      {sweep && <Sweep t={t} t0={sweep[0]} d={sweep[1]} />}
    </span>
  </span>
));
RiseWord.displayName = 'RiseWord';

/** Film grain jittering at 12 fps, deterministic from t. */
export const Grain: React.FC<{ t: number }> = ({ t }) => {
  const f = Math.floor(t * 12);
  return <div className="grain" style={{ backgroundPosition: `${(f * 137) % 512}px ${(f * 241) % 512}px` }} />;
};

export const Vignette: React.FC = () => <div className="vig" />;
