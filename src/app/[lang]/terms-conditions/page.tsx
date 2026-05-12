import { loadMessages } from '@/lib/i18n/get-messages';
import { Info } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type Section = {
    id: string;
    title: string;
    items?: string[];
    paragraph?: string;
};

export default async function TermsConditionsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    const t = await getTranslations({ locale: lang, namespace: 'terms' });
    const sections = t.raw('sections') as Section[];

    const messages = await loadMessages(lang, ['terms']);

    return (
        <NextIntlClientProvider locale={lang} messages={messages}>
            <main className='p-6 md:px-12 lg:px-20'>
                <div className='mx-auto max-w-330 space-y-12 py-6'>
                    <h1 className='block py-8 text-center text-3xl font-bold lg:text-5xl'>
                        {t('title')}
                    </h1>
                    <p className='mx-auto w-full text-justify md:w-2/3 md:text-center'>
                        {t('description')}
                    </p>
                    <div className='flex flex-col gap-8 md:flex-row'>
                        <aside className='md:w-1/4'>
                            <div className='bg-bg-2 flex flex-col gap-3 overflow-auto rounded-lg p-4 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)]'>
                                <span className='text-sm font-semibold'>
                                    {t('tableOfContents')}
                                </span>
                                <ol className='text-grey-3 list-outside list-decimal space-y-2 pl-6 text-sm'>
                                    {sections.map((section) => (
                                        <li key={section.id} className='pl-2'>
                                            <a
                                                className='hover:text-primary transition-colors'
                                                href={`#${section.id}`}
                                            >
                                                {section.title.replace(/^\d+\.\s*/, '')}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </aside>
                        <div className='flex max-w-none flex-col gap-4 md:w-3/4 md:gap-5 lg:gap-6'>
                            {sections.map((section) => (
                                <div key={section.id} className='flex flex-col gap-3'>
                                    <h2
                                        id={section.id}
                                        className='block scroll-mt-24 text-xl font-semibold lg:text-2xl'
                                    >
                                        {section.title}
                                    </h2>
                                    {section.items ? (
                                        <ul className='list-outside list-disc space-y-2 pl-12'>
                                            {section.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className='text-justify'>{section.paragraph}</p>
                                    )}
                                </div>
                            ))}
                            <div className='flex items-center gap-3 rounded-md border p-3'>
                                <Info className='size-8 shrink-0' />
                                <p className='text-justify'>{t('agreementNotice')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </NextIntlClientProvider>
    );
}
