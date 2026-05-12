import { BarChart3, ClipboardList, LineChart, Scale, ShieldCheck } from 'lucide-react';

const STEPS = [
    {
        step: '01',
        title: 'Survey & Bobot',
        desc: 'Nilai per dimensi dihitung dan dibobotkan sesuai preferensi.',
        icon: ClipboardList,
    },
    {
        step: '02',
        title: 'Normalisasi & TOPSIS',
        desc: 'Matriks ternormalisasi, solusi ideal, dan closeness coefficient.',
        icon: BarChart3,
    },
    {
        step: '03',
        title: 'Bayesian Shrinkage',
        desc: 'Menstabilkan skor jika data review terbatas.',
        icon: LineChart,
    },
    {
        step: '04',
        title: 'Penalti Simetris',
        desc: 'Mengurangi skor bila level distro terlalu jauh dari preferensi.',
        icon: Scale,
    },
    {
        step: '05',
        title: 'Utility & Ranking',
        desc: 'Skor final (0–1) lalu diurutkan dengan tie-breaker review.',
        icon: ShieldCheck,
    },
];

export default function HowItWorksSection() {
    return (
        <section className='space-y-6'>
            <h2 className='text-foreground text-2xl font-semibold'>Langkah-langkah perhitungan</h2>

            <div className='grid gap-6 md:grid-cols-3'>
                {STEPS.map((item) => (
                    <div
                        key={item.step}
                        className='bg-bg-2 border-stroke group relative space-y-4 overflow-hidden rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='text-primary/15 font-mono text-4xl font-bold'>
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
