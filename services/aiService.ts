export async function generateDescriptionApi(
    title: string,
    context = ""
): Promise<{ text: string }> {
    const res = await fetch("https://crud-backend-15ir.onrender.com /api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ title, context }),
    });

    let data: any = null;
    try { data = await res.json(); } catch { }

    if (!res.ok) {
        const msg = data?.message || data?.error || `Request failed with ${res.status}`;
        throw new Error(msg);
    }

    if (data?.text) return { text: data.text };
    if (data?.data?.text) return { text: data.data.text };

    throw new Error("Malformed response: expected { text }");
}
