// __tests__/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';

// --- Minimal slices to satisfy hooks used by your app ---
const authSlice = createSlice({
    name: 'auth',
    initialState: { token: '', user: null as null | { id: string; email: string; name?: string } },
    reducers: {
        setAuth: (s, a) => ({ ...s, ...a.payload }),
    },
});

const uiSlice = createSlice({
    name: 'ui',
    initialState: { theme: 'dark' as 'light' | 'dark' },
    reducers: {},
});

// Shape matches your RootState parts that components read
export type TestRootState = {
    auth: ReturnType<typeof authSlice.reducer>;
    ui: ReturnType<typeof uiSlice.reducer>;
};

export function makeTestStore(preloadedState?: Partial<TestRootState>) {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
            ui: uiSlice.reducer,
        },
        preloadedState: {
            auth: { token: '', user: null, ...(preloadedState?.auth ?? {}) },
            ui: { theme: 'dark', ...(preloadedState?.ui ?? {}) },
        } as TestRootState,
    });
}

type Options = Omit<RenderOptions, 'queries'> & {
    preloadedState?: Partial<TestRootState>;
};

export function renderWithProviders(ui: React.ReactElement, options?: Options) {
    const store = makeTestStore(options?.preloadedState);
    const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );
    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...options }),
    };
}
