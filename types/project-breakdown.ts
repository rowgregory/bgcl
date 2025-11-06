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
