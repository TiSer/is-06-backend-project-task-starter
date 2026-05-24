import {
  Flag,
  Home,
  Images,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  { href: "/", label: "Home", shortLabel: "Home", icon: Home },
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Dash",
    icon: LayoutDashboard,
  },
  {
    href: "/records",
    label: "Track Records",
    shortLabel: "Records",
    icon: Flag,
  },
  { href: "/gallery", label: "Gallery", shortLabel: "Gallery", icon: Images },
];
