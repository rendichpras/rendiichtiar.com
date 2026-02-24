import { Variants } from "framer-motion"

export const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export const FADE_UP_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const SLIDE_RIGHT_VARIANTS: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
}

export const SCALE_X_VARIANTS: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.4 } },
}

export const SLIDE_LEFT_PANEL_VARIANTS: Variants = {
  closed: { x: "-100%" },
  open: { x: 0 },
}

export const STAGGER_CHILDREN_VARIANTS: Variants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const SLIDE_RIGHT_CHILD_VARIANTS: Variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 },
}
