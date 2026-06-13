export const DEFAULT_LOW_STOCK_THRESHOLD = parseInt(
  process.env.DEFAULT_LOW_STOCK_THRESHOLD || "10",
  10
);

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Products", href: "/dashboard/products", icon: "Package" },
  { title: "Categories", href: "/dashboard/categories", icon: "FolderTree" },
  { title: "Suppliers", href: "/dashboard/suppliers", icon: "Truck" },
  { title: "Stock", href: "/dashboard/stock", icon: "ArrowLeftRight" },
  { title: "Purchase Orders", href: "/dashboard/purchase-orders", icon: "ShoppingCart" },
  { title: "Sales", href: "/dashboard/sales", icon: "Receipt" },
  { title: "Alerts", href: "/dashboard/alerts", icon: "Bell" },
  { title: "Reports", href: "/dashboard/reports", icon: "BarChart3" },
];

export const PRODUCT_CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Televisions",
  "Audio",
  "Cameras",
  "Accessories",
  "Components",
  "Home Appliances",
  "Gaming",
  "Wearables",
  "Other",
];

export const STOCK_MOVEMENT_TYPES = ["stock_in", "stock_out", "adjustment", "sale", "purchase"];

export const PURCHASE_ORDER_STATUS = ["pending", "ordered", "received", "cancelled"];

export const PAYMENT_METHODS = ["cash", "card", "upi", "bank_transfer", "other"];
