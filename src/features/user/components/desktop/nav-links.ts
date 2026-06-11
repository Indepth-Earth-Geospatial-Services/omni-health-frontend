import { GitCompareArrows, Info, List, MapIcon } from "lucide-react";

export const navLinks = [
  {
    icon: List,
    label: "Facilities",
    href: "/facilities",
  },
  {
    icon: GitCompareArrows,
    label: "Compare",
    href: "/compare-facilities",
  },
  {
    icon: MapIcon,
    label: "Explore",
    href: "/explore-facilities",
  },
  {
    icon: Info,
    label: "Help",
    href: "/help",
  },
] as const;
