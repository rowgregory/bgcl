import {
  Users,
  Rocket,
  Sliders,
  Satellite,
  Globe,
  ScanLine,
  Star,
} from "lucide-react";

export const adminNavLinks = [
  {
    id: "mission-control",
    label: "Mission Control",
    icon: Rocket,
    description: "Dashboard",
    linkKey: "/admin/mission-control",
  },
  {
    id: "star-map",
    label: "Star Map",
    icon: Globe,
    description: "Public Site Content",
    linkKey: "/admin/star-map",
  },
  {
    id: "capsule",
    label: "The Capsule",
    icon: Satellite,
    description: "Event Management",
    linkKey: "/admin/capsule/core",
  },
  {
    id: "orbital-deck",
    label: "The Orbital Deck",
    icon: Star,
    description: "Hero Studio & Campaign Visuals",
  },
  {
    id: "squad-unit",
    label: "Squad Unit",
    icon: Users,
    description: "Member Directory",
    linkKey: "/admin/squad-unit",
  },

  {
    id: "operations-panel",
    label: "Operation Panel",
    icon: Sliders,
    description: "System Settings",
    linkKey: "/admin/operations-panel",
  },
  {
    id: "cryo-chamber",
    label: "Cryo Chamber",
    icon: ScanLine,
    description: "Future features in stasis",
    linkKey: "/admin/cryo-chamber",
  },
];
