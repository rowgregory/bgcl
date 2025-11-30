const getHeroAnimationVariants = (animationType: string) => {
  const variants = {
    "fade-up": {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    "fade-down": {
      initial: { opacity: 0, y: -30 },
      animate: { opacity: 1, y: 0 },
    },
    "fade-left": {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
    },
    "fade-right": {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    bounce: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    none: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
    },
  };
  return variants[animationType as keyof typeof variants] || variants.none;
};

export default getHeroAnimationVariants;
