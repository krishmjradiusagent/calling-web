import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

interface VoiceReactiveGradientProps {
  active: boolean;
  intensity?: number;
}

export const VoiceReactiveGradient = ({ active, intensity = 1 }: VoiceReactiveGradientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const energyRaw = useMotionValue(active ? 0.4 : 0.14);
  const energy = useSpring(energyRaw, {
    stiffness: 170,
    damping: 24,
    mass: 0.5,
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      energyRaw.set(active ? 0.35 : 0.14);
      return;
    }

    const id = setInterval(() => {
      const base = active ? 0.42 : 0.14;
      const variance = active ? 0.48 * intensity : 0.05;
      energyRaw.set(base + Math.random() * variance);
    }, 130);

    return () => clearInterval(id);
  }, [active, intensity, energyRaw, shouldReduceMotion]);

  const scaleX = useTransform(energy, [0, 1], [0.9, 1.1]);
  const scaleY = useTransform(energy, [0, 1], [0.7, 1.06]);
  const opacity = useTransform(energy, [0, 1], [0.2, 0.8]);
  const blur = useTransform(energy, [0, 1], [26, 42]);

  return (
    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2">
      <motion.div
        style={{ scaleX, scaleY, opacity, filter: useTransform(blur, (b) => `blur(${b}px)`) }}
        className="h-10 w-[320px] rounded-full bg-[linear-gradient(90deg,#5A5FF2_0%,#7A7DF7_40%,#5A5FF2_75%,#59C7FF_100%)]"
        animate={
          shouldReduceMotion
            ? undefined
            : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : {
                duration: active ? 2.2 : 5.5,
                repeat: Infinity,
                ease: 'linear',
              }
        }
      />
      <motion.div
        style={{ scaleX, opacity }}
        className="absolute left-1/2 top-1/2 h-4 w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,#5A5FF2_0%,#9CA5FF_50%,#5A5FF2_100%)] blur-md"
      />
    </div>
  );
};

