// types/hero.ts

// Database type (what Prisma returns - no File objects)
export interface IHeroEntity {
  id: string;
  name: string;
  status: string;

  minHeight: string;
  actualHeight: string;

  backgroundType: string;
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  backgroundSize: string;
  backgroundPosition: string;
  overlayOpacity: number;

  title: string;
  titleColor: string;
  titleGradientWord: string;
  titleGradientFrom: string;
  titleGradientTo: string;
  titleUseGradient: boolean;
  titleLineHeight: string;
  titleFontSize: string;
  subtitle: string;
  subtitleColor: string;
  subtitleLineHeight: string;
  subtitleFontSize: string;

  titleAnimation: string;
  subtitleAnimation: string;
  ctaAnimation: string;
  floatingButtonAnimation: string;

  layout: string;

  ctaText: string;
  ctaLink: string;
  ctaBackgroundColor: string;
  ctaTextColor: string;
  ctaBorderRadius: string;

  showThermometer: boolean;
  thermometerGoal: number;
  thermometerCurrent: number;
  thermometerColor: string;
  thermometerPosition: string;

  showCountdown: boolean;
  countdownDate: string;
  countdownLabel: string;
  countdownPosition: string;
  countdownColor: string;

  showGrowthTree: boolean;
  growthTreeCurrent: number;
  growthTreeGoal: number;
  growthTreeLabel: string;
  growthTreePosition: string;
  growthTreeColor: string;

  showFloatingButton: boolean;
  floatingButtonText: string;
  floatingButtonPosition: string;
  floatingButtonBgColor: string;
  floatingButtonTextColor: string;
  floatingButtonBorderRadius: string;
  floatingButtonAction: string;
  floatingButtonLink: string;
  floatingButtonIcon: string;

  showTopBanner: boolean;
  topBannerText: string;
  topBannerHeight: string; // in pixels, e.g., "40px"
  topBannerBgColor: string;
  topBannerTextColor: string;
  topBannerFontSize: string; // in rem
  topBannerBold: boolean;
  topBannerLinkType: string;
  topBannerLink: string;
}

// Client-side type (includes File objects for editing)
export interface IHero extends Omit<IHeroEntity, "status"> {
  backgroundFile: File | null;
  backgroundVideoFile: File | null;
  // Add stricter typing for client-side
  minHeight: "screen" | "half" | "full";
  backgroundType: "color" | "gradient" | "image" | "video";
  backgroundSize: "cover" | "contain" | "auto";
  backgroundPosition:
    | "center"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  titleAnimation:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "bounce"
    | "none";
  subtitleAnimation:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "bounce"
    | "none";
  ctaAnimation:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale"
    | "bounce"
    | "none";
  layout: "side-by-side" | "stacked-center" | "stacked-left" | "stacked-right";
  thermometerPosition: "left" | "center" | "right";
  countdownPosition: "left" | "center" | "right";
  growthTreePosition: "left" | "center" | "right";
  floatingButtonPosition:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
  floatingButtonAnimation: "pulse" | "bounce" | "shake" | "none";
  floatingButtonAction: "internal" | "external" | "modal" | "drawer";
  floatingButtonIcon:
    | "none"
    | "arrow"
    | "phone"
    | "email"
    | "chat"
    | "info"
    | "help";
  topBannerLinkType: "none" | "internal" | "external";
}
