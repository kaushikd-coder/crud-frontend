// services/taskApi.ts
import type { Task, TaskCreateInput, TaskUpdateInput } from "@/types/task";

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
    total?: number;
    totalPages?: number;
    page?: number;
    limit?: number;
};

type ExportOpts = {
    params?: URLSearchParams;
    selectedIds?: string[]; // optional
};

const BASE_URL = "https://crud-backend-15ir.onrender.com /api/tasks";

/** Helper to handle fetch + JSON + errors */
async function request<T>(url: string, options?: RequestInit, token?: string): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
            ...(token ? { Authorization: token } : {}),
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
        throw new Error(data.message || `Request failed (${res.status})`);
    }

    return data as T;
}

/** ---- CREATE TASK ---- */
export async function createTaskApi(
    input: TaskCreateInput,
    token?: string
): Promise<{ data: Task }> {
    console.log({ input })
    return request<ApiResponse<Task>>(BASE_URL, { method: "POST", body: JSON.stringify(input) }, token);
}

/** ---- LIST TASKS ---- */
export async function listTasksApi(
    params: Record<string, any> = {},
    token?: string
): Promise<{ data: Task[]; total: number; page: number; totalPages: number }> {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
    );
    const q = new URLSearchParams(entries as any).toString();
    return request<any>(`${BASE_URL}?${q}`, undefined, token);
}

/** ---- GET SINGLE TASK ---- */
export async function getTaskApi(id: string, token?: string): Promise<{ data: Task }> {
    return request<ApiResponse<Task>>(`${BASE_URL}/${id}`, undefined, token);
}

/** ---- UPDATE TASK ---- */
export async function updateTaskApi(
    updatePayload: { id: string; input: TaskUpdateInput },
    token?: string
): Promise<{ data: Task }> {
    console.log({ updatePayload })
    return request<ApiResponse<Task>>(
        `${BASE_URL}/${updatePayload.id}`,
        { method: "PATCH", body: JSON.stringify(updatePayload.input) },
        token
    );
}

/** ---- DELETE TASK ---- */
export async function deleteTaskApi(id: string, token?: string): Promise<{ success: boolean }> {
    return request<ApiResponse<null>>(`${BASE_URL}/${id}`, { method: "DELETE" }, token);
}


/** ---- BULK DELETE ---- */
export async function bulkDeleteTasksApi(ids: string[], token?: string): Promise<{ success: boolean }> {
    return request<ApiResponse<null>>(BASE_URL, { method: "DELETE", body: JSON.stringify({ ids }) }, token);
}



/** ---- EXPORT TASKS ---- */
// services/taskApi.ts
export async function exportTasksCsv({ params, token }: { params: URLSearchParams; token?: string | null }) {
    params.set("tzOffsetMinutes", String(-new Date().getTimezoneOffset()));
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/export.csv?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers,
    });
    if (!res.ok) throw new Error(await res.text().catch(() => "Unauthorized"));
    return await res.blob();
}
