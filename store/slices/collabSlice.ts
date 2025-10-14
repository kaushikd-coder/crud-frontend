// store/slices/collabSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import {
    acceptInviteApi,
    declineInviteApi,
    inviteCollaboratorApi,
    leaveTaskApi,
    listMyInvitesApi,
    listTaskCollaboratorsApi,
    removeCollaboratorApi,
    updateCollaboratorRoleApi,
    type Collaborator,
    type CollabRole,
    type Invite,
} from "@/services/collabApi";

// ---- Thunks ----

export const inviteCollaborator = createAsyncThunk<
    { message: string },
    { taskId: string; toEmail: string; role: CollabRole },
    { state: RootState; rejectValue: string }
>("collab/invite", async (payload, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";

        return await inviteCollaboratorApi(token, payload.taskId, {
            toEmail: payload.toEmail,
            role: payload.role,
        });
    } catch (e: any) {
        return rejectWithValue(e.message || "Invite failed");
    }
});

export const fetchTaskCollaborators = createAsyncThunk<
    { taskId: string; collaborators: Collaborator[] },
    { taskId: string },
    { state: RootState; rejectValue: string }
>("collab/fetchTaskCollaborators", async ({ taskId }, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";
        const res = await listTaskCollaboratorsApi(token, taskId);
        return { taskId, collaborators: res.collaborators };
    } catch (e: any) {
        return rejectWithValue(e.message || "Fetch collaborators failed");
    }
});

export const updateCollaboratorRole = createAsyncThunk<
    { taskId: string; userId: string; role: CollabRole },
    { taskId: string; userId: string; role: CollabRole },
    { state: RootState; rejectValue: string }
>("collab/updateRole", async ({ taskId, userId, role }, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";
        await updateCollaboratorRoleApi(token, taskId, userId, role);
        return { taskId, userId, role };
    } catch (e: any) {
        return rejectWithValue(e.message || "Update role failed");
    }
});

export const removeCollaborator = createAsyncThunk<
    { taskId: string; userId: string },
    { taskId: string; userId: string },
    { state: RootState; rejectValue: string }
>("collab/remove", async ({ taskId, userId }, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";
        await removeCollaboratorApi(token, taskId, userId);
        return { taskId, userId };
    } catch (e: any) {
        return rejectWithValue(e.message || "Remove collaborator failed");
    }
});

export const leaveTask = createAsyncThunk<
    { taskId: string },
    { taskId: string },
    { state: RootState; rejectValue: string }
>("collab/leave", async ({ taskId }, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";
        await leaveTaskApi(token, taskId);
        return { taskId };
    } catch (e: any) {
        return rejectWithValue(e.message || "Leave task failed");
    }
});

export const fetchMyInvites = createAsyncThunk<
    { invites: Invite[] },
    void,
    { state: RootState; rejectValue: string }
>("collab/fetchInvites", async (_, { getState, rejectWithValue }:any) => {
    try {
        const token = (getState().auth.token as string) || "";
        const res = await listMyInvitesApi(token);
        return { invites: res.invites };
    } catch (e: any) {
        return rejectWithValue(e.message || "Fetch invites failed");
    }
});

export const acceptInvite = createAsyncThunk<
    { token: string },
    { token: string },
    { state: RootState; rejectValue: string }
>("collab/accept", async ({ token }, { getState, rejectWithValue }:any) => {
    try {
        const t = (getState().auth.token as string) || "";
        await acceptInviteApi(t, token);
        return { token };
    } catch (e: any) {
        return rejectWithValue(e.message || "Accept invite failed");
    }
});

export const declineInvite = createAsyncThunk<
    { token: string },
    { token: string },
    { state: RootState; rejectValue: string }
>("collab/decline", async ({ token }, { getState, rejectWithValue }:any) => {
    try {
        const t = (getState().auth.token as string) || "";
        await declineInviteApi(t, token);
        return { token };
    } catch (e: any) {
        return rejectWithValue(e.message || "Decline invite failed");
    }
});

// ---- State ----

