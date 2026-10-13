import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cancelRender, continueRender, delayRender } from 'remotion';
import { fontsReady } from '../fonts';

export type Box = { x: number; y: number; w: number; h: number };

/**
 * Untransformed layout box of `el` relative to `root` (offset* ignores CSS transforms, so the
 * slide/drift/rise animations and the Studio preview scale don't leak into the measurement).
 */
export function layoutBox(el: HTMLElement, root: HTMLElement): Box {
  let x = 0, y = 0;
  let e: HTMLElement | null = el;
  while (e && e !== root) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/**
 * Runs `measure` once after mount (fonts loaded) and holds the frame with delayRender until
 * the measured value has been rendered. `measure` may throw to fail the render with a message.
 */
export function useMeasure<T>(measure: () => T, label: string): T | null {
  const [handle] = useState(() => delayRender(`Measuring ${label}`));
  const [value, setValue] = useState<T | null>(null);
  const done = useRef(false);
  const release = () => {
    if (!done.current) {
      done.current = true;
      continueRender(handle);
    }
  };

  useLayoutEffect(() => {
    let live = true;
    fontsReady()
      .then(() => {
        if (live) setValue(measure());
      })
      .catch((err) => cancelRender(err));
    return () => {
      live = false;
    };
    // measure once per mount; content changes remount the composition
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value !== null) release();
  });
  // a sheet scrubbed out of view in the Studio before measuring finished must not hold the frame
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => release, []);

  return value;
}
