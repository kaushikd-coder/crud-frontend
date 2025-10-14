'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchTaskById, deleteTask, clearCurrent } from '@/store/slices/taskSlice'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ClipboardCopy, Edit3, Loader2, Trash2 } from 'lucide-react'

// Small helpers
function Badge({ children, tone = 'default' as 'default' | 'info' | 'success' | 'warn' | 'danger' }) {
    const tones: Record<string, string> = {
        default: 'bg-[var(--panel-border)]/40 text-foreground/80 border border-[var(--panel-border)]',
        info: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30',
        success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30',
        warn: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30',
        danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30',
    }
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
    )
}

function prettyDate(iso?: string) {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function TaskDetailPage() {
    const params = useParams<{ id: string }>()
    const id = params?.id
    const dispatch = useAppDispatch()
    const router = useRouter()

    const token = useAppSelector((s: any) => s.auth?.token)
    const task = useAppSelector((s: any) => s.tasks.current)
    const loadState = useAppSelector((s: any) => s.tasks.currentStatus)
    const loadError = useAppSelector((s: any) => s.tasks.currentError)

    useEffect(() => {
        if (id) {
            dispatch(fetchTaskById({ id: String(id), token }))
        }
        return () => {
            dispatch(clearCurrent())
        }
    }, [dispatch, id, token])



    const onCopyId = async () => {
        if (!task?._id) return
        await navigator.clipboard.writeText(task._id)

    }

    const StatusPill = () => {
        const s = task?.status
        if (s === 'done') return <Badge tone="success">Completed</Badge>
        if (s === 'in_progress') return <Badge tone="info">In Progress</Badge>
        return <Badge>To Do</Badge>
    }

    const PriorityPill = () => {
        const p = task?.priority
        if (p === 'high') return <Badge tone="danger">High</Badge>
        if (p === 'medium') return <Badge tone="warn">Medium</Badge>
        return <Badge tone="default">Low</Badge>
    }

    const isLoading = loadState === 'loading'

    return (
        <div className="mx-auto max-w-5xl px-4 py-6">
            {/* Top bar */}
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={() => router.push('/entities')}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--panel-border)] px-3 py-1.5 hover:bg-[var(--panel-border)]/40"
                >
                    <ChevronLeft className="h-4 w-4" /> Back to Entities
                </button>


            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-sm"
            >
                {/* Header Row */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <StatusPill />
                            <PriorityPill />
                        </div>
                        <h1 className="mt-2 truncate text-2xl font-semibold">
                            {isLoading ? (
                                <span className="inline-block h-7 w-64 animate-pulse rounded bg-[var(--panel-border)]/40" />
                            ) : (
                                task?.title || '—'
                            )}
                        </h1>
                        <div className="mt-1 text-xs opacity-70 flex items-center gap-2">
                            <span>ID: {task?._id ?? (isLoading ? 'loading…' : '—')}</span>
                            {task?._id && (
                                <button onClick={onCopyId} className="inline-flex items-center gap-1 rounded px-2 py-0.5 hover:bg-[var(--panel-border)]/40">
                                    <ClipboardCopy className="h-3.5 w-3.5" /> Copy
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-sm">
                            <CalendarDays className="h-4 w-4 opacity-70" />
                            <div>
                                <div className="opacity-70 text-xs">Due date</div>
                                <div className="font-medium">{task?.dueDate ? prettyDate(task.dueDate) : 'Not set'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <h2 className="mb-2 text-[17px] font-semibold ">Description</h2>
                        {isLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--panel-border)]/40" />
                                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--panel-border)]/40" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--panel-border)]/40" />
                            </div>
                        ) : (
                            <p className="leading-7  text-[12px] font-medium opacity-60">{task?.description || 'No description provided.'}</p>
                        )}
                    </div>

                    <div className="md:col-span-1">
                        <h2 className="mb-2 text-sm font-semibold opacity-80">Meta</h2>
                        <div className="divide-y divide-[var(--panel-border)]/60 overflow-hidden rounded-xl border border-[var(--panel-border)]">
                            <div className="flex items-center justify-between bg-[var(--panel-bg)] px-3 py-2 text-sm">
                                <span className="opacity-70">Priority</span>
                                <span className="font-medium capitalize">{task?.priority ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 text-sm">
                                <span className="opacity-70">Status</span>
                                <span className="font-medium capitalize">{task?.status?.replace('_', ' ') ?? '—'}</span>
                            </div>
                            <div className="flex items-center justify-between bg-[var(--panel-bg)] px-3 py-2 text-sm">
                                <span className="opacity-70">Created</span>
                                <span className="font-medium">{task?.createdAt ? prettyDate(task.createdAt) : '—'}</span>
                            </div>
                            <div className="flex items-center justify-between px-3 py-2 text-sm">
                                <span className="opacity-70">Updated</span>
                                <span className="font-medium">{task?.updatedAt ? prettyDate(task.updatedAt) : '—'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error state */}
                {loadError && (
                    <div className="mt-5 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
                        {loadError}
                    </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin opacity-60" />
                    </div>
                )}
            </motion.div>
        </div>
    )
}
