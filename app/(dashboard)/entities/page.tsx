'use client';

import React, { useEffect, useState } from 'react';
import type { Task } from '@/types/task';
import EntityTable from './components/EntityTable';
import EntityForm from './components/EntityForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteTask, fetchTasks } from '@/store/slices/taskSlice';
import ConfirmModal from '@/components/shared/ConfirmModal';
import FilterModal from '@/components/shared/FilterModal';
import { FilterIcon, Plus, Search, X, Download } from 'lucide-react';
import { exportTasksCsv } from '@/services/taskApi';
import { downloadBlob } from '@/lib/download';

type TaskFilters = {
    status?: "" | "todo" | "in_progress" | "done";
    priority?: "" | "low" | "medium" | "high";
    dueFrom?: string;
    dueTo?: string;
    sort?: "createdAt" | "dueDate" | "priority" | "status" | "title";
    order?: "asc" | "desc";
};

export default function EntitiesPage() {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [query, setQuery] = React.useState('');
    const [searchInput, setSearchInput] = React.useState(query);
    const [loading, setLoading] = React.useState(true);

    const [filters, setFilters] = React.useState<TaskFilters>({
        status: "",
        priority: "",
        dueFrom: "",
        dueTo: "",
        sort: "createdAt",
        order: "desc",
    });
    const [draftFilters, setDraftFilters] = React.useState<TaskFilters>(filters);
    const [filterOpen, setFilterOpen] = React.useState(false);

    const [showForm, setShowForm] = React.useState(false);
    const [editing, setEditing] = React.useState<Task | null>(null);

    const dispatch = useAppDispatch();

    const [token, setToken] = useState<any>();
    const localToken = useAppSelector((s: any) => s.auth.token);

    const items = useAppSelector((s: any) => s.tasks.items);
    const total = useAppSelector((s: any) => s.tasks.total);
    const status = useAppSelector((s: any) => s.tasks.status);
    const error = useAppSelector((s: any) => s.tasks.error);

    const [confirm, setConfirm] = React.useState<{ open: boolean; id?: string }>({ open: false });

    const load = React.useCallback(async () => {

        if (token) {
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
                setLoading(false);
            } catch (e: any) {
                console.error(e);
            }
        }


    }, [dispatch, page, pageSize, query, filters, token]);

    // useEffect(() => { load(); }, [load]);
    useEffect(() => { if (filterOpen) setDraftFilters(filters); }, [filterOpen, filters]);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const onCreate = () => { setEditing(null); setShowForm(true); };
    const onEdit = (t: Task) => { setEditing(t); setShowForm(true); };

    const onDelete = (id: string) => { setConfirm({ open: true, id }); };
    const handleConfirm = async () => {
        if (!confirm.id) return;
        try {
            await dispatch(deleteTask({ id: confirm.id, token })).unwrap();
            await load();
        } catch (e: any) {
            alert(e.message || "Failed to delete");
        } finally {
            setConfirm({ open: false });
        }
    };
    const handleCancel = () => setConfirm({ open: false });
    const onSaved = async () => { setShowForm(false); await load(); };


    const buildExportParams = React.useCallback(() => {
        const p = new URLSearchParams();

        if (query) p.set("q", query);
        if (filters.status) p.set("status", filters.status);
        if (filters.priority) p.set("priority", filters.priority);
        if (filters.dueFrom) p.set("dueFrom", filters.dueFrom);
        if (filters.dueTo) p.set("dueTo", filters.dueTo);
        p.set("sort", filters.sort || "createdAt");
        p.set("order", filters.order || "desc");
        return p;
    }, [query, filters]);

    const [exporting, setExporting] = React.useState(false);
    const onExportCsv = async () => {
        try {
            setExporting(true);
            const params = await buildExportParams();

            console.log({ params });

            const blob = await exportTasksCsv({ params, token });

            const now = new Date();
            const stamp =
                `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-` +
                `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
            await downloadBlob(blob, `tasks-${stamp}.csv`);
        } catch (e: any) {
            alert(e.message || "Failed to export CSV");
        } finally {
            setExporting(false);
        }
    };


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
    }, [localToken,load])


    return (
        <div className="mx-auto max-w-6xl p-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold">Tasks</h1>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <form
                        onSubmit={(e) => { e.preventDefault(); setPage(1); }}
                        className="relative w-full sm:w-72"
                    >
                        <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") setPage(1); }}
                            placeholder="Search…"
                            className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] pl-8 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                            aria-label="Search tasks"
                        />
                        {searchInput ? (
                            <button
                                type="button"
                                onClick={() => { setSearchInput(""); setPage(1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-[var(--panel-border)]/40"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4 opacity-60" />
                            </button>
                        ) : null}
                    </form>

                    <div className="flex items-center gap-2">
                        {/* ⬇️ NEW: Export CSV */}
                        <button
                            onClick={onExportCsv}
                            disabled={exporting}
                            className="inline-flex items-center gap-2 rounded-md border border-[var(--panel-border)] bg-[var(--panel)] px-3 py-2 text-sm hover:bg-[var(--panel-border)]/40 disabled:opacity-60"
                            aria-label="Export CSV"
                            title="Export CSV (current filters)"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden xs:inline">{exporting ? "Exporting…" : "Export"}</span>
                        </button>

                        {/* Filter */}
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            aria-label="Open filters"
                        >
                            <FilterIcon className="h-4 w-4" />
                            <span className="hidden xs:inline">Filter</span>
                        </button>

                        {/* New Task */}
                        <button
                            onClick={onCreate}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                            aria-label="Create new task"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden xs:inline">New Task</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3">
                {error && (
                    <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <EntityTable
                    items={items}
                    loading={loading}
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            <ConfirmModal
                open={confirm.open}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />

            <FilterModal
                open={filterOpen}
                value={draftFilters}
                onChange={(p) => setDraftFilters(prev => ({ ...prev, ...p }))}
                onClear={() => setDraftFilters({ status: "", priority: "", dueFrom: "", dueTo: "", sort: "createdAt", order: "desc" })}
                onApply={() => { setFilters(draftFilters); setPage(1); setFilterOpen(false); }}
                onClose={() => setFilterOpen(false)}
            />

            {showForm && (
                <EntityForm
                    open={showForm}
                    onClose={() => setShowForm(false)}
                    editing={editing}
                    onSaved={onSaved}
                />
            )}
        </div>
    );
}
