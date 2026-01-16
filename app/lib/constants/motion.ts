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
