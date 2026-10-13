import React, { createContext, useContext } from 'react';
import { cutBlob, q, rnd, type Theme } from './parts';

// Optional "vibe" for the papercraft style. 'hiphop' swaps the hills for a paper street set
// (skyline, brick wall, sidewalk, speakers), dresses the mascot, and pulses things on a beat.
export type Vibe = 'pastel' | 'hiphop';
export const VibeContext = createContext<Vibe>('pastel');
export const useVibe = () => useContext(VibeContext);

/** Beat grid: 92 BPM, so a track dropped on later lines up. */
export const BPM = 92;
const PERIOD = 60 / BPM;

/** 1 on each beat, falling to 0 within a quarter beat (stepped on twos). */
export const beat = (t: number) => {
  const ph = (q(t) % PERIOD) / PERIOD;
  return ph < 0.25 ? 1 - ph / 0.25 : 0;
};

/** The street set: paper skyline, brick wall with a graffiti tag, sidewalk, two speakers. */
export const StreetBackdrop: React.FC<{ t: number; th: Theme; seed: number; tag?: string }> = ({ t, th, seed, tag = 'SERAT' }) => {
  const b = beat(t);
  const tq = q(t, 6);
  const buildings = Array.from({ length: 8 }, (_, i) => {
    const w = 120 + rnd(seed, i) * 70, h = 160 + rnd(seed, i + 9) * 230;
    return { x: -30 + i * 140 + rnd(seed, i + 20) * 30, w, h };
  });
  const WALL = 1390;
  const bricks: React.ReactNode[] = [];
  for (let r = 0; r < 6; r++) {
    for (let c = -1; c < 10; c++) {
      const x = c * 120 + (r % 2 ? 60 : 0) + (rnd(seed + r, c) - 0.5) * 6;
      const y = WALL + 14 + r * 52;
      bricks.push(<rect key={`${r}-${c}`} x={x} y={y} width={110} height={44} rx={3} fill={r % 2 ? th.far : th.mid} opacity={0.85 + rnd(seed, r * 11 + c) * 0.15} />);
    }
  }
  const speaker = (x: number, flip: boolean) => {
    const s = 1 + b * 0.07;
    return (
      <g className="sh2" transform={`translate(${x} 1585)`}>
        <rect x={0} y={0} width={150} height={250} rx={8} fill="#4A3B4A" />
        {[{ y: 70, r: 46 }, { y: 180, r: 34 }].map((c, i) => (
          <g key={i} transform={`translate(75 ${c.y}) scale(${s})`}>
            <circle r={c.r} fill="#2E242E" />
            <circle r={c.r * 0.55} fill={th.accent} />
            <circle r={c.r * 0.18} fill="#FFE07A" />
          </g>
        ))}
        <rect x={flip ? 120 : 14} y={10} width={16} height={8} rx={2} fill="#FFE07A" />
      </g>
    );
  };
  return (
    <div className="set" style={{ background: th.sky }}>
      <svg width={1080} height={1920} className="abs" style={{ left: 0, top: 0 }}>
        {/* hanging stars on threads, like a miniature set */}
        {[{ x: 200, y: 110 }, { x: 860, y: 80 }].map((s, i) => {
          const sway = Math.sin(tq * 1.4 + i) * 3;
          let d = '';
          for (let k = 0; k < 10; k++) {
            const a = (k / 10) * Math.PI * 2 - Math.PI / 2, r = k % 2 ? 18 : 40;
            d += `${k ? 'L' : 'M'}${(s.x + Math.cos(a) * r).toFixed(1)} ${(s.y + Math.sin(a) * r).toFixed(1)}`;
          }
          return (
            <g key={i} transform={`rotate(${sway} ${s.x} 0)`}>
              <line x1={s.x} y1={0} x2={s.x} y2={s.y - 40} stroke="rgba(80,60,60,.45)" strokeWidth={2} />
              <path d={d + 'Z'} fill="#FFE07A" className="sh1" />
            </g>
          );
        })}
        {/* skyline */}
        <g className="sh1">
          {buildings.map((bd, i) => (
            <g key={i}>
              <rect x={bd.x} y={WALL - bd.h} width={bd.w} height={bd.h + 20} fill={i % 2 ? th.near : '#E9D8E8'} />
              {Array.from({ length: Math.floor(bd.h / 60) }, (_, r) => (
                <g key={r}>
                  <rect x={bd.x + 20} y={WALL - bd.h + 22 + r * 60} width={24} height={30} fill={rnd(seed, i * 7 + r) > 0.55 ? '#FFE9A8' : '#FFFDF7'} opacity={0.9} />
                  <rect x={bd.x + bd.w - 44} y={WALL - bd.h + 22 + r * 60} width={24} height={30} fill={rnd(seed, i * 5 + r + 3) > 0.6 ? '#FFE9A8' : '#FFFDF7'} opacity={0.9} />
                </g>
              ))}
            </g>
          ))}
        </g>
        {/* brick wall + graffiti tag */}
        <g className="sh2">
          <rect x={-20} y={WALL} width={1120} height={330} fill="#F3E6DA" />
          {bricks}
        </g>
        <text x={540} y={WALL + 210} textAnchor="middle" className="graf" fill={th.accent} opacity={0.85}
          transform={`rotate(-4 540 ${WALL + 170})`} style={{ fontSize: 170 }}>{tag}</text>
        {/* sidewalk */}
        <path d={cutBlob(540, 1830, 700, 120, seed + 3, 30, 0.02)} fill="#D9CBC0" className="sh3" />
        <rect x={-20} y={1736} width={1120} height={12} fill="#C9B9AE" />
        {speaker(18, false)}
        {speaker(912, true)}
      </svg>
    </div>
  );
};

