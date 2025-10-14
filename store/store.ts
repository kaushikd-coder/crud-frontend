import { configureStore } from "@reduxjs/toolkit";
import ui from "./slices/uiSlice";
import { baseApi } from "@/services/baseApi";

export const makeStore = () =>
    configureStore({
        reducer: {
            ui,
            [baseApi.reducerPath]: baseApi.reducer,
        },
        middleware: (gDM) => gDM().concat(baseApi.middleware),
        devTools: process.env.NODE_ENV !== "production",
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