type ByTask = Record<string, Collaborator[]>;
interface CollabState {
    byTask: ByTask;            
    invites: Invite[];         
    loadingByTask: Record<string, boolean>;
    invitesLoading: boolean;
    error?: string | null;
}

const initialState: CollabState = {
    byTask: {},
    invites: [],
    loadingByTask: {},
    invitesLoading: false,
    error: null,
};

// ---- Slice ----

const collabSlice = createSlice({
    name: "collab",
    initialState,
    reducers: {
        clearCollabError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // invite
            .addCase(inviteCollaborator.rejected, (s, a) => {
                s.error = a.payload || "Invite failed";
            })

            // fetch collaborators
            .addCase(fetchTaskCollaborators.pending, (s, a) => {
                const taskId = a.meta.arg.taskId;
                s.loadingByTask[taskId] = true;
            })
            .addCase(fetchTaskCollaborators.fulfilled, (s, a) => {
                const { taskId, collaborators } = a.payload;
                s.loadingByTask[taskId] = false;
                s.byTask[taskId] = collaborators;
            })
            .addCase(fetchTaskCollaborators.rejected, (s, a) => {
                const taskId = a.meta.arg.taskId;
                s.loadingByTask[taskId] = false;
                s.error = a.payload || "Fetch collaborators failed";
            })

            // update role
            .addCase(updateCollaboratorRole.fulfilled, (s, a) => {
                const { taskId, userId, role } = a.payload;
                const list = s.byTask[taskId];
                if (list) {
                    const item = list.find((c) => c.user._id === userId);
                    if (item) item.role = role;
                }
            })
            .addCase(updateCollaboratorRole.rejected, (s, a) => {
                s.error = a.payload || "Update role failed";
            })

            // remove collaborator
            .addCase(removeCollaborator.fulfilled, (s, a) => {
                const { taskId, userId } = a.payload;
                const list = s.byTask[taskId];
                if (list) {
                    s.byTask[taskId] = list.filter((c) => c.user._id !== userId);
                }
            })
            .addCase(removeCollaborator.rejected, (s, a) => {
                s.error = a.payload || "Remove collaborator failed";
            })

            // leave task
            .addCase(leaveTask.fulfilled, (s, a) => {
                const { taskId } = a.payload;
                delete s.byTask[taskId];
            })
            .addCase(leaveTask.rejected, (s, a) => {
                s.error = a.payload || "Leave task failed";
            })

            // invites
            .addCase(fetchMyInvites.pending, (s) => {
                s.invitesLoading = true;
            })
            .addCase(fetchMyInvites.fulfilled, (s, a) => {
                s.invitesLoading = false;
                s.invites = a.payload.invites;
            })
            .addCase(fetchMyInvites.rejected, (s, a) => {
                s.invitesLoading = false;
                s.error = a.payload || "Fetch invites failed";
            })
            .addCase(acceptInvite.fulfilled, (s, a) => {
                const token = a.payload.token;
                s.invites = s.invites.filter((i) => i.token !== token);
            })
            .addCase(acceptInvite.rejected, (s, a) => {
                s.error = a.payload || "Accept invite failed";
            })
            .addCase(declineInvite.fulfilled, (s, a) => {
                const token = a.payload.token;
                s.invites = s.invites.filter((i) => i.token !== token);
            })
            .addCase(declineInvite.rejected, (s, a) => {
                s.error = a.payload || "Decline invite failed";
            });
    },
});

export const { clearCollabError } = collabSlice.actions;
export default collabSlice.reducer;

// ---- Selectors ----

export const selectTaskCollaborators = (taskId: string) => (s: any) =>
    s.collab.byTask[taskId] || [];
export const selectTaskCollaboratorsLoading = (taskId: string) => (s: any) =>
    !!s.collab.loadingByTask[taskId];
export const selectMyInvites = (s: any) => s.collab.invites;
export const selectInvitesLoading = (s: any) => s.collab.invitesLoading;
export const selectCollabError = (s: any) => s.collab.error;
