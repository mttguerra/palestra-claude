import gsap from 'gsap';

export const EASE = {
  snappy: 'power3.out',
  explosive: 'back.out(1.5)',
  bounceIn: 'back.out(2)',
  exit: 'power2.in',
  smooth: 'sine.inOut',
};

export const DURATION = {
  fast: 0.2,
  base: 0.45,
  slow: 0.65,
  pulse: 1.6,
};

export function pulse(target, options = {}) {
  const { scale = 1.05, duration = DURATION.fast } = options;
  return gsap.fromTo(
    target,
    { scale: 1 },
    { scale, duration, yoyo: true, repeat: 1, ease: EASE.smooth }
  );
}

export function glowLoop(target, color = 'var(--accent)') {
  return gsap.to(target, {
    boxShadow: `0 0 24px ${color}, 0 0 48px ${color}`,
    duration: DURATION.pulse,
    yoyo: true,
    repeat: -1,
    ease: EASE.smooth,
  });
}

export function staggerIn(targets, options = {}) {
  const { y = 40, stagger = 0.08, duration = DURATION.base } = options;
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, ease: EASE.explosive }
  );
}

export function enterFrom(target, options = {}) {
  const { y = 30, x = 0, duration = DURATION.base, ease = EASE.explosive, ...rest } = options;
  return gsap.fromTo(
    target,
    { opacity: 0, y, x },
    { opacity: 1, y: 0, x: 0, duration, ease, ...rest }
  );
}

export function fadeOut(target, options = {}) {
  const { duration = 0.25 } = options;
  return gsap.to(target, { opacity: 0, duration, ease: EASE.exit });
}
