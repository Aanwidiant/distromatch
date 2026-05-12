import { ClipboardList, LineChart, ShieldCheck } from 'lucide-react';

const WHAT_IT_DOES_ITEMS = [
    {
        title: 'Survey Kebutuhan',
        desc: 'Mengubah jawaban pengguna menjadi skor per dimensi kebutuhan.',
        icon: ClipboardList,
    },
    {
        title: 'Analisis SPK',
        desc: 'Mengolah data dengan pembobotan, TOPSIS, dan Bayesian.',
        icon: LineChart,
    },
    {
        title: 'Ranking Transparan',
        desc: 'Menampilkan skor utility dan urutan distro yang jelas.',
        icon: ShieldCheck,
    },
];

export default function WhatItDoesSection() {
    return (
        <section className='space-y-6'>
            <h2 className='text-foreground text-2xl font-semibold'>
                Apa yang dilakukan Distromatch?
            </h2>

            <div className='grid gap-6 md:grid-cols-3'>
                {WHAT_IT_DOES_ITEMS.map((item) => (
                    <div
                        key={item.title}
                        className='bg-background border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
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
            </div>
        </section>
    );
}
