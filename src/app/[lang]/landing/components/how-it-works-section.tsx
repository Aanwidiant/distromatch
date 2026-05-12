import { BarChart3, Layers, SlidersHorizontal } from 'lucide-react';

const STEPS = [
    {
        step: '01',
        title: 'Survei & Bobot',
        desc: 'Nilai kebutuhan dihitung per dimensi, lalu dibobotkan.',
        icon: SlidersHorizontal,
    },
    {
        step: '02',
        title: 'TOPSIS',
        desc: 'Normalisasi, ideal solusi, dan closeness coefficient.',
        icon: BarChart3,
    },
    {
        step: '03',
        title: 'Bayesian + Penalti',
        desc: 'Shrinkage confidence & penalti level untuk utility akhir.',
        icon: Layers,
    },
];

export default function HowItWorksSection() {
    return (
        <section className='space-y-10'>
            <div className='space-y-3 text-center'>
                <h2 className='text-foreground text-3xl font-semibold'>
                    Bagaimana perhitungannya?
                </h2>
                <p className='text-foreground/70'>Alur dari data survei sampai ranking distro.</p>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
                {STEPS.map((item) => (
                    <div
                        key={item.step}
                        className='bg-bg-2 border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                    >
                        <div className='bg-primary/10 text-primary flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
                            <item.icon className='size-4' />
                            Step {item.step}
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
