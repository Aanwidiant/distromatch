import { ClipboardList, Cpu, Gauge, Layers } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function StatsSection() {
    const t = await getTranslations('about.statsSection');
    const STATS = [
        {
            value: t('stats.quizQuestions.value'),
            label: t('stats.quizQuestions.label'),
            icon: ClipboardList,
        },
        {
            value: t('stats.assessmentDimensions.value'),
            label: t('stats.assessmentDimensions.label'),
            icon: Layers,
        },
        {
            value: t('stats.decisionMethods.value'),
            label: t('stats.decisionMethods.label'),
            icon: Cpu,
        },
        {
            value: t('stats.dataDriven.value'),
            label: t('stats.dataDriven.label'),
            icon: Gauge,
        },
    ];

    return (
        <section className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {STATS.map((item) => (
                <div
                    key={item.label}
                    className='bg-background border-stroke group relative space-y-3 overflow-hidden rounded-xl border p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                >
                    <div className='flex items-center justify-center gap-3'>
                        <div className='bg-accent-1/40 border-stroke flex h-10 w-10 items-center justify-center rounded-lg border'>
                            <item.icon className='text-primary size-5' />
                        </div>
                        <div className='text-foreground text-xl font-bold'>{item.value}</div>
                    </div>
                    <div className='text-foreground/70 text-xs tracking-wide uppercase'>
                        {item.label}
                    </div>
                    <span className='bg-primary/10 absolute -top-10 -right-10 h-20 w-20 rounded-full blur-2xl' />
                </div>
            ))}
        </section>
    );
}
