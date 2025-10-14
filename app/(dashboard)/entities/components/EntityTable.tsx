'use client';

import React from 'react';
import type { Task } from '@/types/task';
import Link from 'next/link';

type Props = {
    items: Task[];
    loading: boolean;
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (n: number) => void;
    onEdit: (t: Task) => void;
    onDelete: (id: string) => void;
};

type TaskRow = {
    _id: string;
    title: string;
    priority: "low" | "medium" | "high";
    status: "todo" | "in_progress" | "done";
    dueDate?: string | null;
};

export default function EntityTable({
    items, loading, page, pageSize, total,
    onPageChange, onPageSizeChange, onEdit, onDelete
}: Props) {

    const badge = (text: string, tone: "green" | "yellow" | "red" | "blue") => {
        const tones: Record<string, string> = {
            green: "bg-green-500/20 text-green-400",
            yellow: "bg-yellow-500/20 text-yellow-400",
            red: "bg-rose-500/20 text-rose-400",
            blue: "bg-blue-500/20 text-blue-400",
        };
        return (
            <span className={`rounded-md px-2 py-1 text-xs font-medium ${tones[tone]} capitalize`}>
                {text}
            </span>
        );
    };

    const priorityTone = (p: TaskRow["priority"]) =>
        p === "high" ? "red" : p === "medium" ? "yellow" : "green";

    const statusTone = (s: TaskRow["status"]) =>
        s === "done" ? "green" : s === "in_progress" ? "yellow" : "blue";

    const pages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="w-full">
            {/* Mobile: card list */}
            <div className="md:hidden">
                {loading && items.length === 0 ? (
                    <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-center opacity-70">
                        Loading…
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4 text-center opacity-70">
                        No tasks
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {items.map((t) => (
                            <li
                                key={t._id}
                                className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-semibold">{t.title}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            {badge(t.priority, priorityTone(t.priority) as any)}
                                            {badge(t.status.replace("_", " "), statusTone(t.status) as any)}
                                            <span className="text-xs opacity-70">
                                                {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Primary action on the right (thumb-friendly) */}
                                    <Link
                                        href={`/entities/${t._id}`}
                                        className="shrink-0 rounded-lg bg-indigo-600/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                        aria-label={`View ${t.title}`}
                                    >
                                        View
                                    </Link>
                                </div>

                                {/* Secondary actions */}
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="w-full rounded-lg border border-[var(--panel-border)] px-3 py-2 text-xs font-medium hover:bg-[var(--panel-border)]/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                        aria-label={`Edit ${t.title}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(t._id)}
                                        className="w-full rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                        aria-label={`Delete ${t.title}`}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination (stacked) */}
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-2">
                        <span className="text-xs opacity-80">Rows per page</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                onPageSizeChange(parseInt(e.target.value, 10));
                                onPageChange(1);
                            }}
                            className="rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-2 py-1 text-xs"
                            aria-label="Rows per page"
                        >
                            {[5, 10, 15, 20, 30, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="rounded-md border border-[var(--panel-border)] px-3 py-1 text-sm disabled:opacity-40"
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                        >
                            Prev
                        </button>
                        <span className="text-xs opacity-80">
                            Page {page} / {pages}
                        </span>
                        <button
                            className="rounded-md border border-[var(--panel-border)] px-3 py-1 text-sm disabled:opacity-40"
                            disabled={page >= pages}
                            onClick={() => onPageChange(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop: table view */}
            <div className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-left text-xs uppercase tracking-wide opacity-70">
                            <tr className="[&>th]:py-2 [&>th]:px-3">
                                <th>Title</th>
                                <th className="hidden md:table-cell">Priority</th>
                                <th>Status</th>
                                <th className="hidden md:table-cell">Due</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--panel-border)]">
                            {loading && items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center opacity-70">
                                        Loading…
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center opacity-70">
                                        No tasks
                                    </td>
                                </tr>
                            ) : (
                                items.map((t) => (
                                    <tr key={t._id} className="[&>td]:py-2 [&>td]:px-3">
                                        <td className="font-medium">{t.title}</td>
                                        <td className="hidden md:table-cell">
                                            {badge(t.priority, priorityTone(t.priority) as any)}
                                        </td>
                                        <td>{badge(t.status.replace("_", " "), statusTone(t.status) as any)}</td>
                                        <td className="hidden md:table-cell">
                                            {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="text-right">
                                            <div className="inline-flex gap-2">
                                                <Link
                                                    href={`/entities/${t._id}`}
                                                    className="rounded-md bg-indigo-600/90 px-2 py-1 text-white hover:bg-indigo-500"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => onEdit(t)}
                                                    className="rounded-md border border-[var(--panel-border)] px-2 py-1 hover:bg-[var(--panel-border)]/40"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(t._id)}
                                                    className="rounded-md bg-rose-600 px-2 py-1 text-white hover:bg-rose-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination + Page size */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <span>Rows per page:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                onPageSizeChange(parseInt(e.target.value, 10));
                                onPageChange(1);
                            }}
                            className="rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-2 py-1"
                        >
                            {[5, 10, 15, 20, 30, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded-md border border-[var(--panel-border)] px-2 py-1 disabled:opacity-40"
                            disabled={page <= 1}
                            onClick={() => onPageChange(page - 1)}
                        >
                            Prev
                        </button>
                        <span className="text-sm opacity-80">
                            Page {page} / {pages}
                        </span>
                        <button
                            className="rounded-md border border-[var(--panel-border)] px-2 py-1 disabled:opacity-40"
                            disabled={page >= pages}
                            onClick={() => onPageChange(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
