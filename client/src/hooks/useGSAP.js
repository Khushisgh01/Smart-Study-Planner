// ✅ FIX Bug 36: useGSAP.js was completely empty — any import would return undefined.
//               Now exports two useful, production-ready hooks used throughout the app.

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * useGSAPEntrance
 * Animates the direct children of the returned `ref` with a staggered slide-up on mount.
 *
 * @param {object} options
 * @param {number}  options.stagger   - Delay between each child (default 0.1)
 * @param {number}  options.duration  - Per-item duration (default 0.5)
 * @param {number}  options.delay     - Initial delay before sequence starts (default 0)
 * @param {string}  options.ease      - GSAP ease string (default 'power2.out')
 * @param {number}  options.y         - Starting Y offset in px (default 28)
 * @param {Array}   options.deps      - Extra useEffect dependencies (default [])
 * @returns {React.RefObject}
 *
 * Usage:
 *   const ref = useGSAPEntrance({ stagger: 0.08 });
 *   return <div ref={ref}>...</div>;
 */
export function useGSAPEntrance({
  stagger  = 0.1,
  duration = 0.5,
  delay    = 0,
  ease     = 'power2.out',
  y        = 28,
  deps     = [],
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const children = [...ref.current.children];
    if (!children.length) return;

    gsap.fromTo(
      children,
      { opacity: 0, y },
      { opacity: 1, y: 0, stagger, duration, delay, ease }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * useGSAPHover
 * Returns event handlers (onMouseEnter / onMouseLeave) that apply a lift + scale
 * effect via GSAP — much smoother than CSS transitions for complex layered elements.
 *
 * @param {object} options
 * @param {number}  options.scale  - Target scale on hover (default 1.04)
 * @param {number}  options.y      - Y translation on hover (default -4)
 * @param {number}  options.dur    - Animation duration in seconds (default 0.3)
 * @param {string}  options.ease   - GSAP ease string (default 'back.out(1.5)')
 * @returns {{ onMouseEnter, onMouseLeave }}
 *
 * Usage:
 *   const hover = useGSAPHover();
 *   return <div ref={elRef} {...hover}>...</div>;
 *   // Note: the target of the GSAP tween is e.currentTarget, so no separate ref needed.
 */
export function useGSAPHover({
  scale = 1.04,
  y     = -4,
  dur   = 0.3,
  ease  = 'back.out(1.5)',
} = {}) {
  return {
    onMouseEnter: (e) => gsap.to(e.currentTarget, { scale, y, duration: dur, ease }),
    onMouseLeave: (e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: dur, ease: 'power2.out' }),
  };
}

// Default export — the entrance hook (most commonly used)
export default useGSAPEntrance;