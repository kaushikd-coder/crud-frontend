// app/(dashboard)/entities/[id]/not-found.tsx
'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto w-full rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-sm"
                role="region"
                aria-labelledby="not-found-title"
            >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--panel-border)]/70 bg-[var(--panel-bg)]">
                    <SearchX className="h-7 w-7 opacity-70" aria-hidden="true" />
                </div>

                <h2 id="not-found-title" className="text-xl font-semibold">
                    We couldn’t find that page
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm opacity-70">
                    The resource you’re looking for may have been moved, deleted, or the URL is incorrect.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <Link
                        href="/entities"
                        className="rounded-lg border border-[var(--panel-border)] px-4 py-2 text-sm hover:bg-[var(--panel-border)]/40 transition"
                    >
                        Back to Entities
                    </Link>
                    <Link
                        href="/dashboard"
                        className="rounded-lg bg-foreground/90 px-4 py-2 text-sm text-background hover:bg-foreground transition"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="mt-6 text-xs"
            >
                Error code: 404
            </motion.div>
        </div>
    );
}
