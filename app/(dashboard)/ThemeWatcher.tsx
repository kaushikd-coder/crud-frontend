// app/ThemeWatcher.tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "@/store/hooks";

/**
 * Keeps :root (.theme-light / .theme-dark) in sync with Redux theme.
 */
export default function ThemeWatcher() {
    const theme = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        // root.classList.remove("theme-light", "theme-dark");
        root.classList.add("theme-dark");

        // Add the selected theme as a class on :root (works with your CSS vars)
        // if (theme === "dark") {
        //     root.classList.add("theme-dark");
        // } else {
        //     root.classList.add("theme-light");
        // }
    }, [theme]);

    return null;
}
