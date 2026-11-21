import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, type Variants } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export const INDUSTRIAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const onChange = () => setIsTouch(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isTouch;
}

/* -------------------------------------------------------------------------- */
/* 1. Scroll-Triggered Section & Staggered Content Reveal                     */
/* -------------------------------------------------------------------------- */

interface RevealBlockProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
}

export function RevealBlock({
  children,
  className = '',
  delay = 0,
  duration = 1.3,
  y = 48,
  blur = false,
  once = false,
}: RevealBlockProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y,
        filter: blur ? 'blur(8px)' : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'none',
      }}
      viewport={{
        once,
        amount: 0.12,
        margin: '0px 0px -40px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  scaleFrom?: number;
  once?: boolean;
}

export function StaggerGrid({
  children,
  className = '',
  stagger = 0.1,
  duration = 1.2,
  delay = 0,
  y = 40,
  scaleFrom = 0.95,
  once = false,
}: StaggerGridProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      scale: scaleFrom,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount: 0.1,
        margin: '0px 0px -40px 0px',
      }}
    >
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div
            key={child.key ?? idx}
            variants={itemVariants}
            className="h-full w-full"
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. GSAP Clip-Mask + Scale-Down Image Reveal & Optional Parallax            */
/* -------------------------------------------------------------------------- */

export type RevealDirection = 'up' | 'left' | 'right' | 'center';

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  immediate?: boolean;
  parallax?: boolean;
}

const CLIP_INITIAL: Record<RevealDirection, string> = {
  up: 'inset(18% 0% 0% 0%)',
  left: 'inset(0% 20% 0% 0%)',
  right: 'inset(0% 0% 0% 20%)',
  center: 'inset(10% 10% 10% 10%)',
};

export function ImageReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  immediate = false,
  parallax = false,
}: ImageRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner || reducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollCfg = immediate
        ? undefined
        : {
            trigger: wrap,
            start: 'top 95%',
            toggleActions: 'play none none none',
          };

      gsap.fromTo(
        wrap,
        {
          clipPath: CLIP_INITIAL[direction],
          opacity: 0.15,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.3,
          delay,
          ease: 'power3.out',
          clearProps: 'clipPath,opacity',
          scrollTrigger: scrollCfg,
        }
      );

      gsap.fromTo(
        inner,
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.4,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: scrollCfg,
        }
      );

      if (parallax && !isTouch && !immediate) {
        gsap.fromTo(
          inner,
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        );
      }
    }, wrapRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [direction, delay, immediate, parallax, reducedMotion, isTouch]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2b. GSAP Precision Engineering Line-Draw Accent Rule                       */
/* -------------------------------------------------------------------------- */

interface EngineeringRuleProps {
  className?: string;
  immediate?: boolean;
  delay?: number;
  dark?: boolean;
}

export function EngineeringRule({
  className = '',
  immediate = false,
  delay = 0,
  dark = false,
}: EngineeringRuleProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.85,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: immediate
            ? undefined
            : {
                trigger: wrap,
                start: 'top 92%',
                once: true,
              },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, [immediate, delay, reducedMotion]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`relative h-[1px] w-full overflow-hidden ${dark ? 'bg-slate-800' : 'bg-[#DCE2E8]'} ${className}`}>
      <div
        ref={lineRef}
        className={`h-full w-full origin-left ${
          dark
            ? 'bg-gradient-to-r from-[#0D9488] via-[#2DD4BF]/50 to-transparent'
            : 'bg-gradient-to-r from-[#0F766E] via-[#0D9488]/40 to-transparent'
        }`}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Meaningful Numeric Count-Up Metric                                      */
/* -------------------------------------------------------------------------- */

interface CountUpMetricProps {
  value: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
  duration?: number;
}

function formatZeroStart(value: string): string {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return value;
  const [, prefix, digits, suffix] = match;
  const zeroDigits = prefix ? '0'.repeat(digits.length) : '0';
  return `${prefix}${zeroDigits}${suffix}`;
}

