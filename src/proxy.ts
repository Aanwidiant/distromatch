import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 🔹 1. Exclude admin (tanpa i18n)
    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // 🔹 2. Exclude verify email (tanpa i18n)
    if (pathname.startsWith('/verify/email')) {
        return NextResponse.next();
    }

    // 🔹 3. Auth check
    const hasRefreshToken = req.cookies.get('refresh_token')?.value;

    const isProtectedRoute = /^\/[^/]+\/[^/]+\/results/.test(pathname);

    if (isProtectedRoute && !hasRefreshToken) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // 🔹 4. i18n middleware
    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.*\\.xml|robots.txt|.*\\..*$).*)',
    ],
};
