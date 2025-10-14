import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password'] as const;
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon.ico', '/assets', '/images', '/fonts'] as const;

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const { pathname, search } = url;
    const token = req.cookies.get('auth_token')?.value ?? '';

    const lowerPath:any = pathname.toLowerCase();

    // 1️⃣ Normalize case (e.g., /Dashboard → /dashboard)
    if (pathname !== lowerPath) {
        const normalizedUrl = new URL(lowerPath + (search || ''), req.url);
        return NextResponse.redirect(normalizedUrl);
    }

    // 2️⃣ Allow all static/public paths
    if (PUBLIC_PREFIXES.some((p) => lowerPath.startsWith(p))) {
        return NextResponse.next();
    }

    const isAuthPage = AUTH_PAGES.includes(lowerPath);
    const isLoggedIn = Boolean(token);

    // 3️⃣ If logged in and trying to access /login or /register → redirect to dashboard
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 4️⃣ If NOT logged in and trying to access protected routes → redirect to /login
    if (!isLoggedIn && !isAuthPage) {
        const loginUrl = new URL('/login', req.url);
        // optional redirect param (so you can come back after login)
        loginUrl.searchParams.set('redirect', pathname + (search || ''));
        return NextResponse.redirect(loginUrl);
    }

    // 5️⃣ Default behavior: allow through
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
