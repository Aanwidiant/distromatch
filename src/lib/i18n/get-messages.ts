// lib/i18n/get-messages.ts
import { unstable_cache } from 'next/cache';
import type { AbstractIntlMessages } from 'next-intl';

export const loadMessages = unstable_cache(
    async (locale: string, namespaces: string[]): Promise<AbstractIntlMessages> => {
        const messages: AbstractIntlMessages = {};
        for (const ns of namespaces) {
            try {
                const mod = await import(`../../locales/${locale}/${ns}.json`);
                messages[ns] = mod.default;
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(`Failed to load "${ns}" for "${locale}"`, err);
                }
            }
        }
        return messages;
    },
    ['messages'],
    { revalidate: 3600 }
);
