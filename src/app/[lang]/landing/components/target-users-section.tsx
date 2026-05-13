import { Code2, Compass, GraduationCap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function TargetUsersSection() {
    const t = await getTranslations('landing.targetUsersSection');
    const TARGET_USERS = [
        {
            title: t('users.linuxBeginner.title'),
            desc: t('users.linuxBeginner.description'),
            icon: Compass,
        },
        {
            title: t('users.itStudent.title'),
            desc: t('users.itStudent.description'),
            icon: GraduationCap,
        },
        {
            title: t('users.developer.title'),
            desc: t('users.developer.description'),
            icon: Code2,
        },
    ];

    return (
        <section className='space-y-8'>
            <div className='space-y-2 text-center'>
                <h2 className='text-foreground text-3xl font-semibold'>{t('title')}</h2>
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
                {TARGET_USERS.map((item) => (
                    <div
                        key={item.title}
                        className='bg-background border-stroke group space-y-4 rounded-xl border p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                    >
                        <div className='bg-accent-1/40 border-stroke mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border'>
                            <item.icon className='text-primary size-7' />
                        </div>
                        <div className='space-y-1'>
                            <p className='text-foreground text-lg font-semibold'>{item.title}</p>
                            <p className='text-foreground/70 text-sm'>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
