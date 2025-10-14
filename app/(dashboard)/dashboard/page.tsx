'use client';
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, CalendarDays, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/store/slices/taskSlice";
import { useDispatch } from "react-redux";
import DashboardSummary from "./_components/DashboardSummary";



export default function DashboardPage() {
    const dispatch = useDispatch();
    const items = useAppSelector((s: any) => s.tasks.items);
    const [token, setToken] = useState<any>();
    const localToken = useAppSelector((s: any) => s.auth.token);

    const [filters, setFilters] = React.useState<any>({
        status: "",
        priority: "",
        dueFrom: "",
        dueTo: "",
        sort: "createdAt",
        order: "desc",
    });

    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [query, setQuery] = React.useState("");


    const recent = [...items]
        .sort((a, b) => (b.updatedAt ? +new Date(b.updatedAt) : 0) - (a.updatedAt ? +new Date(a.updatedAt) : 0))
        .slice(0, 4);

    const load = useCallback(async () => {
        try {
            await dispatch(
                fetchTasks({
                    params: {
                        page,
                        limit: pageSize,
                        q: query || undefined,
                        status: filters.status || undefined,
                        priority: filters.priority || undefined,
                        dueFrom: filters.dueFrom || undefined,
                        dueTo: filters.dueTo || undefined,
                        sort: filters.sort || "createdAt",
                        order: filters.order || "desc",
                    },
                    token,
                })
            ).unwrap();
        } catch (e) {
            console.error(e);
        }
    }, [dispatch, page, pageSize, query, filters, token]);

    useEffect(() => {

        if (localToken) {
            setToken(localToken);
            load()
            return;
        }

        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                setToken(storedToken);
                load()
            } catch (err) {
                console.error("Failed to parse stored user:", err);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, [localToken, load])

    return (
        <section className="relative mx-auto h-full max-w-6xl space-y-8 p-4">
            {/* Decorative bg glows */}
            <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(520px_180px_at_10%_-10%,rgba(99,102,241,.14),transparent_55%),radial-gradient(520px_220px_at_95%_-15%,rgba(16,185,129,.12),transparent_55%)]" />


            {/* HERO */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] shadow-lg"
            >
                <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.6)_1px,transparent_1px)]; [background-size:24px_24px]" />
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative z-10 p-6 md:p-8">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-1 text-xs text-[var(--foreground)]/80">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Welcome back
                        </span>
                        <h1 className="mt-3 text-3xl font-semibold leading-tight">
                            <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Dashboard</span>
                        </h1>
                        <p className="mt-2 max-w-xl text-sm opacity-80">
                            Track work at a glance. Create, filter, and manage your entities with a clean, fast workflow.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            
                            <Link
                                href="/entities"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-2 text-sm transition hover:bg-[var(--panel-border)]/40"
                            >
                                Go to Entities <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[220px] md:h-full">
                        <Image
                            src="https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1600&auto=format&fit=crop"
                            alt="Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-[var(--panel)]/85 via-[var(--panel)]/20 to-transparent" />
                    </div>
                </div>
            </motion.div>

            {/* CONTENT ROWS */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* OVERVIEW KPIs */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="md:col-span-2 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-medium">Overview</h2>
                        <Link href="/entities" className="inline-flex items-center gap-1 text-xs opacity-70 transition hover:opacity-100">
                            View all <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="w-full">
                        <DashboardSummary />
                    </div>
                </motion.div>

                {/* RECENT ACTIVITY */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-sm"
                >
                    <h2 className="mb-4 text-base font-medium">Recent Activity</h2>

                    {recent.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[var(--panel-border)] p-6 text-sm opacity-70">
                            No activity yet. Create your first entity to get started.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {recent.slice(0, 2).map((t) => (
                                <li
                                    key={t._id}
                                    className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3 transition hover:bg-[var(--panel-border)]/30"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{t.title}</div>
                                            <div className="mt-0.5 text-xs opacity-70">
                                                {t.status === "done" ? "Completed" : "Updated"}
                                                {" · "}
                                                {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "—"}
                                            </div>
                                        </div>
                                        <Link
                                            href={`/entities/${t._id}`}
                                            className="inline-flex items-center gap-1 text-xs opacity-80 transition hover:opacity-100"
                                        >
                                            Open <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="mt-4">
                        <Link
                            href="/entities"
                            className="group inline-flex items-center gap-2 rounded-lg border border-[var(--panel-border)] px-3 py-2 text-sm transition hover:bg-[var(--panel-border)]/40"
                        >
                            Create your first entity
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
