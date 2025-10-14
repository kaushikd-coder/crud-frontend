// jest.setup.ts
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Optional: mock next/navigation for App Router redirects
jest.mock('next/navigation', () => {
    const actual = jest.requireActual('next/navigation');
    return {
        ...actual,
        useRouter: () => ({
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
            prefetch: jest.fn(),
        }),
    };
});
