/**
 * Timeline Configuration
 *
 * Centralized configuration for the animated timeline component.
 * Adjust these values to customize the timeline's behavior and appearance.
 */

export const timelineConfig = {
  /**
   * Scroll Animation Configuration
   */
  scroll: {
    // Viewport margins for triggering animations
    // Format: "top right bottom left"
    // Negative values mean the element needs to be more centered
    // Example: "-45%" means animation triggers when element is 45% into viewport
    triggerMargin: "-40% 0px -40% 0px",

    // Amount of element that needs to be visible (0 to 1)
    // 0.5 = 50% of element must be visible
    visibilityThreshold: 0.5,

    // Whether animations should only play once
    // false = animations replay when scrolling back up
    playOnce: false,
  },

  /**
   * Animation Timing Configuration
   */
  animation: {
    // Dot animation
    dot: {
      scale: {
        normal: 1,
        active: 1.5,
      },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },

    // Card animation
    card: {
      duration: 0.7,
      delay: 0.15,
      // Cubic bezier easing [x1, y1, x2, y2]
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      // Initial offset from right (in pixels)
      initialOffset: 60,
    },

    // List item stagger
    listItem: {
      baseDelay: 0.6,
      staggerDelay: 0.1, // Delay between each item
      duration: 0.4,
    },
  },

  /**
   * Spacing Configuration
   */
  spacing: {
    // Gap between timeline items
    mobile: "2rem", // 32px / gap-8
    tablet: "3rem", // 48px / gap-12
    desktop: "4rem", // 64px / gap-16

    // Gap between dot and card
    dotToCard: {
      mobile: "1rem", // 16px / gap-4
      tablet: "1.5rem", // 24px / gap-6
      desktop: "2rem", // 32px / gap-8
    },
  },

  /**
   * Colors Configuration
   * Using Tailwind CSS color names
   */
  colors: {
    // Vertical line gradient
    line: {
      from: "emerald-400",
      via: "blue-500",
      to: "sky-400",
    },

    // Phase colors
    phases: {
      before: {
        dot: "bg-emerald-600",
        border: "border-emerald-200",
        bg: "bg-sky-50/80",
        title: "text-emerald-800",
        date: "text-emerald-700",
      },
      main: {
        dot: "bg-gradient-to-r from-ulaw-teal via-ulaw-blue to-ulaw-blue2",
        border: "border-ulaw-blue",
        bg: "bg-gradient-to-r from-ulaw-teal via-40% via-ulaw-blue to-ulaw-blue2",
        title: "text-white",
        date: "text-white",
      },
      after: {
        dot: "bg-sky-600",
        border: "border-sky-200",
        bg: "bg-sky-50/80",
        title: "text-sky-800",
        date: "text-sky-700",
      },
    },
  },

  /**
   * Visual Effects Configuration
   */
  effects: {
    // Dot glow effect when active
    dotGlow: {
      active: "0 0 0 8px rgba(59, 130, 246, 0.2), 0 10px 25px rgba(0, 0, 0, 0.3)",
      inactive: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },

    // Card shadow
    cardShadow: {
      normal: "shadow-lg",
      main: "shadow-2xl", // Main event has stronger shadow
    },
  },

  /**
   * Responsive Breakpoints
   * These match Tailwind's default breakpoints
   */
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

/**
 * Helper function to get responsive spacing value
 */
export const getSpacing = (type: keyof typeof timelineConfig.spacing) => {
  const spacing = timelineConfig.spacing[type];
  if (typeof spacing === "object") {
    return spacing;
  }
  return spacing;
};

/**
 * Helper function to get phase colors
 */
export const getPhaseColors = (phase: "before" | "main" | "after") => {
  return timelineConfig.colors.phases[phase];
};
