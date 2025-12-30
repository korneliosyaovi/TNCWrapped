import { Variants } from "framer-motion";

/**
 * Slide from right (for forward navigation)
 */
export const slideFromRight: Variants = {
  initial: {
    x: "100%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smooth feel
    },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Slide from left (for backward navigation)
 */
export const slideFromLeft: Variants = {
  initial: {
    x: "-100%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Fade and scale (for special moments)
 */
export const fadeScale: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
};

/**
 * Fade only (subtle transitions)
 */
export const fadeOnly: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.6,
    },
  },
};


/**
 * Container for staggered children
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {},
};

/**
 * Individual items that fade and slide up
 */
export const fadeInUp: Variants = {
  initial: {
    y: 30,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    y: -30,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Scale in animation (for numbers/stats)
 */
export const scaleIn: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Bounce in animation (for icons/emojis)
 */
export const bounceIn: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    scale: 0,
    rotate: 180,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Button hover animation
 */
export const buttonHover = {
  scale: 1.02,
  transition: {
    duration: 0.2,
  },
};

/**
 * Button tap animation
 */
export const buttonTap = {
  scale: 0.98,
};