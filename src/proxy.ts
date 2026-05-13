import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin/dss')) {
        const requestHeaders = new Headers(req.headers);

        requestHeaders.set('x-pathname', pathname);

        requestHeaders.set('x-next-intl-locale', 'en');

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/verify') ||
        pathname.startsWith('/reset-password')
    ) {
        return NextResponse.next();
    }

    const hasRefreshToken = req.cookies.get('refresh_token')?.value;

    const isProtectedRoute = /^\/[^/]+\/[^/]+\/results/.test(pathname);

    const response = intlMiddleware(req);

    response.headers.set('x-pathname', pathname);

    if (isProtectedRoute && !hasRefreshToken) {
        return response;
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.*\\.xml|robots.txt|.*\\..*$).*)',
    ],
};
