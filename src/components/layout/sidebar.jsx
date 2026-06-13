"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ArrowLeftRight,
  ShoppingCart,
  Receipt,
  Bell,
  BarChart3,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap = {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ArrowLeftRight,
  ShoppingCart,
  Receipt,
  Bell,
  BarChart3,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Gada Electronics</h1>
          <p className="text-xs text-muted-foreground">Inventory Manager</p>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function Header({ title, description }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("gada-theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : true;

    setDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
    window.localStorage.setItem("gada-theme", nextMode ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:bg-accent"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            variables: {
              colorPrimary: darkMode ? "#38bdf8" : "#2563eb",
              colorText: darkMode ? "#e2e8f0" : "#111827",
              colorBackground: darkMode ? "#0f172a" : "#ffffff",
              colorInputBackground: darkMode ? "#111827" : "#f8fafc",
              colorInputText: darkMode ? "#f8fafc" : "#111827",
              colorTextSecondary: darkMode ? "#cbd5e1" : "#475569",
              colorBorder: darkMode ? "#334155" : "#e2e8f0",
            },
            elements: {
              userButtonPopoverCard: darkMode
                ? "bg-slate-900 text-slate-100 border-slate-800 shadow-xl"
                : "bg-white text-slate-900 border-slate-200 shadow-xl",
              userButtonPopoverActionButton: darkMode
                ? "text-slate-100 hover:bg-slate-800 hover:text-slate-100"
                : "text-slate-900 hover:bg-slate-100 hover:text-slate-900",
              userButtonPopoverFooter: darkMode
                ? "border-slate-800"
                : "border-slate-200",
            },
          }}
        />
      </div>
    </header>
  );
}

export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
