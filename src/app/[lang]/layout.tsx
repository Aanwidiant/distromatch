import WebFrontLayout from '@/components/layouts/web-front/layout';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/lib/i18n/routing';
import { loadMessages } from '@/lib/i18n/get-messages';

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    if (!hasLocale(routing.locales, lang)) notFound();
    const messages = await loadMessages(lang, ['common']);

    return (
        <NextIntlClientProvider locale={lang} messages={messages}>
            <WebFrontLayout>{children}</WebFrontLayout>
        </NextIntlClientProvider>
    );
}
