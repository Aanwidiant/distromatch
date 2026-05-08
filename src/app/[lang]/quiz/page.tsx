import QuizAuthModal from '@/components/quiz/quiz-auth-modal';
import QuizLandingActions from '@/components/quiz/quiz-landing-actions';
import { CATEGORIES } from '@/lib/quiz-data';
import { CATEGORY_ICONS } from '@/components/quiz/category-icons';

export default function QuizPage() {
    return (
        <>
            <main className='flex min-h-screen flex-col gap-12 md:flex-row'>
                <div className='w-full space-y-9 md:w-1/2'>
                    <div className='space-y-8'>
                        <span className='bg-accent-1 text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold'>
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

                        <QuizLandingActions />
                    </div>

                    <div className='grid grid-cols-3 gap-3 md:gap-4'>
                        {[
                            { value: '12', label: 'Pertanyaan' },
                            { value: '6', label: 'Dimensi' },
                            { value: '3', label: 'Menit' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className='border-stroke bg-bg-2 space-y-2 rounded-xl border p-4 text-center shadow'
                            >
                                <div className='text-foreground font-mono text-2xl font-bold'>
                                    {stat.value}
                                </div>
                                <div className='text-grey-2 font-mono text-xs tracking-wide uppercase'>
                                    {stat.label}
                                </div>
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

                <div className='bg-primary/10 border-stroke hidden h-[calc(100vh-10rem)] w-1/2 rounded-2xl border p-6 md:block'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Visualisasi proses perhitungan
                    </div>
                </div>
            </main>

            <QuizAuthModal />
        </>
    );
}
