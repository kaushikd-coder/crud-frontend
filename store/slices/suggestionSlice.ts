import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchTaskSuggestion, SuggestionResponse } from "@/services/suggestionApi";

type State = {
    preview: SuggestionResponse | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
};

const initialState: State = { preview: null, status: "idle", error: null };

export const getSuggestion = createAsyncThunk(
    "suggestion/get",
    async (
        payload: {
            title: string;
            description?: string;
            tags?: string[];
            status?: "todo" | "in_progress" | "done";
            currentDueDate?: string | null;
            tzOffsetMinutes?: number;
            token?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const { token, ...data } = payload;
            return await fetchTaskSuggestion(data, token);
        } catch (e: any) {
            return rejectWithValue(e.message ?? "Failed to get suggestion");
        }
    }
);

const suggestionSlice = createSlice({
    name: "suggestion",
    initialState,
    reducers: {
        clearSuggestion(state) {
            state.preview = null;
            state.status = "idle";
            state.error = null;
        },
    },
    extraReducers: (b) => {
        b.addCase(getSuggestion.pending, (s) => { s.status = "loading"; s.error = null; });
        b.addCase(getSuggestion.fulfilled, (s, a) => { s.status = "idle"; s.preview = a.payload; });
        b.addCase(getSuggestion.rejected, (s, a) => { s.status = "failed"; s.error = String(a.payload ?? "error"); });
    },
});

export const { clearSuggestion } = suggestionSlice.actions;
export default suggestionSlice.reducer;
