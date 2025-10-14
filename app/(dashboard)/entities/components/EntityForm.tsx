'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { Task, TaskCreateInput } from '@/types/task';
import { TaskCreateSchema } from '@/types/task';
import { generateDescriptionApi } from '@/services/aiService';
import { useAppSelector } from '@/store/hooks';
import { createTask, updateTask } from '@/store/slices/taskSlice';
import { getSuggestion, clearSuggestion } from '@/store/slices/suggestionSlice';
import { useDispatch } from 'react-redux';

type Props = {
    open: boolean;
    editing: Task | null;
    onClose: () => void;
    onSaved: () => void; 
};

function nowLocalForDatetime(): string {
    const d = new Date();
    d.setSeconds(0, 0); 
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
}

const minDue = nowLocalForDatetime();

export default function EntityForm({ open, editing, onClose, onSaved }: Props) {
    const dispatch = useDispatch<any>();
    const token = useAppSelector((s: any) => s.auth.token);
    const { preview, status: suggestStatus, error: suggestError } = useAppSelector((s: any) => s.suggestion);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TaskCreateInput>({
        resolver: zodResolver(TaskCreateSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            status: 'todo',
            dueDate: '',
        },
    });

    useEffect(() => {
        if (editing) {
            reset({
                title: editing.title,
                description: editing.description ?? '',
                priority: editing.priority,
                status: editing.status,
                dueDate: editing.dueDate ? new Date(editing.dueDate).toISOString().slice(0, 16) : '',
            });
        } else {
            reset({
                title: '',
                description: '',
                priority: 'medium',
                status: 'todo',
                dueDate: '',
            });
        }
        
        dispatch(clearSuggestion());
    }, [editing, reset, dispatch]);


    const [aiBusy, setAiBusy] = React.useState(false);
    const [aiError, setAiError] = React.useState<string | null>(null);
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const handleAIGenerate = async () => {
        const title = getValues('title')?.trim();
        if (!title) {
            setAiError('Enter a title first.');
            return;
        }
        try {
            setAiBusy(true);
            setAiError(null);
            const { text } = await generateDescriptionApi(title);
            const curr = (getValues('description') || '').trim();
            const next = curr ? `${curr}\n\n${text}` : text;
            setValue('description', next, { shouldDirty: true });
        } catch (e: any) {
            setAiError(e?.message || 'Generation failed');
        } finally {
            setAiBusy(false);
        }
    };

    const title = watch('title');
    const description = watch('description');
    const statusVal = watch('status');
    const dueDateVal = watch('dueDate');


    useEffect(() => {

        if (!title?.trim()) {
            dispatch(clearSuggestion());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(
                getSuggestion({
                    title,
                    description,
                    status: statusVal,
                    currentDueDate: dueDateVal ? new Date(dueDateVal).toISOString() : null,
                    tags: [],
                    tzOffsetMinutes: -new Date().getTimezoneOffset(),
                    token,
                })
            );
        }, 450);

        return () => clearTimeout(timer);
    }, [title, description, statusVal, dueDateVal, dispatch, token]);


    const applySuggestion = () => {
        if (!preview) return;
        setValue('priority', preview.priority as TaskCreateInput['priority'], { shouldDirty: true });

        if (preview.suggestedDueDate) {
            
            const iso = new Date(preview.suggestedDueDate);
            const local = new Date(iso.getTime() - new Date().getTimezoneOffset() * 60_000);
            const value = local.toISOString().slice(0, 16);
            setValue('dueDate', value, { shouldDirty: true });
        }
    };

    const onSubmit = async (values: TaskCreateInput) => {
        setSubmitError(null);

        const payload: TaskCreateInput = {
            ...values,
            
            dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
        };

        try {
            if (editing) {
                const updatePayload = { id: editing._id, input: payload };
                await dispatch(updateTask({ updatePayload, token })).unwrap();
            } else {
                await dispatch(createTask({ payload, token })).unwrap();
            }
            onSaved();
        } catch (e: any) {
            setSubmitError(e?.message || 'Failed to save task');
        }
    };

    // Close on ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--panel-border)] bg-[#0f1624] p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{editing ? 'Edit Task' : 'Create Task'}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-md px-2 py-1 hover:bg-[var(--panel-border)]/40"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Title</label>
                        <input
                            {...register('title')}
                            className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50"
                            placeholder="e.g., Fix urgent payment bug"
                        />
                        {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
                        <p className="mt-1 text-xs opacity-60">
                            Tip: add a clear title; suggestions will appear automatically.
                        </p>
                    </div>

                    {/* Description + AI */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block text-sm font-medium">Description</label>
                            <button
                                type="button"
                                onClick={handleAIGenerate}
                                disabled={aiBusy}
                                className="rounded-md border border-[var(--panel-border)] px-2 py-1 text-xs hover:bg-[var(--panel-border)]/40 disabled:opacity-50"
                            >
                                {aiBusy ? 'Generating…' : 'Generate description'}
                            </button>
                        </div>

                        {aiBusy ? (
                            <div className="relative w-full overflow-hidden rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)]">
                                <div className="h-[96px] animate-pulse bg-gradient-to-r from-[var(--panel-border)]/40 via-[var(--panel-border)]/10 to-[var(--panel-border)]/40" />
                                <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--foreground)]/50">
                                    <span className="animate-pulse">✨ Generating AI description…</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    className="w-full resize-y rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                                {aiError && <p className="mt-1 text-xs text-amber-400">{aiError}</p>}
                                {errors.description && (
                                    <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Priority</label>
                            <select
                                {...register('priority')}
                                className="w-full outline-none rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Status</label>
                            <select
                                {...register('status')}
                                className="w-full outline-none rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2"
                            >
                                <option value="todo">To do</option>
                                <option value="in_progress">In progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Due date</label>
                            <input
                                min={minDue}
                                type="datetime-local"
                                {...register('dueDate')}
                                className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Suggestion panel */}
                    <div className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel)] p-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Auto-suggestion</div>
                            <div className="text-xs opacity-70">
                                {suggestStatus === 'loading'
                                    ? 'Analyzing…'
                                    : preview
                                        ? 'Ready'
                                        : 'No suggestion yet'}
                            </div>
                        </div>

                        {suggestError && (
                            <p className="mt-2 text-xs text-amber-400">Suggestion error: {suggestError}</p>
                        )}

                        {preview && (
                            <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="opacity-70">Priority:</span>
                                    <span className="inline-flex rounded-md border px-2 py-0.5 text-xs">
                                        {preview.priority.toUpperCase()}
                                    </span>
                                </div>

                                {preview.suggestedDueDate && (
                                    <div className="flex items-center gap-2">
                                        <span className="opacity-70">Suggested Due:</span>
                                        <span>{new Date(preview.suggestedDueDate).toLocaleString()}</span>
                                    </div>
                                )}

                                {preview.reasons?.length > 0 && (
                                    <ul className="list-disc pl-5 opacity-80">
                                        {preview.reasons.slice(0, 3).map((r: string, i: number) => (
                                            <li key={i}>{r}</li>
                                        ))}
                                    </ul>
                                )}

                                {/* Existing priority + suggestedDueDate ... */}

                                {preview?.extras && (
                                    <div className="mt-3 space-y-2">
                                        {preview.extras.labels?.length ? (
                                            <div className="text-xs">
                                                <div className="opacity-70 mb-1">Labels:</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {preview.extras.labels.map((l: string) => (
                                                        <span key={l} className="inline-flex rounded-md border px-2 py-0.5">
                                                            {l}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}

                                        {preview.extras.timeEstimateMinutes ? (
                                            <div className="text-xs">
                                                <span className="opacity-70">Estimate:</span>{" "}
                                                ~{preview.extras.timeEstimateMinutes} min
                                            </div>
                                        ) : null}

                                        {preview.extras.reminderAt ? (
                                            <div className="text-xs">
                                                <span className="opacity-70">Reminder:</span>{" "}
                                                {new Date(preview.extras.reminderAt).toLocaleString()}
                                            </div>
                                        ) : null}

                                        {preview.extras.startTimeSuggestion ? (
                                            <div className="text-xs">
                                                <span className="opacity-70">Start:</span>{" "}
                                                {new Date(preview.extras.startTimeSuggestion).toLocaleString()}
                                            </div>
                                        ) : null}

                                        {preview.extras.recurrence && preview.extras.recurrence !== "none" ? (
                                            <div className="text-xs">
                                                <span className="opacity-70">Recurrence:</span>{" "}
                                                {preview.extras.recurrence}
                                            </div>
                                        ) : null}

                                        {preview.extras.checklistTemplate?.length ? (
                                            <details className="text-xs">
                                                <summary className="cursor-pointer opacity-70">Checklist template</summary>
                                                <ul className="list-disc pl-5 mt-1">
                                                    {preview.extras.checklistTemplate.map((c: string, i: number) => <li key={i}>{c}</li>)}
                                                </ul>
                                            </details>
                                        ) : null}


                                    </div>
                                )}


                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={applySuggestion}
                                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-500"
                                    >
                                        Apply suggestion
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => dispatch(clearSuggestion())}
                                        className="rounded-md border border-[var(--panel-border)] px-3 py-1.5 text-xs hover:bg-[var(--panel-border)]/40"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit errors */}
                    {submitError && <p className="text-sm text-rose-400">{submitError}</p>}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-[var(--panel-border)] px-3 py-2 hover:bg-[var(--panel-border)]/40"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving…' : editing ? 'Save changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
