
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchTaskSummary, type TaskSummary } from '@/services/summaryApi';

type SummaryState = {
    data: TaskSummary | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
};

const initialState: SummaryState = {
    data: null,
    status: 'idle',
    error: null,
};

export const loadSummary = createAsyncThunk(
    'summary/load',
    async ({ token }: { token?: string } = {}) => {
        return await fetchTaskSummary({ token });
    }
);

const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSummary.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loadSummary.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(loadSummary.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to load summary';
            });
    },
});

export default summarySlice.reducer;
