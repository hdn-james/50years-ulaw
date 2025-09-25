'use client';

import { type HTMLMotionProps, motion, type Transition } from 'motion/react';
import { cn } from '@/lib/utils';

type GradientBackgroundProps = HTMLMotionProps<'div'> & {
  transition?: Transition;
};

function GradientBackground({
  className,
  transition = { duration: 10, ease: 'easeInOut', repeat: Infinity },
  ...props
}: GradientBackgroundProps) {
  return (
    <motion.div
      data-slot="gradient-background"
      className={cn(
        'size-full bg-[length:300%_300%] bg-gradient-to-br from-0% from-fuchsia-400 via-50% via-violet-500 to-100% to-fuchsia-600',
        className,
      )}
      animate={{
        backgroundPosition: ['0% 0%', '50% 50%', '100% 0%', '50% 100%', '0% 50%', '100% 100%', '0% 0%'],
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={transition}
      {...props}
    />
  );
}

export { GradientBackground, type GradientBackgroundProps };
