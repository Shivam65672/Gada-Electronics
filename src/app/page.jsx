"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Bell, BarChart3, Zap, Moon, Sun } from "lucide-react";

export default function HomePage() {
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
    <div
      className={`min-h-screen ${darkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
          : "bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-900"
        }`}
    >
      <header
        className={`border-b backdrop-blur ${darkMode ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white/80"
          }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Gada Electronics</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className={darkMode ? "text-slate-100 hover:bg-slate-800 hover:text-slate-100" : "text-slate-900 hover:bg-slate-100"}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className={darkMode ? "bg-sky-500 text-slate-950 hover:bg-sky-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                >
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  className={darkMode ? "bg-sky-500 text-slate-950 hover:bg-sky-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                >
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className={`text-5xl font-bold tracking-tight ${darkMode ? "text-slate-100" : "text-slate-900"
              }`}
          >
            Inventory Management
            <span className="block text-primary">Made Simple</span>
          </h1>
          <p className={`mt-6 text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Complete inventory solution for your electronics shop. Track products,
            manage stock, process sales, and get real-time analytics — all in one
            place.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <SignedOut>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className={darkMode ? "bg-sky-500 text-slate-950 hover:bg-sky-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                >
                  Start Free
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className={darkMode ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-slate-100" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"}
                >
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className={darkMode ? "bg-sky-500 text-slate-950 hover:bg-sky-400" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                >
                  Open Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Package,
              title: "Product Management",
              desc: "Add products with SKU, category, brand, pricing, and supplier details.",
            },
            {
              icon: ShoppingCart,
              title: "Purchase Orders",
              desc: "Create and track purchase orders. Auto-update inventory on receipt.",
            },
            {
              icon: Bell,
              title: "Low Stock Alerts",
              desc: "Get notified when stock drops below your threshold.",
            },
            {
              icon: BarChart3,
              title: "Reports & Analytics",
              desc: "Sales trends, top products, category breakdown, and more.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`items-center text-center rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${darkMode
                  ? "border-slate-800 bg-slate-900/90"
                  : "border-slate-200 bg-white"
                }`}
            >
              <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className={`font-semibold ${darkMode ? "text-slate-100" : "text-slate-900"}`}>{feature.title}</h3>
              <p className={`mt-2 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer
        className={`border-t py-8 text-center text-sm ${darkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-600"
          }`}
      >
        © {new Date().getFullYear()} Gada Electronics. All rights reserved.
      </footer>
    </div>
  );
}
