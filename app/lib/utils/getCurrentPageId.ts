import { INavigationLink } from "@/types/navigation";

const getCurrentPageId = (path: string, links: INavigationLink[]) => {
  const pathSegments = path.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Handle special cases for multi-word routes
  if (path.includes("/mission-control")) return "Mission Control";
  if (path.includes("/family-constellations")) return "Family Constellations";
  if (path.includes("/squad-bay")) return "The Squad Bay";
  if (path.includes("/launch-pad")) return "The Launch Pad";
  if (path.includes("/capsule")) return "The Capsule";
  if (path.includes("/fuel-station")) return "The Fuel Station";

  // Find matching navigation item
  const matchingItem = links.find(
    (item) => item.linkKey === path || item.id === lastSegment
  );

  return matchingItem?.label || "Mission Control";
};

export default getCurrentPageId;
