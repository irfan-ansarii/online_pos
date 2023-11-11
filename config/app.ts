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
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "sales",
    label: "Sales",
    href: "/sales",
    icon: Inbox,
  },
  {
    key: "purchases",
    label: "Purchases",
    href: "/purchases",
    icon: ShoppingBag,
  },
  {
    key: "products",
    label: "Products",
    href: "/products",
    icon: Tag,
  },

  {
    key: "customers",
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    key: "reports",
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    key: "users",
    label: "Users",
    href: "/users",
    icon: UserCog,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const PRODUCT_PATHS = [
  {
    id: 1,
    label: "Products",
    path: "/products",
  },
  {
    id: 2,
    label: "Transfers",
    path: "/products/transfers",
  },
  {
    id: 3,
    label: "Adjustments",
    path: "/products/adjustments",
  },
  {
    id: 4,
    label: "Barcodes",
    path: "/products/barcodes",
  },
];
export const PAGE_SIZE = 12;
