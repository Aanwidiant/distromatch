import { getTranslations } from 'next-intl/server';

export default async function HeroSection() {
    const t = await getTranslations('about.heroSection');

    return (
        <section className='grid gap-12 md:grid-cols-2 md:items-center'>
            <div className='space-y-6'>
                <span className='bg-accent-1 text-primary inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                    {t('badge')}
                </span>

                <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                    {t('title.prefix')} <span className='text-primary'>{t('title.highlight')}</span>
                </h1>

                <div className='space-y-4'>
                    <p className='text-foreground/80 leading-relaxed'>{t('description.first')}</p>

                    <p className='text-foreground/80 leading-relaxed'>{t('description.second')}</p>
                </div>
            </div>

            <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    {t('placeholder')}
                </div>
            </div>
        </section>
    );
}
