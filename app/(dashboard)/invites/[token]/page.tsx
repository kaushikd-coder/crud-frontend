
'use client';
import { getAuthToken } from '@/lib/auth';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function InviteBridge() {
    const { token } = useParams<{ token: string }>();
    const qp = useSearchParams();
    const router = useRouter();
    const action = (qp.get('action') || '').toLowerCase(); 
    const [msg, setMsg] = useState('Processing invite…');

    useEffect(() => {
        const t = getAuthToken();
        if (!t) {
            router.replace(`/login?next=/invites/${token}?action=${action}`);
            return;
        }

        const run = async () => {
            try {
                const res = await fetch(`/api/tasks/invites/${token}/${action}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Failed');
                setMsg(action === 'accept' ? 'Invite accepted! Redirecting…' : 'Invite declined.');
                setTimeout(() => router.replace('/dashboard'), 1200);
            } catch (e: any) {
                setMsg(e.message || 'Something went wrong.');
            }
        };
        if (action === 'accept') run();
        else setMsg('Invalid invite link.');
    }, [action, token, router]);

    return <div className="mx-auto max-w-md p-6 text-center">{msg}</div>;
}
