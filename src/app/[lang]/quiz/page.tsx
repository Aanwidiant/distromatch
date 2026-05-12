import QuizAuthModal from './components/quiz-auth-modal';
import QuizLandingActions from './components/quiz-landing-actions';
import { CATEGORIES } from '@/lib/quiz-data';
import { CATEGORY_ICONS } from './components/category-icons';
import { CircleCheck, Clock3, Layers, ListChecks, Sparkles } from 'lucide-react';

const QUIZ_STATS = [
    { value: '12', label: 'Pertanyaan', icon: ListChecks },
    { value: '6', label: 'Dimensi', icon: Layers },
    { value: '3', label: 'Menit', icon: Clock3 },
];

export default function QuizPage() {
    return (
        <>
            <main className='flex flex-col gap-12 p-6 md:flex-row md:px-12 lg:px-20'>
                <div className='mx-auto w-full max-w-330 space-y-10 overflow-hidden py-6 md:w-1/2'>
                    <div className='space-y-8'>
                        <span className='bg-accent-1 text-secondary inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
                            <Sparkles className='size-4' />
                            Survey → Bobot → TOPSIS → Bayesian → Penalti → Ranking
                        </span>

                        <h1 className='text-foreground text-4xl leading-tight font-bold md:text-5xl'>
                            Temukan distro Linux{' '}
                            <span className='text-primary'>paling selaras</span> dengan kebutuhanmu.
                        </h1>

                        <p className='text-grey-2 text-lg leading-relaxed'>
                            Jawab 12 pertanyaan singkat. Sistem kami mengubah jawabanmu menjadi
                            bobot, menghitung solusi ideal, menstabilkan skor dengan Bayesian, lalu
                            memberi ranking akhir yang transparan.
                        </p>

                        <ul className='text-foreground/80 grid gap-2 text-sm sm:grid-cols-2'>
                            {[
                                'Skor utility final 0 sampai 1',
                                'Breakdown kontribusi kriteria',
                                'Ranking mudah diaudit',
                                'Hasil konsisten dan terukur',
                            ].map((item) => (
                                <li key={item} className='flex items-start gap-2'>
                                    <CircleCheck className='text-primary mt-0.5 size-4 shrink-0' />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <QuizLandingActions />
                    </div>

                    <div className='grid grid-cols-3 gap-3 md:gap-4'>
                        {QUIZ_STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className='border-stroke bg-bg-2 group relative space-y-3 overflow-hidden rounded-xl border p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md'
                            >
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='bg-accent-1/40 border-stroke flex h-9 w-9 items-center justify-center rounded-lg border'>
                                        <stat.icon className='text-primary size-4' />
                                    </div>
                                    <div className='text-foreground font-mono text-2xl font-bold'>
                                        {stat.value}
                                    </div>
                                </div>
                                <div className='text-grey-2 font-mono text-xs tracking-wide uppercase'>
                                    {stat.label}
                                </div>
                                <span className='bg-primary/10 absolute -top-8 -right-8 h-16 w-16 rounded-full blur-2xl' />
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-wrap gap-3'>
                        {CATEGORIES.map((cat) => {
                            const Icon = CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS];
                            return (
                                <span
                                    key={cat.id}
                                    className='border-stroke bg-accent-1 text-grey-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs'
                                >
                                    <Icon className='size-3.5' />
                                    {cat.title}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className='bg-primary/10 border-stroke relative hidden h-[calc(100vh-10rem)] w-1/2 overflow-hidden rounded-2xl border p-6 md:block'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Visualisasi proses perhitungan
                    </div>
                    <span className='bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl' />
                    <span className='bg-accent-1/30 absolute -bottom-12 -left-8 h-32 w-32 rounded-full blur-2xl' />
                </div>
            </main>
            <QuizAuthModal />
        </>
    );
}
