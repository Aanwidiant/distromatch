import { getTranslations } from 'next-intl/server';

export default async function WhySection() {
    const t = await getTranslations('about.whySection');

    return (
        <section className='grid gap-10 md:grid-cols-2 md:items-center'>
            <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    {t('placeholder')}
                </div>
            </div>
            <div className='space-y-6'>
                <h2 className='text-foreground text-2xl font-semibold'>{t('title')}</h2>
                <p className='text-foreground/80 leading-relaxed'>{t('description.first')}</p>
                <p className='text-foreground/80 leading-relaxed'>{t('description.second')}</p>
            </div>
        </section>
    );
}
