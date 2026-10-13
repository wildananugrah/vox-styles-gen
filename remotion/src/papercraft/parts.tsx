import React from 'react';
import { staticFile } from 'remotion';
import { kf, type Key } from '../engine/kf';
import { T } from '../textbook/timeline';
import { beat, StreetBackdrop, Swag, useVibe } from './vibe';

// Cut-paper diorama toolkit: stop-motion time, scissor-cut shapes, paper layers with depth
// shadows, the backdrop set, and the paper mascot.

/** Stop-motion clock: animation advances on twos (12 steps per second). */
export const q = (t: number, fps = 12) => Math.floor(t * fps) / fps;

/** Deterministic pseudo-random in [0,1). */
export const rnd = (seed: number, k = 0) => {
  const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Scissor-cut rectangle: a clip-path polygon whose edges wander by up to `amp` px. */
export function cutRect(w: number, h: number, seed: number, amp = 5, step = 38): string {
  const pts: string[] = [];
  const j = (k: number) => rnd(seed, k) * amp;
  let k = 0;
  for (let x = 0; x < w; x += step) pts.push(`${x}px ${j(k++)}px`);
  for (let y = 0; y < h; y += step) pts.push(`${w - j(k++)}px ${y}px`);
  for (let x = w; x > 0; x -= step) pts.push(`${x}px ${h - j(k++)}px`);
  for (let y = h; y > 0; y -= step) pts.push(`${j(k++)}px ${y}px`);
  return `polygon(${pts.join(',')})`;
}

/** Scissor-cut blob (SVG path) around an ellipse, for hills, clouds, bodies. */
export function cutBlob(cx: number, cy: number, rx: number, ry: number, seed: number, n = 22, wob = 0.07): string {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + (rnd(seed, i) - 0.5) * 2 * wob;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * r).toFixed(1)} ${(cy + Math.sin(a) * ry * r).toFixed(1)}`;
  }
  return d + 'Z';
}

/** Small per-step wobble (on fours) that makes paper pieces "boil" like replacement animation. */
export const boil = (t: number, seed: number, px = 1.6, deg = 0.5) => {
  const f = Math.floor(t * 6);
  return { x: (rnd(seed + f, 1) - 0.5) * 2 * px, y: (rnd(seed + f, 2) - 0.5) * 2 * px, r: (rnd(seed + f, 3) - 0.5) * 2 * deg };
};

/** Pop-in on twos: 0 → overshoot → 1, stepped. */
export const pop = (t: number, t0: number, d = 0.35) => kf(q(t), [[t0, 0], [t0 + d * 0.6, 1.14, 'out'], [t0 + d, 1, 'inout']]);

const FIBERS = `url(${staticFile('papercraft/fibers.png')})`;

/** One sheet of construction paper: scissor-cut edge, fibres, soft shadow onto the layer below. */
export const Paper: React.FC<{
  x: number; y: number; w: number; h: number; color: string; seed: number;
  rot?: number; scale?: number; depth?: number; amp?: number; style?: React.CSSProperties; className?: string; children?: React.ReactNode;
}> = ({ x, y, w, h, color, seed, rot = 0, scale = 1, depth = 1, amp = 5, style, className, children }) => (
  <div
    className={`pp ${className ?? ''}`}
    style={{
      left: x, top: y, width: w, height: h,
      transform: `rotate(${rot}deg) scale(${scale})`,
      filter: `drop-shadow(0 ${4 + depth * 5}px ${5 + depth * 6}px rgba(90,50,30,${0.16 + depth * 0.05}))`,
      ...style,
    }}
  >
    <div className="pp-in" style={{ clipPath: cutRect(w, h, seed, amp), background: `${FIBERS} 0 0/512px 512px, ${color}` }} />
    {children !== undefined && <div className="pp-c">{children}</div>}
  </div>
);

export type Theme = { sky: string; far: string; mid: string; near: string; accent: string; deep: string };
export const THEMES: Record<string, Theme> = {
  hook: { sky: '#FBE3D2', far: '#F4C7C3', mid: '#D9C7EE', near: '#F7D9A8', accent: '#F28C7A', deep: '#4A3046' },
  cover: { sky: '#FFF0D9', far: '#CFE6D4', mid: '#F8D6A5', near: '#F5B9A8', accent: '#F28C7A', deep: '#4A3046' },
  mint: { sky: '#E6F4E8', far: '#BFE3C8', mid: '#9FD3B0', near: '#F8E7C4', accent: '#4FA77A', deep: '#2F4A3E' },
  butter: { sky: '#FFF4D6', far: '#F8DE8C', mid: '#F3C969', near: '#F6D5B7', accent: '#E0A12F', deep: '#4D3A1F' },
  coral: { sky: '#FDE5DE', far: '#F6B3A0', mid: '#EF9C8A', near: '#F8DCCB', accent: '#E0624C', deep: '#4D2A2A' },
  lilac: { sky: '#EFE7F8', far: '#D9C7EE', mid: '#C3AEE3', near: '#F6DCC6', accent: '#8B6CC4', deep: '#3A2E52' },
};

/**
 * The miniature set: a coloured backdrop, a hanging paper sun and clouds on threads, and
 * three layers of scissor-cut hills with soft shadows between them. `t` drives a gentle sway.
 */
export const Backdrop: React.FC<{ t: number; th: Theme; seed: number }> = ({ t, th, seed }) => {
  const vibe = useVibe();
  if (vibe === 'hiphop') return <StreetBackdrop t={t} th={th} seed={seed} />;
  const tq = q(t, 6);
  const sway = (k: number) => Math.sin(tq * 1.3 + k) * 2.2;
  const hill = (y: number, amp: number, s: number) => {
    let d = `M-40 1960 L-40 ${y}`;
    for (let x = -40; x <= 1120; x += 60) d += ` L${x} ${(y + Math.sin(x / 170 + s) * amp + (rnd(s, x) - 0.5) * 10).toFixed(1)}`;
    return d + ' L1120 1960 Z';
  };
  const clouds = [
    { x: 160 + rnd(seed, 1) * 120, y: 92, s: 1 },
    { x: 760 + rnd(seed, 2) * 140, y: 70, s: 0.8 },
  ];
  return (
    <div className="set" style={{ background: th.sky }}>
      <svg width={1080} height={1920} className="abs" style={{ left: 0, top: 0 }}>
        {clouds.map((c, i) => (
          <g key={i} transform={`rotate(${sway(i)} ${c.x} 0)`}>
            <line x1={c.x} y1={0} x2={c.x} y2={c.y - 30} stroke="rgba(80,60,60,.45)" strokeWidth={2} />
            <path d={cutBlob(c.x, c.y, 90 * c.s, 34 * c.s, seed + i, 26, 0.16)} fill="#FFFDF8" className="sh1" />
          </g>
        ))}
        {[{ x: 70, s: 1.1 }, { x: 990, s: 0.9 }, { x: 870, s: 0.6 }].map((tr, i) => (
          <g key={i} className="sh1" transform={`rotate(${sway(i + 3) * 0.5} ${tr.x} 1560)`}>
            <rect x={tr.x - 9 * tr.s} y={1560 - 120 * tr.s} width={18 * tr.s} height={130 * tr.s} fill="#B98A62" />
            <path d={cutBlob(tr.x, 1560 - 170 * tr.s, 82 * tr.s, 96 * tr.s, seed + 10 + i, 18, 0.1)} fill={th.mid} />
            <path d={cutBlob(tr.x - 14 * tr.s, 1560 - 186 * tr.s, 46 * tr.s, 50 * tr.s, seed + 20 + i, 14, 0.12)} fill={th.far} opacity={0.9} />
          </g>
        ))}
        <path d={hill(1560, 40, seed)} fill={th.far} className="sh1" />
        <path d={hill(1660, 30, seed + 2)} fill={th.mid} className="sh2" />
        {Array.from({ length: 7 }, (_, i) => {
          const x = 60 + i * 160 + rnd(seed, i + 40) * 60, y = 1690 + rnd(seed, i + 50) * 30;
          return (
            <g key={i} className="sh1" transform={`rotate(${sway(i) * 0.8} ${x} ${y})`}>
              <path d={`M${x - 16} ${y} L${x - 6} ${y - 46} L${x} ${y - 8} L${x + 8} ${y - 54} L${x + 18} ${y}Z`} fill={th.accent} opacity={0.75} />
            </g>
          );
        })}
        <path d={hill(1770, 22, seed + 4)} fill={th.near} className="sh3" />
      </svg>
    </div>
  );
};

/** A scene "set" that slides up on twos when its time comes, and is pushed up when the next arrives. */
export const SetPiece: React.FC<{
  t: number; start: number; next?: number; first?: boolean; z: number; children: React.ReactNode;
}> = ({ t, start, next, first, z, children }) => {
  if (t < start || (next !== undefined && t >= next + T.SLIDE)) return null;
  const tq = q(t);
  const yk: Key[] = first ? [[0, 0]] : [[start, 1920], [start + T.SLIDE, 0, 'inout']];
  if (next !== undefined) yk.push([next, 0], [next + T.SLIDE, -420, 'inout']);
  return (
    <div className="setpiece" style={{ zIndex: z, transform: `translateY(${kf(tq, yk)}px)` }}>
      {children}
      {next !== undefined && <div className="shade" style={{ opacity: kf(tq, [[next, 0], [next + T.SLIDE, 0.35, 'inout']]) }} />}
    </div>
  );
};

/** Text that pops in word by word on twos. */
export const PopWords: React.FC<{ t: number; t0: number; text: string; step?: number }> = ({ t, t0, text, step = 0.08 }) => (
  <>
    {text.split(/\s+/).map((w, i) => {
      const s = pop(t, t0 + i * step, 0.3);
      return (
        <React.Fragment key={i}>
          {i > 0 && ' '}
          <span style={{ display: 'inline-block', transform: `scale(${s})`, opacity: s > 0 ? 1 : 0 }}>{w}</span>
        </React.Fragment>
      );
    })}
  </>
);

export type Mood = 'happy' | 'shock' | 'talk' | 'wave';

/** The mascot: a cut-paper avocado half on a little stand, with googly eyes and paper arms. */
export const Mascot: React.FC<{ t: number; x: number; y: number; size?: number; mood: Mood; flip?: boolean }> = ({ t, x, y, size = 300, mood, flip }) => {
  const tq = q(t);
  const b = boil(t, 77, 1.2, 0.8);
  const vibe = useVibe();
  const hop = vibe === 'hiphop' ? beat(t) * (mood === 'shock' ? 4 : 14) : Math.abs(Math.sin(tq * Math.PI * 1.5)) * (mood === 'shock' ? 4 : 10);
  const blink = Math.floor(t * 12) % 41 === 0;
  const talking = mood === 'talk' && Math.floor(t * 6) % 2 === 0;
  const wave = mood === 'wave' ? Math.sin(tq * 9) * 22 : 0;
  return (
    <div className="abs" style={{ left: x, top: y, width: size, height: size * 1.25, transform: `translate(${b.x}px,${b.y - hop}px) rotate(${b.r}deg) scaleX(${flip ? -1 : 1})` }}>
      <svg width={size} height={size * 1.25} viewBox="0 0 300 375" style={{ overflow: 'visible' }}>
        <g className="sh2">
          <rect x={140} y={300} width={20} height={60} fill="#C99B6B" />
          <path d={cutBlob(150, 362, 70, 14, 5, 18, 0.05)} fill="#B9845A" />
        </g>
        {/* arms */}
        <path d="M58 200 C 20 210, 10 240, 18 262" stroke="#3E7A45" strokeWidth={13} fill="none" strokeLinecap="round" />
        <g transform={`rotate(${-wave} 242 200)`}>
          <path d={mood === 'wave' || mood === 'shock' ? 'M242 200 C 280 180, 292 150, 284 118' : 'M242 200 C 280 210, 290 240, 282 262'} stroke="#3E7A45" strokeWidth={13} fill="none" strokeLinecap="round" />
        </g>
        <g className="sh2">
          <path d="M150 20 C 215 20, 255 120, 262 200 C 270 290, 215 330, 150 330 C 85 330, 30 290, 38 200 C 45 120, 85 20, 150 20 Z" fill="#3E7A45" />
        </g>
        <g className="sh1">
          <path d="M150 42 C 205 42, 238 130, 243 202 C 248 280, 205 308, 150 308 C 95 308, 52 280, 57 202 C 62 130, 95 42, 150 42 Z" fill="#D6E89A" />
        </g>
        <g className="sh1">
          <path d={cutBlob(150, 232, 52, 54, 9, 20, 0.04)} fill="#B9784C" />
          <path d={cutBlob(136, 214, 14, 10, 3, 10, 0.1)} fill="#D9A07A" />
        </g>
        {/* face */}
        {[118, 182].map((ex, i) => (
          <g key={i}>
            <circle cx={ex} cy={128} r={22 * (mood === 'shock' ? 1.15 : 1)} fill="#FFFDF7" className="sh1" />
            {blink ? <path d={`M${ex - 14} 128 L${ex + 14} 128`} stroke="#2B2230" strokeWidth={5} strokeLinecap="round" />
              : <circle cx={ex + (mood === 'shock' ? 0 : 4)} cy={mood === 'shock' ? 126 : 132} r={mood === 'shock' ? 8 : 11} fill="#2B2230" />}
          </g>
        ))}
        <ellipse cx={92} cy={168} rx={16} ry={9} fill="#F4A9A0" opacity={0.85} />
        <ellipse cx={208} cy={168} rx={16} ry={9} fill="#F4A9A0" opacity={0.85} />
        {mood === 'shock' ? <ellipse cx={150} cy={172} rx={15} ry={19} fill="#7A2E33" />
          : talking ? <ellipse cx={150} cy={168} rx={20} ry={13} fill="#7A2E33" />
            : <path d="M128 162 C 138 178, 162 178, 172 162" stroke="#7A2E33" strokeWidth={7} fill="none" strokeLinecap="round" />}
        {vibe === 'hiphop' && <Swag shock={mood === 'shock'} />}
      </svg>
    </div>
  );
};

/** Paper glass of juice with a striped straw. */
export const Juice: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const b = boil(t, 31);
  return (
    <svg className="abs" width={240} height={340} style={{ left: x, top: y, overflow: 'visible', transform: `translate(${b.x}px,${b.y}px) rotate(${b.r - 3}deg)` }}>
      <g className="sh2">
        <path d="M150 10 L175 0 L130 150" stroke="#F28C7A" strokeWidth={14} fill="none" />
        <path d="M150 10 L175 0" stroke="#FFF" strokeWidth={14} strokeDasharray="8 10" fill="none" />
      </g>
      <path d="M30 70 L210 70 L188 320 L52 320 Z" fill="#EAF6FA" className="sh2" />
      <path d="M38 120 L202 120 L188 312 L56 312 Z" fill="#F6A94E" className="sh1" />
      <path d="M50 130 L80 130 L72 290 L62 290 Z" fill="#FFD9A0" opacity={0.8} />
      <path d={cutBlob(205, 95, 34, 34, 4, 16, 0.05)} fill="#FFE08A" className="sh1" />
      <path d="M205 66 L205 124 M178 95 L232 95" stroke="#F6C453" strokeWidth={4} />
    </svg>
  );
};

/** Paper plate of agar-agar jellies. */
export const Jelly: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => {
  const b = boil(t, 53);
  const cubes = [
    { x: 40, y: 70, c: '#F49AB0' }, { x: 140, y: 50, c: '#9FD8B6' }, { x: 230, y: 74, c: '#FFD66E' }, { x: 95, y: 120, c: '#C7B3EE' }, { x: 190, y: 124, c: '#F7A27A' },
  ];
  return (
    <svg className="abs" width={340} height={240} style={{ left: x, top: y, overflow: 'visible', transform: `translate(${b.x}px,${b.y}px) rotate(${b.r + 2}deg)` }}>
      <path d={cutBlob(170, 190, 168, 44, 8, 30, 0.03)} fill="#FFFDF7" className="sh2" />
      <path d={cutBlob(170, 186, 120, 26, 9, 26, 0.03)} fill="#F2E9DC" />
      {cubes.map((c, i) => (
        <g key={i} className="sh1">
          <path d={`M${c.x} ${c.y + 70} L${c.x + 8} ${c.y} Q${c.x + 40} ${c.y - 14} ${c.x + 72} ${c.y} L${c.x + 80} ${c.y + 70} Z`} fill={c.c} />
          <path d={`M${c.x + 18} ${c.y + 12} L${c.x + 26} ${c.y + 12} L${c.x + 22} ${c.y + 50} Z`} fill="#FFFFFF" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
};

/** Starburst sticker. */
export const Burst: React.FC<{ w: number; h: number; color: string; seed: number }> = ({ w, h, color, seed }) => {
  let d = '';
  const n = 26;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r = i % 2 ? 0.82 : 1 + rnd(seed, i) * 0.05;
    d += `${i ? 'L' : 'M'}${(w / 2 + Math.cos(a) * (w / 2) * r).toFixed(1)} ${(h / 2 + Math.sin(a) * (h / 2) * r).toFixed(1)}`;
  }
  return (
    <svg width={w} height={h} className="abs" style={{ left: 0, top: 0, overflow: 'visible' }}>
      <path d={d + 'Z'} fill={color} className="sh2" />
    </svg>
  );
};
