import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth";
import { loginApi, logoutApi, registerApi } from "@/services/authApi";


interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    user: null | { id: string; email: string; name?: string; token?: string };
    token: string | undefined;
    error: string | null;
}


const initialState: AuthState = { status: "idle", user: null, error: null, token: undefined };


export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload: LoginInput, { rejectWithValue }) => {
        try {
            const res = await loginApi(payload);
            return res; // {user, token}
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Invalid credentials");
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (payload: RegisterInput, { rejectWithValue }) => {
        try {
            const res = await registerApi(payload);
            return res;
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Registration failed");
        }
    }
);

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const res = await logoutApi();
        return res;
    } catch (err: any) {
        return rejectWithValue(err?.message ?? "Logout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logoutUser(state) {
            state.user = null;
            state.status = "idle";
            state.error = null;
            state.token = undefined;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        
        builder
            .addCase(logoutThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.status = "idle";
                state.user = null;
                state.error = null;
                
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.status = "idle";
                state.user = null;
                state.error = (action.payload as string) ?? "Logout failed";
                
            });

        
        builder.addMatcher(
            isAnyOf(loginThunk.fulfilled, registerThunk.fulfilled),
            (state, action: PayloadAction<{ user: AuthState["user"]; token?: string }>) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
                if (action.payload.token) {
                    localStorage.setItem("token", action.payload.token);
                }
            }
        );

        builder.addMatcher(
            isAnyOf(loginThunk.pending, registerThunk.pending),
            (state) => {
                state.status = "loading";
                state.error = null;
            }
        );

        builder.addMatcher(
            isAnyOf(loginThunk.rejected, registerThunk.rejected),
            (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) ?? "Authentication failed";
            }
        );
    }

});


export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;



