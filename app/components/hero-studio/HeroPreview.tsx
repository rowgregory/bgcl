import React, { FC } from "react";
import { motion } from "framer-motion";
import { IHero } from "@/types/entities/hero";
import Thermometer from "./elements/Thermometer";
import Countdown from "./elements/Countdown";
import GrowthTree from "./elements/GrowthTree";
import FloatingButton from "./elements/FloatingButton";
import getHeroBackgroundStyle from "@/app/lib/utils/getHeroBackgroundStyle";
import getHeroAnimationVariants from "@/app/lib/utils/getHeroAnimationVariants";
import { renderTitleWithGradient } from "@/app/lib/utils/renderTitleWithGradient";
import { TopBanner } from "./elements/TopBanner";

interface IHeroPreview {
  hero: IHero;
  disableAnimations?: boolean;
  disableResponsiveScaling?: boolean;
  viewportSize?: "mobile" | "tablet" | "desktop";
  isViewportPreview?: boolean;
  previewMode?: boolean;
}

const HeroPreview: FC<IHeroPreview> = ({
  hero,
  disableAnimations = false,
  disableResponsiveScaling = false,
  viewportSize = "desktop",
  isViewportPreview = false,
}) => {
  // Calculate the base height
  // Calculate the base height
  const getBaseHeight = () => {
    // In viewport preview mode, always use 100% to fill container
    if (isViewportPreview) {
      return hero.showTopBanner
        ? `calc(100% - ${hero.topBannerHeight}px)`
        : hero.minHeight === "half"
          ? "50%"
          : hero.minHeight === "screen"
            ? "100%"
            : `${hero.actualHeight.split("vh")[0]}%`;
    }

    // Normal height calculation
    if (hero.minHeight === "screen") {
      return hero.showTopBanner
        ? `calc(100vh - ${144 + parseInt(hero.topBannerHeight)}px)`
        : "calc(100vh - 144px)";
    } else if (hero.minHeight === "half") {
      return hero.showTopBanner
        ? `calc(50vh - ${144 + parseInt(hero.topBannerHeight)}px)`
        : "calc(50vh - 144px)";
    }

    // For custom height
    return hero.showTopBanner
      ? `calc(${hero.actualHeight} - ${144 + parseInt(hero.topBannerHeight)}px)`
      : `calc(${hero.actualHeight} - 144px)`;
  };

  const baseHeight = getBaseHeight();

  const getObjectFitClass = () => {
    if (hero.backgroundSize === "cover") return "object-cover";
    if (hero.backgroundSize === "contain") return "object-contain";
    return "object-none";
  };

  const getObjectPositionClass = () => {
    const positionMap: Record<string, string> = {
      center: "object-center",
      top: "object-top",
      bottom: "object-bottom",
      left: "object-left",
      right: "object-right",
      "top-left": "object-left-top",
      "top-right": "object-right-top",
      "bottom-left": "object-left-bottom",
      "bottom-right": "object-right-bottom",
    };
    return positionMap[hero.backgroundPosition] || "object-center";
  };

  const titleVariants = getHeroAnimationVariants(hero.titleAnimation);
  const subtitleVariants = getHeroAnimationVariants(hero.subtitleAnimation);
  const ctaVariants = getHeroAnimationVariants(hero.ctaAnimation);

  // Determine which widget to show
  const showWidget =
    hero.showThermometer || hero.showCountdown || hero.showGrowthTree;
  const widgetPosition = hero.showThermometer
    ? hero.thermometerPosition
    : hero.showCountdown
      ? hero.countdownPosition
      : hero.growthTreePosition;

  // Layout classes based on selection
  const getLayoutClasses = () => {
    if (hero.layout === "stacked-center") {
      return {
        container: "flex flex-col items-center justify-center text-center",
        content: "w-full max-w-5xl",
        widget: "mt-12 max-w-xl w-full",
      };
    }
    if (hero.layout === "stacked-left") {
      return {
        container: "flex flex-col items-start justify-center text-left",
        content: "w-full max-w-5xl",
        widget: "mt-12 max-w-xl w-full",
      };
    }
    if (hero.layout === "stacked-right") {
      return {
        container: "flex flex-col items-end justify-center text-right",
        content: "w-full max-w-5xl",
        widget: "mt-12 max-w-xl w-full",
      };
    }
    // side-by-side (default)
    return {
      container: `grid ${showWidget ? "2xl:grid-cols-2" : "grid-cols-1"} gap-12 items-center`,
      content: "",
      widget: "",
    };
  };

  const layoutClasses = getLayoutClasses();
  const isStacked = hero.layout.startsWith("stacked");

  // Calculate font size based on viewport
  const getTitleFontSize = () => {
    if (disableResponsiveScaling) {
      // In editor, apply scaling based on viewport selection
      if (viewportSize === "mobile") {
        return `calc(${hero.titleFontSize} * 0.5)`;
      } else if (viewportSize === "tablet") {
        return `calc(${hero.titleFontSize} * 0.75)`;
      }
      return hero.titleFontSize; // desktop
    }
    // Production uses clamp for fluid scaling
    return `clamp(calc(${hero.titleFontSize} * 0.5), 5vw, ${hero.titleFontSize})`;
  };

  const getSubtitleFontSize = () => {
    if (disableResponsiveScaling) {
      // In editor, apply scaling based on viewport selection
      if (viewportSize === "mobile") {
        return `calc(${hero.subtitleFontSize} * 0.6)`;
      } else if (viewportSize === "tablet") {
        return `calc(${hero.subtitleFontSize} * 0.8)`;
      }
      return hero.subtitleFontSize; // desktop
    }
    // Production uses clamp for fluid scaling
    return `clamp(calc(${hero.subtitleFontSize} * 0.6), 3vw, ${hero.subtitleFontSize})`;
  };

  return (
    <>
      {/* Top Banner */}
      {hero.showTopBanner && (
        <TopBanner
          text={hero.topBannerText}
          height={hero.topBannerHeight}
          bgColor={hero.topBannerBgColor}
          textColor={hero.topBannerTextColor}
          fontSize={hero.topBannerFontSize}
          bold={hero.topBannerBold}
          linkType={hero.topBannerLinkType}
          link={hero.topBannerLink}
        />
      )}

      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: baseHeight,
          ...getHeroBackgroundStyle(hero),
        }}
      >
        {hero.backgroundType === "video" && hero.backgroundVideo && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full ${getObjectFitClass()} ${getObjectPositionClass()}`}
          >
            <source src={hero.backgroundVideo} type="video/mp4" />
          </video>
        )}

        {(hero.backgroundType === "image" ||
          hero.backgroundType === "video") && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: hero.overlayOpacity }}
          />
        )}

        <div className="relative z-10 container mx-auto px-6">
          <div className={`${layoutClasses.container}`}>
            {/* Text Content */}
            <motion.div
              initial={disableAnimations ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`${layoutClasses.content} ${
                !isStacked && showWidget && widgetPosition === "right"
                  ? "order-1"
                  : !isStacked && showWidget
                    ? "order-2"
                    : ""
              }`}
            >
              <motion.h1
                {...(disableAnimations ? {} : titleVariants)}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={
                  disableAnimations
                    ? { duration: 0 }
                    : {
                        delay: 0.2,
                        duration: 0.8,
                        ...(hero.titleAnimation === "bounce" && {
                          type: "spring",
                          stiffness: 100,
                        }),
                      }
                }
                className="font-bold mb-6 leading-tight"
                style={{
                  color: hero.titleColor,
                  lineHeight: hero.titleLineHeight,
                  fontSize: getTitleFontSize(),
                }}
              >
                {renderTitleWithGradient(
                  hero.title,
                  hero.titleGradientWord,
                  hero.titleGradientFrom,
                  hero.titleGradientTo,
                  hero.titleUseGradient
                )}
              </motion.h1>

              <motion.p
                {...(disableAnimations ? {} : subtitleVariants)}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={
                  disableAnimations
                    ? { duration: 0 }
                    : {
                        delay: 0.4,
                        duration: 0.8,
                        ...(hero.subtitleAnimation === "bounce" && {
                          type: "spring",
                          stiffness: 100,
                        }),
                      }
                }
                className={`mb-8 ${isStacked ? "w-full" : "max-w-lg"}`}
                style={{
                  color: hero.subtitleColor,
                  lineHeight: hero.subtitleLineHeight,
                  fontSize: getSubtitleFontSize(),
                }}
              >
                {hero.subtitle}
              </motion.p>

              <motion.button
                {...(disableAnimations ? {} : ctaVariants)}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                transition={
                  disableAnimations
                    ? { duration: 0 }
                    : {
                        delay: 0.6,
                        duration: 0.8,
                        ...(hero.ctaAnimation === "bounce" && {
                          type: "spring",
                          stiffness: 100,
                        }),
                      }
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-semibold rounded-lg transition-all"
                style={{
                  backgroundColor: hero.ctaBackgroundColor,
                  color: hero.ctaTextColor,
                  borderRadius: `${hero.ctaBorderRadius}px`,
                }}
              >
                {hero.ctaText}
              </motion.button>
            </motion.div>

            {/* Widget (Thermometer or Countdown or GrowthTree) */}
            {showWidget && (
              <div
                className={`${layoutClasses.widget} ${
                  !isStacked
                    ? `flex ${
                        widgetPosition === "center"
                          ? "justify-center"
                          : widgetPosition === "left"
                            ? "justify-start"
                            : "justify-end"
                      } ${widgetPosition === "right" ? "order-2" : "order-1"}`
                    : hero.layout === "stacked-center"
                      ? "flex justify-center"
                      : hero.layout === "stacked-left"
                        ? "flex justify-start"
                        : "flex justify-end"
                }`}
              >
                {hero.showThermometer && <Thermometer hero={hero} />}
                {!hero.showThermometer && hero.showCountdown && (
                  <Countdown hero={hero} />
                )}
                {!hero.showThermometer &&
                  !hero.showCountdown &&
                  hero.showGrowthTree && <GrowthTree hero={hero} />}
              </div>
            )}
          </div>
        </div>
        {/* Floating Button */}
        {hero.showFloatingButton && (
          <FloatingButton
            key={`${hero.floatingButtonAnimation}-${hero.floatingButtonPosition}`}
            hero={hero}
          />
        )}
      </div>
    </>
  );
};

export default HeroPreview;
