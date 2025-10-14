// services/collabApi.ts
export type CollabRole = "viewer" | "editor";

export interface Collaborator {
    user: {
        _id: string;
        name?: string;
        username?: string;
        email?: string;
        avatarUrl?: string;
    };
    role: CollabRole;
    addedAt: string;
}

export interface Invite {
    _id: string;
    fromUser: {
        _id: string;
        name?: string;
        email?: string;
    };
    toEmail: string;
    role: CollabRole;
    task?: { _id: string; title: string } | null;
    status: "pending" | "accepted" | "declined" | "expired";
    token: string;
    createdAt: string;
}

const BASE = process.env.NEXT_PUBLIC_API_URL || " https://crud-backend-15ir.onrender.com";

function authHeaders(token: string) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer  ${token}`,
    };
}

// ---- API Calls ----

export async function inviteCollaboratorApi(
    token: string,
    taskId: string,
    payload: { toEmail: string; role: CollabRole }
) {


    const res = await fetch(`${BASE}/api/tasks/${taskId}/collaborators/invite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `${token}` } : {}),
        },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Invite failed (${res.status})`);
    return res.json(); // {message, inviteId?, ...}
}


export async function listTaskCollaboratorsApi(token: string, taskId: string) {
    const res = await fetch(`${BASE}/api/tasks/${taskId}/collaborators`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Fetch collaborators failed`);
    return (await res.json()) as { collaborators: Collaborator[] };
}

export async function updateCollaboratorRoleApi(
    token: string,
    taskId: string,
    userId: string,
    role: CollabRole
) {
    const res = await fetch(`${BASE}/api/tasks/${taskId}/collaborators/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Update role failed`);
    return res.json();
}

export async function removeCollaboratorApi(token: string, taskId: string, userId: string) {
    const res = await fetch(`${BASE}/api/tasks/${taskId}/collaborators/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Remove collaborator failed`);
    return res.json();
}

export async function leaveTaskApi(token: string, taskId: string) {
    const res = await fetch(`${BASE}/api/tasks/${taskId}/collaborators/leave`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Leave task failed`);
    return res.json();
}

export async function listMyInvitesApi(token: string) {
    const res = await fetch(`${BASE}/api/tasks/invites`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Fetch invites failed`);
    return (await res.json()) as { invites: Invite[] };
}

export async function acceptInviteApi(token: string, inviteToken: string) {
    const res = await fetch(`${BASE}/api/tasks/invites/${inviteToken}/accept`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Accept invite failed`);
    return res.json();
}

export async function declineInviteApi(token: string, inviteToken: string) {
    const res = await fetch(`${BASE}/api/tasks/invites/${inviteToken}/decline`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message || `Decline invite failed`);
    return res.json();
}
