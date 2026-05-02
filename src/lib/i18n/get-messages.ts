import type { AbstractIntlMessages } from 'next-intl';

export async function loadMessages(
    locale: string,
    namespaces: string[]
): Promise<AbstractIntlMessages> {
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
}
