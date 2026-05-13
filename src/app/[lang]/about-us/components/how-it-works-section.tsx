import { BarChart3, ClipboardList, LineChart, Scale, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HowItWorksSection() {
    const t = await getTranslations('about.howItWorksSection');
    const STEPS = [
        {
            step: '01',
            title: t('steps.surveyWeight.title'),
            desc: t('steps.surveyWeight.description'),
            icon: ClipboardList,
        },
        {
            step: '02',
            title: t('steps.normalizationTopsis.title'),
            desc: t('steps.normalizationTopsis.description'),
            icon: BarChart3,
        },
        {
            step: '03',
            title: t('steps.bayesianShrinkage.title'),
            desc: t('steps.bayesianShrinkage.description'),
            icon: LineChart,
        },
        {
            step: '04',
            title: t('steps.symmetricPenalty.title'),
            desc: t('steps.symmetricPenalty.description'),
            icon: Scale,
        },
        {
            step: '05',
            title: t('steps.utilityRanking.title'),
            desc: t('steps.utilityRanking.description'),
            icon: ShieldCheck,
        },
    ];
    return (
        <section className='space-y-6'>
            <h2 className='text-foreground text-2xl font-semibold'>{t('title')}</h2>
            <div className='grid gap-6 md:grid-cols-3'>
                {STEPS.map((item) => (
                    <div
                        key={item.step}
                        className='bg-bg-2 border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='text-primary/50 font-mono text-4xl font-bold'>
                                {item.step}
                            </div>
                            <div className='bg-accent-1/40 border-stroke flex h-10 w-10 items-center justify-center rounded-lg border'>
                                <item.icon className='text-primary size-5' />
                            </div>
                        </div>
                        <div className='space-y-1'>
                            <h3 className='text-foreground text-lg font-semibold'>{item.title}</h3>
                            <p className='text-foreground/80 text-sm'>{item.desc}</p>
                        </div>
                        <span className='bg-primary/10 absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl' />
                    </div>
                ))}
            </div>
        </section>
    );
}