export function CountUpMetric({
  value,
  className = '',
  delay = 0,
  duration = 1.9,
}: CountUpMetricProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<string>(() =>
    reducedMotion ? value : formatZeroStart(value)
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) {
      setDisplay(value);
      return;
    }

    const match = value.match(/^([^\d]*)(\d+)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits, 10);
    const padLength = prefix ? digits.length : 0;
    const durationMs = Math.max(400, duration * 1000);
    const delayMs = Math.max(0, delay * 1000);

    setDisplay(formatZeroStart(value));

    let rafId = 0;
    let timeoutId = 0;
    let started = false;
    let cancelled = false;

    const runAnimation = () => {
      if (started || cancelled) return;
      started = true;

      const startTimer = () => {
        if (cancelled) return;
        const startTime = performance.now();

        const step = (now: number) => {
          if (cancelled) return;
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / durationMs);
          // Smooth quadratic ease-out keeps digits visibly climbing across the full duration
          const eased = 1 - (1 - progress) * (1 - progress);
          const current = Math.round(target * eased);
          const numText =
            padLength > 0 ? String(current).padStart(padLength, '0') : String(current);
          setDisplay(`${prefix}${numText}${suffix}`);

          if (progress < 1) {
            rafId = window.requestAnimationFrame(step);
          } else {
            setDisplay(value);
          }
        };

        rafId = window.requestAnimationFrame(step);
      };

      if (delayMs > 0) {
        timeoutId = window.setTimeout(startTimer, delayMs);
      } else {
        startTimer();
      }
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            runAnimation();
          }
        },
        { threshold: 0.15 }
      );
      observer.observe(el);

      return () => {
        cancelled = true;
        observer.disconnect();
        window.clearTimeout(timeoutId);
        window.cancelAnimationFrame(rafId);
      };
    }

    runAnimation();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafId);
    };
  }, [value, reducedMotion, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Interactive Mouse-Follow GlowCard (Precision Teal Radial Illumination)  */
/* -------------------------------------------------------------------------- */

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'elevated' | 'light';
  active?: boolean;
  as?: 'div' | 'article';
}

export function GlowCard({
  children,
  className = '',
  variant = 'elevated',
  active = false,
  as = 'div',
  onMouseMove,
  onMouseLeave,
  ...rest
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    if (isTouch || reducedMotion || !cardRef.current || !glowRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glowRef.current.style.opacity = '1';
    glowRef.current.style.background =
      variant === 'dark'
        ? `radial-gradient(400px circle at ${x}px ${y}px, rgba(45, 212, 191, 0.14), transparent 65%)`
        : `radial-gradient(380px circle at ${x}px ${y}px, rgba(13, 148, 136, 0.11), transparent 65%)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  const surfaceStyles =
    variant === 'light'
      ? active
        ? 'bg-white border-[#0F766E] shadow-[0_12px_30px_rgba(16,29,43,0.08)] ring-1 ring-[#0F766E]/20'
        : 'bg-[#F8FAFC] border-[#DCE2E8] hover:border-[#0F766E]/55 hover:shadow-[0_12px_28px_rgba(16,29,43,0.07)]'
      : variant === 'dark'
      ? active
        ? 'bg-[#101D2B] border-[#0D9488]/70 shadow-[0_16px_40px_rgba(16,29,43,0.38)]'
        : 'bg-[#101D2B] border-[#243447] hover:border-[#0D9488]/60 hover:shadow-[0_18px_42px_rgba(16,29,43,0.42)]'
      : active
      ? 'bg-white border-[#0F766E] shadow-[0_12px_30px_rgba(16,29,43,0.08)] ring-1 ring-[#0F766E]/20'
      : 'bg-white border-[#DCE2E8] hover:border-[#0F766E]/55 hover:shadow-[0_12px_28px_rgba(16,29,43,0.07)]';

  const Tag = as;

  return (
    <Tag
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-lg border transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${surfaceStyles} ${className}`}
      {...rest}
    >
      {!isTouch && !reducedMotion && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Desktop-Only Subtle Magnetic CTA Button                                 */
/* -------------------------------------------------------------------------- */

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.22,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (isTouch || reducedMotion || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;

    const clampedX = Math.max(-5, Math.min(5, dx));
    const clampedY = Math.max(-4, Math.min(4, dy));

    gsap.to(btnRef.current, {
      x: clampedX,
      y: clampedY,
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    if (!btnRef.current || isTouch || reducedMotion) return;

    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
