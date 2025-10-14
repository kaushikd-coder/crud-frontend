'use client';

import React from 'react';

type ConfirmModalProps = {
    open: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    open,
    title = "Confirm Deletion",
    message = "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-[var(--panel-bg)] text-[var(--foreground)] rounded-xl shadow-lg w-[90%] max-w-sm p-6 border border-[var(--panel-border)]">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm opacity-80 mb-5">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-md border border-[var(--panel-border)] px-3 py-1 text-sm hover:bg-[var(--panel-border)]/30"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-md bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
