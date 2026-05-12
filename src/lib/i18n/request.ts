import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { loadMessages } from '@/lib/i18n/get-messages';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    const namespaces = ['common', 'distro', 'privacy', 'terms'];
    const messages = await loadMessages(locale, namespaces);

    return {
        locale,
        messages,
    };
});
