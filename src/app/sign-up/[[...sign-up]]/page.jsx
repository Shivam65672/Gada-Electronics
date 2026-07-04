"use client";

import { useEffect, useState } from "react";
import { SignUp, useClerk } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";

export default function SignUpPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loaded } = useClerk();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("gada-theme");
    const prefersDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(prefersDark);
    setIsLoaded(loaded);
  }, [loaded]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    window.localStorage.setItem("gada-theme", nextMode ? "dark" : "light");
  };

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden ${
        darkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className={`absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${
          darkMode
            ? "border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800"
            : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {!isLoaded ? (
        <div className="flex items-center justify-center">
          <div className={`h-8 w-8 animate-spin rounded-full border-4 ${darkMode ? 'border-slate-700 border-t-sky-500' : 'border-slate-200 border-t-blue-600'}`}></div>
        </div>
      ) : (
        <SignUp
          appearance={{
            variables: {
              colorPrimary: darkMode ? "#60a5fa" : "#2563eb",
              colorText: darkMode ? "#f8fafc" : "#111827",
              colorBackground: darkMode ? "#111827" : "#ffffff",
              colorInputBackground: darkMode ? "#1f2937" : "#f8fafc",
              colorInputText: darkMode ? "#f8fafc" : "#111827",
              colorTextSecondary: darkMode ? "#cbd5e1" : "#475569",
              colorDanger: "#fca5a5",
            },
            elements: {
              card: darkMode
                ? "border border-slate-700 bg-slate-900 shadow-2xl"
                : "border border-slate-200 bg-white shadow-2xl",
              headerTitle: darkMode ? "text-slate-100" : "text-slate-900",
              headerSubtitle: darkMode ? "text-slate-300" : "text-slate-600",
              socialButtonsBlockButton:
                darkMode
                  ? "border-slate-700 bg-slate-800 text-slate-100"
                  : "border-slate-200 bg-white text-slate-900",
              formButtonPrimary:
                darkMode
                  ? "bg-sky-500 hover:bg-sky-400 text-slate-950"
                  : "bg-blue-600 hover:bg-blue-500 text-white",
            },
          }}
        />
      )}
    </div>
  );
}
