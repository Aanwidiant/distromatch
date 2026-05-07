import QuizAuthModal from '@/components/quiz/quiz-auth-modal';
import QuizLandingActions from '@/components/quiz/quiz-landing-actions';
import { CATEGORIES } from '@/lib/quiz-data';
import { CATEGORY_ICONS } from '@/components/quiz/category-icons';

export default function QuizPage() {
    return (
        <>
            <main className='flex min-h-screen flex-col gap-12 p-6 md:flex-row md:px-12 lg:px-20 lg:py-12'>
                <div className='w-full space-y-9 md:w-1/2'>
                    <div className='space-y-12'>
                        <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                            Temukan distro Linux <span className='text-grey-3'>yang tepat</span>{' '}
                            untukmu.
                        </h1>
                        <QuizLandingActions />
                        <p className='text-grey-2 text-lg leading-relaxed'>
                            Jawab 12 pertanyaan singkat tentang preferensimu. Sistem kami akan
                            menganalisis dan merekomendasikan distro terbaik berdasarkan kebutuhan
                            nyata kamu.
                        </p>
                    </div>
                    <div className='grid grid-cols-3 gap-3 md:gap-4'>
                        {[
                            { value: '12', label: 'Pertanyaan' },
                            { value: '6', label: 'Kriteria' },
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
                <div className='bg-accent-1 hidden h-[calc(100vh-10rem)] w-1/2 rounded-2xl md:block'></div>
            </main>
            <QuizAuthModal />
        </>
    );
}
