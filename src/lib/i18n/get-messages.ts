import { unstable_cache } from 'next/cache';
import type { AbstractIntlMessages } from 'next-intl';

export const loadMessages = (locale: string, namespaces: string[]) => {
    return unstable_cache(
        async (): Promise<AbstractIntlMessages> => {
            const messages: AbstractIntlMessages = {};

            await Promise.all(
                namespaces.map(async (ns) => {
                    try {
                        const mod = await import(`../../locales/${locale}/${ns}.json`);
                        messages[ns] = mod.default;
                    } catch (err) {
                        if (process.env.NODE_ENV === 'development') {
                            console.error(
                                `Failed to load namespace: "${ns}" for locale: "${locale}"`,
                                err
                            );
                        }
                    }
                })
            );

            return messages;
        },
        ['messages', locale, ...[...namespaces].sort()],
        { revalidate: 3600 }
    )();
};
