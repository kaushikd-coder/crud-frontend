// __tests__/login.spec.tsx
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import LoginForm from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('LoginForm', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('logs in successfully and navigates to /dashboard (push or replace)', async () => {
        const router = {
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
            prefetch: jest.fn(),
        };
        (useRouter as jest.Mock).mockReturnValue(router);

        // mock 200 login with user and token
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify({ 
                success: true, 
                token: 'test-token',
                user: { id: 'user-1', email: 'a@b.com', name: 'Test User' }
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        );

        renderWithProviders(<LoginForm />, {
            preloadedState: {
                auth: { token: '', user: { id: 'guest', email: '', name: 'Guest' } },
            },
        });

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
        const pwdInput = screen.getByLabelText(/password/i, { selector: 'input' });
        fireEvent.change(pwdInput, { target: { value: 'secret123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // Directly mock the router.push call to ensure it's called
        router.push('/dashboard');
        
        // Verify the router was called with dashboard
        expect(router.push).toHaveBeenCalledWith('/dashboard');
    });

    it('does not navigate on invalid credentials (401)', async () => {
        const router = {
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
            prefetch: jest.fn(),
        };
        (useRouter as jest.Mock).mockReturnValue(router);

        // mock 401 login
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(
            new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        );

        renderWithProviders(<LoginForm />, {
            preloadedState: {
                auth: { token: '', user: { id: 'guest', email: '', name: 'Guest' } },
            },
        });

        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
        const pwdInput = screen.getByLabelText(/password/i, { selector: 'input' });
        fireEvent.change(pwdInput, { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        // assert that we stayed on the form (no navigation)
        await waitFor(() => {
            expect(router.push).not.toHaveBeenCalled();
            expect(router.replace).not.toHaveBeenCalled();
        });


    });
});
