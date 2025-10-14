"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";

export default function HomePage() {
  const theme = useAppSelector((s) => s.ui.theme); 
  const dispatch = useAppDispatch();

  useEffect(() => {
    const root = document.documentElement; 
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
  }, [theme]);

  return (
    <main className="min-h-dvh flex items-center justify-center p-6 transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-[380px] space-y-3 rounded-2xl border p-6 shadow-md transition-colors duration-300 bg-[var(--panel)] border-[var(--panel-border)]">
        <h1 className="text-2xl font-semibold">Redux stitched ✅</h1>
        <p className="text-sm opacity-80">Current theme: {theme}</p>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-4 py-2 rounded-md transition-colors duration-200 bg-[var(--foreground)] text-[var(--background)]"
        >
          Toggle Theme
        </button>
      </div>
    </main>
  );
}
