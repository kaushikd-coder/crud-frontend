"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {


    return (
        <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            <header className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[var(--panel)]/80 backdrop-blur">
                <Header />
            </header>

            <main className="mx-auto flex-1 max-w-6xl px-4 py-6">
                {children}
            </main>


                <Footer />

        </div>
    );
}
