import {
  LayoutDashboard,
  Users,
  UserCog,
  Settings,
  ShoppingBag,
  Tag,
  Inbox,
  BarChart3,
  Mail,
  MessageCircle,
  Printer,
  ArrowLeftRight,
  ArrowUpDown,
  ScanLine,
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
    key: "purchase",
    label: "Purchase",
    href: "/purchase",
    icon: ShoppingBag,
  },
  {
    key: "products",
    label: "Products",
    href: "/products",
    icon: Tag,
    children: [
      {
        id: 2,
        label: "Transfers",
        path: "/transfers",
      },
      {
        id: 3,
        label: "Adjustments",
        path: "/adjustments",
      },
      {
        id: 4,
        label: "Barcodes",
        path: "/barcodes",
      },
    ],
  },

  {
    key: "contacts",
    label: "Contacts",
    href: "/contacts",
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

export const PAGE_SIZE = 12;

export const PROCEED_SALE_TABS = [
  "employee",
  "customer",
  "payment",
  "completed",
];

export const INVOICE_OPTIONS = [
  {
    key: 1,
    name: "Email",
    icon: Mail,
  },
  {
    key: 2,
    name: "Whats App",
    icon: MessageCircle,
  },
  {
    key: 3,
    name: "Print",
    icon: Printer,
  },
];

export const PROCEED_PURCHASES_TABS = ["supplier", "receipt", "payment"];
