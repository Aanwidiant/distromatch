import { BadgeCheck, Scale, UserRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ValuePropsSection() {
    const t = await getTranslations('landing.valuePropsSection');
    const VALUE_PROPS = [
        {
            title: t('items.transparent.title'),
            desc: t('items.transparent.description'),
            icon: BadgeCheck,
        },
        {
            title: t('items.objective.title'),
            desc: t('items.objective.description'),
            icon: Scale,
        },
        {
            title: t('items.personal.title'),
            desc: t('items.personal.description'),
            icon: UserRound,
        },
    ];

    return (
        <section className='grid gap-6 md:grid-cols-3'>
            {VALUE_PROPS.map((item) => (
                <div
                    key={item.title}
                    className='bg-background border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                >
                    <div className='bg-accent-1/40 border-stroke flex h-12 w-12 items-center justify-center rounded-xl border'>
                        <item.icon className='text-primary size-6' />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-secondary text-lg font-semibold'>{item.title}</h3>
                        <p className='text-foreground/80 text-sm'>{item.desc}</p>
                    </div>
                    <span className='bg-primary/10 absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl' />
                </div>
            ))}
        </section>
    );
}
