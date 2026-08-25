import { Variants } from 'framer-motion'

export const drawerVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 40
    }
  }
}

export const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export const containerVariantsTwo = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

export const itemVariantsTwo = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, easing: 'easeOut' } }
}

export const sectionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// Respect reduced motion at the variant level
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, easing: 'easeOut', delay }
  })
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, easing: 'easeOut', delay }
  })
}

export const EASE = [0.22, 1, 0.36, 1] as const

/** Staggers its children in on first paint. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } }
}

export const riseUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } }
}

export const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}

export const tableVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.25 } }
}

export const rowVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } }
}
