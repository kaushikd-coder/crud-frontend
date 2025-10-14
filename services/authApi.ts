import { LoginSchema, type LoginInput } from "@/lib/validators/auth";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/auth";

type UserDTO = { id: string; email: string; name?: string; role?: string; token?: string };
type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

/** Helper to POST JSON and handle backend errors */
export async function postJSON<T>(url: string, body: unknown): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(body),
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch {
        // ignore if not JSON
    }

    if (!res.ok || !data?.success) {
        const message =
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : `Request failed with ${res.status}`);
        throw new Error(message);
    }

    return data as T;
}

/** ---- LOGIN ---- */
export async function loginApi(
    input: LoginInput
): Promise<{ user: { id: string; email: string; name?: string; role?: string }; token?: string }> {
    const parsed = LoginSchema.safeParse(input);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const response = await postJSON<ApiResponse<UserDTO>>(
        "/api/auth/login",
        parsed.data
    );

    return {
        user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
        },
        token: response.data.token, 
    };
}

/** ---- REGISTER ---- */
export async function registerApi(
    input: RegisterInput
): Promise<{ user: { id: string; email: string; name?: string; role?: string }; token?: string }> {
    const parsed = RegisterSchema.safeParse(input);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const response = await postJSON<ApiResponse<UserDTO>>(
        "/api/auth/register",
        parsed.data
    );

    return {
        user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            role: response.data.role,
        },
        token: response.data.token, 
    };
}

/** ---- LOGOUT ---- */
export async function logoutApi(): Promise<{ success: boolean; message?: string }> {
    const response = await postJSON<ApiResponse<null>>("/api/auth/logout", {});
    return response;
}
