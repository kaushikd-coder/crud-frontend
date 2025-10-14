// app/(dashboard)/entities/[id]/loading.tsx
export default function Loading() {
    return (
        <div className="mx-auto max-w-4xl p-4">
            <div className="h-8 w-56 animate-pulse rounded bg-[var(--panel-border)]/40" />
            <div className="mt-4 h-40 animate-pulse rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)]" />
        </div>
    );
}
