// app/(dashboard)/entities/[id]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="mx-auto max-w-4xl p-6 text-center">
            <h2 className="text-lg font-semibold">Entity not found</h2>
            <p className="mt-1 opacity-70">The ID you requested doesn’t exist.</p>
            <Link href="/entities" className="mt-3 inline-block rounded border border-[var(--panel-border)] px-3 py-1 hover:bg-[var(--panel-border)]/40">
                Back to Entities
            </Link>
        </div>
    );
}
