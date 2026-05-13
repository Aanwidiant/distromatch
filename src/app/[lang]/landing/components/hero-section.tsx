import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import { CircleCheck, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HeroSection() {
    const t = await getTranslations('landing.heroSection');

    return (
        <section className='grid gap-12 md:grid-cols-2 md:items-center'>
            <div className='space-y-7'>
                <span className='bg-accent-1 text-primary inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
                    <Sparkles className='size-4' />
                    {t('badge')}
                </span>
                <div className='space-y-4'>
                    <h1 className='text-foreground text-4xl leading-tight font-bold md:text-5xl'>
                        {t('title.prefix')}{' '}
                        <span className='text-primary'>{t('title.highlight')}</span>
                    </h1>
                    <p className='text-foreground/80 text-lg leading-relaxed'>{t('description')}</p>
                </div>
                <ul className='text-foreground/80 grid gap-2 text-sm sm:grid-cols-2'>
                    {[
                        t('features.finalUtilityScore'),
                        t('features.criteriaBreakdown'),
                        t('features.auditableRanking'),
                        t('features.measurableDecisionMethod'),
                    ].map((item) => (
                        <li key={item} className='flex items-start gap-2'>
                            <CircleCheck className='text-primary mt-0.5 size-4 shrink-0' />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <div className='flex flex-col gap-3 sm:flex-row'>
                    <Link href='/quiz'>
                        <Button size='xl' className='w-full sm:w-auto'>
                            {t('buttons.startQuiz')}
                        </Button>
                    </Link>

                    <Link href='/about-us'>
                        <Button size='xl' variant='outline' className='w-full sm:w-auto'>
                            {t('buttons.learnMore')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='bg-primary/10 border-stroke relative h-80 w-full overflow-hidden rounded-2xl border p-6'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    {t('visualization')}
                </div>
                <span className='bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl' />
                <span className='bg-accent-1/30 absolute -bottom-12 -left-8 h-32 w-32 rounded-full blur-2xl' />
            </div>
        </section>
    );
}
