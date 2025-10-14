import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice";
import ui from "./slices/uiSlice";
import tasks from "./slices/taskSlice";
import summary from "./slices/summarySlice";
import suggestion from "./slices/suggestionSlice";
import collabReducer from "./slices/collabSlice";


export const store = configureStore({
    reducer: {
        auth,
        ui,
        tasks,
        summary,
        suggestion,
        collabReducer
    },
    devTools: process.env.NODE_ENV !== "production",
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;