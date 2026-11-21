/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TermiCoreLogo } from './TermiCoreLogo';

interface InitialLoaderProps {
  onComplete: () => void;
}

export function InitialLoader({ onComplete }: InitialLoaderProps) {
  // Target position is top-left header logo (approx ~24px from top, ~24px-32px from left)
  const [stage, setStage] = useState<'center' | 'fly' | 'done'>('center');

  useEffect(() => {
    // 1. Center appearance for 1.2s
    const flyTimer = window.setTimeout(() => {
      setStage('fly');
    }, 1200);

    // 2. Fly animation takes ~0.8s, then finish loader
    const doneTimer = window.setTimeout(() => {
      setStage('done');
      onComplete();
    }, 2050);

    return () => {
      window.clearTimeout(flyTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  const isFlying = stage === 'fly';

  return (
    <AnimatePresence>
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isFlying ? 0 : 1 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 pointer-events-none bg-[#0B131D]"
      />

      {/* Floating Logo Element: Starts centered, smoothly travels directly to header position */}
      <motion.div
        key="splash-flying-logo"
        initial={{
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          scale: 0.6,
          opacity: 0,
        }}
        animate={
          isFlying
            ? {
                top: '34px',
                left: 'max(24px, calc((100vw - 1280px) / 2 + 24px))',
                x: '0%',
                y: '-50%',
                scale: 0.38,
                opacity: 1,
              }
            : {
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%',
                scale: 1,
                opacity: 1,
              }
        }
        transition={{
          duration: isFlying ? 0.8 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="fixed z-50 pointer-events-none flex items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          {/* Subtle glow that fades away as it moves */}
          <motion.div
            animate={{ opacity: isFlying ? 0 : 0.35 }}
            transition={{ duration: 0.4 }}
            className="absolute -inset-10 rounded-full bg-[#0D9488] blur-3xl pointer-events-none"
          />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-[#2DD4BF]/40 bg-[#111C2A] shadow-[0_0_50px_rgba(45,212,191,0.2)]">
            <TermiCoreLogo className="h-14 w-14 text-[#2DD4BF]" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
