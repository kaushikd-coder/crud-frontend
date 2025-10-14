'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock3, Flame } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadSummary } from '@/store/slices/summarySlice';

const StatCard: React.FC<{
    label: string;
    value?: number;
    icon?: React.ReactNode;
    loading?: boolean;
}> = ({ label, value, icon, loading }) => (
    <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 shadow-sm">
        <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">{label}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--panel-border)] bg-[var(--panel-bg)]">
                {icon}
            </span>
        </div>
        <div className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {loading ? <span className="inline-block h-[28px] w-16 animate-pulse rounded bg-[var(--panel-border)]/40" /> : (value ?? 0)}
        </div>
    </div>
);

function PriorityBar({ low = 0, medium = 0, high = 0, loading }: { low?: number; medium?: number; high?: number; loading?: boolean }) {
    const total = Math.max(low + medium + high, 1);
    if (loading) {
        return <div className="h-3 w-full animate-pulse rounded bg-[var(--panel-border)]/40" />;
    }
    return (
        <div className="flex h-3 w-full overflow-hidden rounded border border-[var(--panel-border)]">
            <div className="bg-emerald-500/70" style={{ width: `${(low / total) * 100}%` }} aria-label={`Low ${low}`} />
            <div className="bg-amber-400/80" style={{ width: `${(medium / total) * 100}%` }} aria-label={`Medium ${medium}`} />
            <div className="bg-rose-500/80" style={{ width: `${(high / total) * 100}%` }} aria-label={`High ${high}`} />
        </div>
    );
}

export default function DashboardSummary() {
    const dispatch = useAppDispatch();
    const { data, status, error } = useAppSelector((s:any) => s.summary);
    const loading = status === 'loading' && !data;
    const token = useAppSelector((s:any) => s.auth.token);

    React.useEffect(() => {
        dispatch(loadSummary({ token }));
    }, [dispatch, token]);

    return (
        <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
        >
            {error && (
                <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm">
                    Couldn’t load your summary. {error}
                </div>
            )}

            {/* KPI row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Open Tasks" value={data?.openCount} loading={loading} icon={<AlertTriangle className="h-4 w-4" />} />
                <StatCard label="Due Today" value={data?.dueTodayCount} loading={loading} icon={<Clock3 className="h-4 w-4" />} />
                <StatCard label="Overdue" value={data?.overdueCount} loading={loading} icon={<Flame className="h-4 w-4" />} />
                <StatCard label="Completed (7d)" value={data?.velocity7d ?? data?.completedCount} loading={loading} icon={<CheckCircle2 className="h-4 w-4" />} />
            </div>

            {/* Priority distribution card */}
            <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Priority distribution</span>
                    {!loading && (
                        <div className="flex gap-3 text-xs opacity-75">
                            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500/80" /> Low {data?.byPriority.low ?? 0}</span>
                            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-400/90" /> Medium {data?.byPriority.medium ?? 0}</span>
                            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-rose-500/90" /> High {data?.byPriority.high ?? 0}</span>
                        </div>
                    )}
                </div>
                <PriorityBar
                    low={data?.byPriority.low ?? 0}
                    medium={data?.byPriority.medium ?? 0}
                    high={data?.byPriority.high ?? 0}
                    loading={loading}
                />
            </div>
        </motion.section>
    );
}
