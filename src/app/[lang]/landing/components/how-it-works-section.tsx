import { BarChart3, Layers, SlidersHorizontal } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HowItWorksSection() {
    const t = await getTranslations('landing.howItWorksSection');
    const STEPS = [
        {
            step: '01',
            title: t('steps.surveyWeight.title'),
            desc: t('steps.surveyWeight.description'),
            icon: SlidersHorizontal,
        },
        {
            step: '02',
            title: t('steps.topsis.title'),
            desc: t('steps.topsis.description'),
            icon: BarChart3,
        },
        {
            step: '03',
            title: t('steps.bayesianPenalty.title'),
            desc: t('steps.bayesianPenalty.description'),
            icon: Layers,
        },
    ];

    return (
        <section className='space-y-10'>
            <div className='space-y-3 text-center'>
                <h2 className='text-foreground text-3xl font-semibold'>{t('title')}</h2>
                <p className='text-foreground/70'>{t('description')}</p>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
                {STEPS.map((item) => (
                    <div
                        key={item.step}
                        className='bg-bg-2 border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                    >
                        <div className='bg-primary/10 text-primary flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
                            <item.icon className='size-4' />
                            {t('stepLabel')} {item.step}
                        </div>
                        <h3 className='text-foreground text-lg font-semibold'>{item.title}</h3>
                        <p className='text-foreground/80 text-sm'>{item.desc}</p>
                        <span className='bg-primary/10 absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl' />
                    </div>
                ))}
            </div>
        </section>
    );
}
