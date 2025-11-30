import { IHero } from "@/types/entities/hero";

const getHeroBackgroundStyle = (hero: IHero) => {
  if (hero.backgroundType === "image") {
    return {
      backgroundImage: `url(${hero.backgroundImage})`,
      backgroundSize: hero.backgroundSize,
      backgroundPosition: hero.backgroundPosition,
      backgroundRepeat: "no-repeat",
    };
  }
  if (hero.backgroundType === "gradient") {
    return {
      background: `linear-gradient(135deg, ${hero.gradientFrom}, ${hero.gradientTo})`,
    };
  }
  if (hero.backgroundType === "video") {
    return {};
  }
  return { backgroundColor: hero.backgroundColor };
};

export default getHeroBackgroundStyle;
