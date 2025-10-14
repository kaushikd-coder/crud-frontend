import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/forgot-password'] as const;
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon.ico', '/assets', '/images', '/fonts'] as const;

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const token = req.cookies.get('auth_token')?.value ?? '';
    const lowerPath:any = pathname.toLowerCase();

    // 1 Normalize case (e.g. /Dashboard → /dashboard)
    if (pathname !== lowerPath) {
        return NextResponse.redirect(new URL(lowerPath + (search || ''), req.url));
    }

    // 2 Allow static/public files
    if (PUBLIC_PREFIXES.some((p) => lowerPath.startsWith(p))) {
        return NextResponse.next();
    }

    const isAuthPage = AUTH_PAGES.includes(lowerPath);
    const isLoggedIn = Boolean(token);

    // 3 Logged-in users visiting / → /dashboard
    if (isLoggedIn && (lowerPath === '/' || lowerPath === '')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 4 Logged-in users visiting auth pages → /dashboard
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Not logged in → redirect to /login for any route (including /)
    if (!isLoggedIn && (!isAuthPage || lowerPath === '/')) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname + (search || ''));
        return NextResponse.redirect(loginUrl);
    }

    // 6️⃣ Default allow
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
