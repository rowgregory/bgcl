import { LucideIcon } from "lucide-react";

export interface IFeature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
  cost: number;
  hours: string;
  system?: string;
}

export interface IAdditionalFeature {
  feature: IFeature;
  isSelected: boolean;
  toggleFeature: (id: string) => void;
}

export interface ICoreFeaturesGrid {
  totalCoreFeaturesPrice: number;
}

export interface IInteractiveBuilder {
  selectedFeatures: string[];
  toggleFeature: (featureId: string) => void;
  calculateAdditionalFeaturesSelectedTotal: number;
  calculateTotalWithoutDiscount: () => number;
  phase1Discount: boolean;
  calculateDiscountAmount: () => number;
  calculateTotalWithDiscount: () => number;
  getRecommendation: () => { color: string; text: string } | undefined;
  resetSelection: () => void;
  totalCoreFeaturesPrice: number;
}

export interface IPhaseOne {
  setSelectedFeatures: (ids: string[]) => void;
  setPhase1Discount: (value: boolean) => void;
  phaseOneTotal: number;
  phaseOneTotalWithDiscount: number;
}

export interface IFixedBottomPricingBar {
  totalWithDiscount: number;
  totalWithoutDiscount: number;
  selectedFeaturesCount: number;
  monthlyHostingCost: number;
  phase1Discount: boolean;
}