/** Paper boombox whose speakers thump on the beat. */
export const Boombox: React.FC<{ t: number; x: number; y: number; w?: number; color?: string }> = ({ t, x, y, w = 360, color = '#F28C7A' }) => {
  const s = 1 + beat(t) * 0.09;
  const k = w / 360;
  return (
    <svg className="abs" width={w} height={230 * k} viewBox="0 0 360 230" style={{ left: x, top: y, overflow: 'visible', transform: `translateY(${-beat(t) * 6}px)` }}>
      <g className="sh2">
        <path d="M110 40 L120 6 L240 6 L250 40" stroke="#4A3B4A" strokeWidth={12} fill="none" strokeLinejoin="round" />
        <rect x={0} y={36} width={360} height={190} rx={18} fill={color} />
      </g>
      <rect x={130} y={60} width={100} height={52} rx={6} fill="#4A3B4A" />
      <rect x={140} y={70} width={80} height={32} rx={4} fill="#FFE9A8" />
      {[70, 290].map((cx) => (
        <g key={cx} transform={`translate(${cx} 140) scale(${s})`} className="sh1">
          <circle r={56} fill="#4A3B4A" />
          <circle r={34} fill="#FFFDF7" />
          <circle r={12} fill="#4A3B4A" />
        </g>
      ))}
      {[150, 180, 210].map((bx) => <rect key={bx} x={bx - 9} y={176} width={18} height={14} rx={3} fill="#FFFDF7" />)}
    </svg>
  );
};

/** Cap (worn backwards), shades and a gold chain, layered over the mascot's 300x375 viewBox. */
export const Swag: React.FC<{ shock: boolean }> = ({ shock }) => (
  <>
    <g className="sh1">
      <path d="M86 70 C 92 18, 208 18, 214 70 Z" fill="#7C6BC4" />
      <path d="M150 26 L150 66" stroke="#9C8DE0" strokeWidth={6} />
      <path d={cutBlob(150, 24, 12, 8, 2, 10, 0.1)} fill="#FFE07A" />
      <path d="M200 64 C 240 60, 262 74, 258 88 C 236 84, 214 82, 198 80 Z" fill="#6656B0" />
    </g>
    {!shock && (
      <g className="sh1">
        <rect x={88} y={110} width={60} height={40} rx={14} fill="#2B2230" />
        <rect x={154} y={110} width={60} height={40} rx={14} fill="#2B2230" />
        <path d="M146 124 L156 124" stroke="#2B2230" strokeWidth={8} />
        <path d="M98 118 L118 118" stroke="#8B7CE0" strokeWidth={5} strokeLinecap="round" />
        <path d="M164 118 L184 118" stroke="#8B7CE0" strokeWidth={5} strokeLinecap="round" />
      </g>
    )}
    <g className="sh1">
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI * (0.12 + (i / 12) * 0.76);
        return <circle key={i} cx={150 - Math.cos(a) * 78} cy={200 + Math.sin(a) * 70} r={7} fill="#F2C14E" stroke="#C99A2E" strokeWidth={2} />;
      })}
      <circle cx={150} cy={282} r={22} fill="#F2C14E" stroke="#C99A2E" strokeWidth={3} />
      <text x={150} y={292} textAnchor="middle" style={{ font: '700 28px sans-serif' }} fill="#8A6514">S</text>
    </g>
  </>
);
