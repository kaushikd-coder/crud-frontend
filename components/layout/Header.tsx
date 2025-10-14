"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, useTheme } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";
import { useRouter } from "next/navigation";
import { Moon, Sun, LogOut, UserPlus, X } from "lucide-react";

import { logoutThunk, logoutUser } from "@/store/slices/authSlice";
import { inviteCollaborator } from "@/store/slices/collabSlice"; // ⬅️ from the slice we created

type Role = "viewer" | "editor";

const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const theme = useTheme();

    const [user, setUser] = useState<any>();
    const [token, setToken] = useState<any>();

    const localToken = useAppSelector((s: any) => s.auth.token);
    const localUser = useAppSelector((s: any) => s.auth.user);
    const username = user?.name || user?.username || "Guest";

    useEffect(() => {

        if (localUser && localToken) {
            setUser(localUser);
            setToken(localToken);
            return;
        }


        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch (err) {
                console.error("Failed to parse stored user:", err);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, [localUser, localToken]);


    // Invite dialog state
    const [inviteOpen, setInviteOpen] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [role, setRole] = React.useState<Role>("editor");
    const [taskId, setTaskId] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const closeInvite = () => {
        setInviteOpen(false);
        setEmail("");
        setRole("viewer");
        setTaskId("");
        setError(null);
        setSuccess(null);
        setSubmitting(false);
    };

    const onInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!validEmail) return setError("Please enter a valid email.");
        if (!taskId.trim()) return setError("Please provide a Task ID.");

        setSubmitting(true);
        const res = await dispatch(
            inviteCollaborator({
                taskId: taskId.trim(),
                toEmail: email.trim(),
                role,
            })
        );

        if (inviteCollaborator.fulfilled.match(res)) {
            setSuccess("Invitation sent.");
            // optionally auto-close after a moment
            setTimeout(closeInvite, 800);
        } else {
            setError((res.payload as string) || "Failed to send invite.");
        }
        setSubmitting(false);
    };

    const handleLogout = async () => {
        await dispatch(logoutThunk());
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch(logoutUser());
        router.push("/login");
    };

    React.useEffect(() => {
        if (inviteOpen && !taskId) {
            navigator.clipboard.readText().then((clip) => {
                if (/^[0-9a-fA-F]{24}$/.test(clip.trim())) {
                    setTaskId(clip.trim());
                }
            }).catch(() => { });
        }
    }, [inviteOpen]);

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-[var(--panel-border)] bg-[var(--panel)]/80 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                    {/* Left: App title */}
                    <h1
                        className="text-lg font-semibold tracking-tight cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    >
                        Dashboard
                    </h1>

                    {/* Right: User section */}
                    <div className="flex items-center gap-3 text-sm text-[var(--foreground)]">
                        {/* Welcome */}
                        <span className="hidden sm:inline opacity-80">
                            Welcome, <span className="font-medium">{username}</span>
                        </span>

                        {/* Theme toggle (optional) */}
                        {/* <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-md border border-transparent hover:border-[var(--panel-border)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-zinc-700" />
                            )}
                        </button> */}

                        {/* Invite button */}
                        <button
                            onClick={() => setInviteOpen(true)}
                            className="flex items-center gap-1.5 rounded-md border border-[var(--panel-border)] px-3 py-1.5 hover:bg-[var(--panel-border)]/30 transition"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span className="hidden sm:inline">Invite</span>
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-transparent hover:border-[var(--panel-border)] hover:bg-[var(--panel-border)]/30 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Invite Modal */}
            {inviteOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[80] flex min-h-screen items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        aria-hidden="true"
                        onClick={closeInvite}
                    />

                    {/* Modal panel */}
                    <div
                        className="relative w-full max-w-md rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] shadow-2xl
                 max-h-[85vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 z-10 rounded-t-2xl border-b border-[var(--panel-border)] bg-[var(--panel)] px-5 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">Invite collaborator</h2>
                                <button
                                    onClick={closeInvite}
                                    className="rounded-md p-1 hover:bg-[var(--panel-border)]/30"
                                    aria-label="Close"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={onInviteSubmit} className="px-5 pb-5 pt-4 space-y-4">
                            {/* Task ID with Paste button (optional) */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Task ID</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        value={taskId}
                                        onChange={(e) => setTaskId(e.target.value)}
                                        placeholder="Paste or type Task ID"
                                        className="flex-1 rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                const clip = await navigator.clipboard.readText();
                                                if (clip) setTaskId(clip.trim());
                                            } catch {
                                                alert("Clipboard access denied — paste manually (Ctrl/Cmd+V).");
                                            }
                                        }}
                                        className="rounded-md border border-[var(--panel-border)] px-2.5 py-2 text-xs hover:bg-[var(--panel-border)]/30 transition"
                                    >
                                        Paste
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-1 block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="teammate@example.com"
                                    className="w-full rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/40"
                                    required
                                />
                            </div>



                            {/* Errors / success */}
                            {error && (
                                <div className="rounded-md border border-rose-500/50 bg-rose-500/10 px-3 py-2 text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="rounded-md border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-sm">
                                    {success}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeInvite}
                                    className="rounded-md border border-[var(--panel-border)] px-3 py-2 hover:bg-[var(--panel-border)]/30"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-500 disabled:opacity-60"
                                >
                                    {submitting ? "Sending…" : "Send Invite"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </>
    );
};

export default Header;
