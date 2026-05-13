import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { headers } from 'next/headers';
import { routing } from './routing';
import { loadMessages } from '@/lib/i18n/get-messages';

function getNamespaces(pathname: string) {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length >= 2 && segments[1] === 'results') {
        return ['common', 'result'];
    }

    if (pathname.startsWith('/quiz')) {
        return ['common', 'quiz'];
    }

    if (pathname.startsWith('/about')) {
        return ['common', 'about'];
    }

    if (pathname.startsWith('/privacy-policy')) {
        return ['common', 'privacy'];
    }

    if (pathname.startsWith('/terms-conditions')) {
        return ['common', 'terms'];
    }

    if (pathname.startsWith('/distros')) {
        return ['common', 'distro'];
    }

    if (pathname.startsWith('/admin/dss')) {
        return ['common', 'result'];
    }

    return ['common', 'landing'];
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;

    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    const pathname = (await headers()).get('x-pathname') ?? '/';

    const normalizedPath = pathname.replace(/^\/(en|id)/, '') || '/';

    const namespaces = getNamespaces(normalizedPath);

    const messages = await loadMessages(locale, namespaces);

    return {
        locale,
        messages,
    };
});
