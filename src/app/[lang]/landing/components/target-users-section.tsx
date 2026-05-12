import { Code2, Compass, GraduationCap } from 'lucide-react';

const TARGET_USERS = [
    {
        title: 'Pemula Linux',
        desc: 'Butuh rekomendasi yang jelas dan mudah dipahami.',
        icon: Compass,
    },
    {
        title: 'Mahasiswa IT',
        desc: 'Mencari distro yang cocok untuk belajar dan praktikum.',
        icon: GraduationCap,
    },
    {
        title: 'Developer',
        desc: 'Perlu workflow cepat dengan tools yang stabil.',
        icon: Code2,
    },
];

export default function TargetUsersSection() {
    return (
        <section className='space-y-8'>
            <div className='space-y-2 text-center'>
                <h2 className='text-foreground text-3xl font-semibold'>Cocok untuk siapa?</h2>
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
