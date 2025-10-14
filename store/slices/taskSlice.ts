import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    createTaskApi,
    listTasksApi,
    updateTaskApi,
    deleteTaskApi,
    bulkDeleteTasksApi,
    getTaskApi,
} from "@/services/taskApi";
import type { Task, TaskCreateInput, TaskUpdateInput } from "@/types/task";

interface TaskState {
    items: Task[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    total: number;
    page: number;
    totalPages: number;

    current: Task | null;
    currentStatus: "idle" | "loading" | "succeeded" | "failed";
    currentError: string | null;
}

const initialState: TaskState = {
    items: [],
    status: "idle",
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,

    current: null,
    currentStatus: "idle",
    currentError: null,
};

// ---- Async Thunks ----
export const fetchTasks:any = createAsyncThunk(
    "tasks/fetchAll",
    async ({ params, token }: { params: Record<string, any>; token?: string }, { rejectWithValue }) => {
        try {
            const res = await listTasksApi(params, token);
            return res; 
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);


export const fetchTaskById = createAsyncThunk(
    "tasks/fetchById",
    async ({ id, token }: { id: string; token?: string }, { rejectWithValue }) => {
        try {
            const res = await getTaskApi(id, token);
            return res.data; 
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createTask = createAsyncThunk(
    "tasks/create",
    async ({ payload, token }: { payload: TaskCreateInput; token?: string }, { rejectWithValue }) => {
        try {
            const res = await createTaskApi(payload, token);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateTask = createAsyncThunk(
    "tasks/update",
    async (
        { updatePayload, token }: { updatePayload: { id: string; input: TaskUpdateInput }; token?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await updateTaskApi(updatePayload, token);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteTask = createAsyncThunk(
    "tasks/delete",
    async ({ id, token }: { id: string; token?: string }, { rejectWithValue }) => {
        try {
            await deleteTaskApi(id, token);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const bulkDeleteTasks = createAsyncThunk(
    "tasks/bulkDelete",
    async (ids: string[], { rejectWithValue }) => {
        try {
            await bulkDeleteTasksApi(ids);
            return ids;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---- Slice ----
const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        
        clearCurrent(state) {
            state.current = null;
            state.currentStatus = "idle";
            state.currentError = null;
        },
    },
    extraReducers: (builder) => {
        
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload.data;
                state.total = action.payload.total ?? 0;
                state.page = action.payload.page ?? 1;
                state.totalPages = action.payload.totalPages ?? 1;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = (action.payload as string) ?? "Failed to fetch tasks";
            });

        builder
            .addCase(fetchTaskById.pending, (state) => {
                state.currentStatus = "loading";
                state.currentError = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
                state.currentStatus = "succeeded";
                state.current = action.payload;

                const idx = state.items.findIndex((t) => t._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.currentStatus = "failed";
                state.currentError = (action.payload as string) ?? "Failed to load task";
            });


        builder
            .addCase(createTask.fulfilled, (state, action) => {
                state.items.unshift(action.payload);

                state.current = action.payload;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Failed to create task";
            });

        // Update
        builder
            .addCase(updateTask.fulfilled, (state, action) => {
                const idx = state.items.findIndex((t) => t._id === action.payload._id);
                if (idx !== -1) state.items[idx] = action.payload;
                if (state.current?._id === action.payload._id) state.current = action.payload;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Failed to update task";
            });

        // Delete
        builder
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter((t) => t._id !== action.payload);
                if (state.current?._id === action.payload) {
                    state.current = null;
                    state.currentStatus = "idle";
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = (action.payload as string) ?? "Failed to delete task";
            });

        // Bulk delete
        builder.addCase(bulkDeleteTasks.fulfilled, (state, action: PayloadAction<string[]>) => {
            state.items = state.items.filter((t) => !action.payload.includes(t._id));
            if (state.current && action.payload.includes(state.current._id)) {
                state.current = null;
                state.currentStatus = "idle";
            }
        });
    },
});

export const { clearCurrent } = taskSlice.actions;
export default taskSlice.reducer;
