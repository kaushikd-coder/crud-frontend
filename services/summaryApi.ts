// services/summaryApi.ts
export type TaskSummary = {
    openCount: number;
    completedCount: number;
    dueTodayCount: number;
    overdueCount: number;
    byPriority: { low: number; medium: number; high: number };
    velocity7d: number;
};

type FetchOpts = { token?: string };

export async function fetchTaskSummary(opts: FetchOpts = {}): Promise<TaskSummary> {

    const tzOffsetMin = -new Date().getTimezoneOffset();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

    const res = await fetch(`/api/tasks/summary?tzOffsetMin=${tzOffsetMin}`, {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        
        const msg = await res.text();
        throw new Error(msg || 'Failed to load task summary');
    }

    const json = await res.json();
    return json.data as TaskSummary;
}
