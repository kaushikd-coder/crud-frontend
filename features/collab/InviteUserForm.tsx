'use client';
import { CollabRole, inviteCollaboratorApi } from '@/services/collabApi';
import { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';


type FormVals = { email: string; role: CollabRole };


export default function InviteUserForm({ taskId }: { taskId: string }) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormVals>({
        defaultValues: { role: 'viewer' },
    });
    const dispatch: any = useDispatch<AppDispatch>();
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [token, setToken] = useState<any>();
    const localToken = useAppSelector((s: any) => s.auth.token);


    const onSubmit = async (vals: FormVals) => {
        setMsg(null); setErr(null);
        try {

            const payload = {
                toEmail: vals.email.trim(),
                role: vals.role
            }

            await dispatch(inviteCollaboratorApi(token, taskId, payload)).unwrap();
            setMsg('Invite sent');
            reset({ email: '', role: vals.role });
        } catch (e: any) {
            setErr(e.message || 'Failed to send invite');
        }
    };

    useEffect(() => {

        if (localToken) {
            setToken(localToken);
            return;
        }

        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            try {
                setToken(storedToken);
            } catch (err) {
                console.error("Failed to parse stored user:", err);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, [localToken])


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
            <div className="text-sm font-medium">Invite collaborator</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="sm:col-span-3 rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                    {...register('email')}
                />
                <select
                    className="sm:col-span-1 rounded-md border border-[var(--panel-border)] bg-[var(--panel-bg)] px-3 py-2 text-sm"
                    {...register('role')}
                >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                </select>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="sm:col-span-1 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                >
                    {isSubmitting ? 'Sending…' : 'Send Invite'}
                </button>
            </div>
            {msg && <p className="text-xs text-emerald-500">{msg}</p>}
            {err && <p className="text-xs text-rose-500">{err}</p>}
        </form>
    );
}