import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/verify')) {
        return NextResponse.next();
    }
    if (pathname.startsWith('/reset-password')) {
        return NextResponse.next();
    }

    const hasRefreshToken = req.cookies.get('refresh_token')?.value;

    const isProtectedRoute = /^\/[^/]+\/[^/]+\/results/.test(pathname);

    if (isProtectedRoute && !hasRefreshToken) {
        return intlMiddleware(req);
    }

    return intlMiddleware(req);
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.*\\.xml|robots.txt|.*\\..*$).*)',
    ],
};
