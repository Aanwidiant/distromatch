import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        return;
    }

    const hasRefreshToken = req.cookies.get('refresh_token')?.value;

    const isProtectedRoute = /^\/[^/]+\/[^/]+\/results/.test(pathname);

    if (isProtectedRoute && !hasRefreshToken) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return intlMiddleware(req);
}

export default createMiddleware(routing);

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.*\\.xml|robots.txt|.*\\..*$).*)',
    ],
};
