import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password'] as const;
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon.ico', '/assets', '/images', '/fonts'] as const;

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const token = req.cookies.get('auth_token')?.value ?? '';
    const lowerPath = pathname.toLowerCase();

    // 1) Normalize case
    if (pathname !== lowerPath) {
        return NextResponse.redirect(new URL(lowerPath + (search || ''), req.url));
    }

    // 2) Allow static/public files
    if (PUBLIC_PREFIXES.some(p => lowerPath.startsWith(p))) {
        return NextResponse.next();
    }

    const isAuthPage = (AUTH_PAGES as readonly string[]).includes(lowerPath);
    const isLoggedIn = Boolean(token);

    //if logged in and hitting root => go to dashboard
    if (isLoggedIn && (lowerPath === '/' || lowerPath === '')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 3) Logged-in users shouldn't see auth pages
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 4) Not logged in and trying to access protected routes -> login
    if (!isLoggedIn && !isAuthPage && lowerPath !== '/') {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname + (search || ''));
        return NextResponse.redirect(loginUrl);
    }

    // 5) Default allow
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
