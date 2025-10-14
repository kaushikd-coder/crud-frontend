'use client';

export function getAuthToken(): string | null {
    try {
        
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) return token;
        }

        // If not in localStorage, try reading from cookies (client-side)
        const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('auth_token='));
        if (cookie) return cookie.split('=')[1];

        return null;
    } catch (err) {
        console.error('[getAuthToken] failed:', err);
        return null;
    }
}


export function setAuthToken(token: string) {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
            
            document.cookie = `auth_token=${token}; path=/; SameSite=Lax`;
        }
    } catch (err) {
        console.error('[setAuthToken] failed:', err);
    }
}


export function clearAuthToken() {
    try {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            document.cookie = 'auth_token=; path=/; Max-Age=0';
        }
    } catch (err) {
        console.error('[clearAuthToken] failed:', err);
    }
}
