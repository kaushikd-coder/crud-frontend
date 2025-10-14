export type SuggestionResponse = {
    priority: "low" | "medium" | "high";
    suggestedDueDate: string | null; 
    reasons: string[];
};

export async function fetchTaskSuggestion(
    data: {
        title: string;
        description?: string;
        tags?: string[];
        status?: "todo" | "in_progress" | "done";
        currentDueDate?: string | null;
        tzOffsetMinutes?: number;
    },
    token?: string
): Promise<SuggestionResponse> {
    const res = await fetch(`/api/suggestions/task-meta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Suggestion failed");
    }
    return res.json();
}
