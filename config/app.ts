import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  ShoppingBag,
  Tag,
  Inbox,
  BarChart3,
} from "lucide-react";

export const MENU_ITEMS = [
  {
    key: "overview",
    label: "Dashboard",
    href: "/overview",
    icon: LayoutDashboard,
  },
  {
    key: "calender",
    label: "Sales",
    href: "/calender",
    icon: Inbox,
  },
  {
    key: "projects",
    label: "Purchases",
    href: "/projects",
    icon: ShoppingBag,
  },
  {
    key: "tasks",
    label: "Products",
    href: "/tasks",
    icon: Tag,
  },

  {
    key: "teams",
    label: "Customers",
    href: "/teams",
    icon: Users,
  },
  {
    key: "teams",
    label: "Reports",
    href: "/teams",
    icon: BarChart3,
  },
  {
    key: "teams",
    label: "Users",
    href: "/teams",
    icon: UserCog,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
