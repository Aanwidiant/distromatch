import QuizAuthModal from './components/quiz-auth-modal';
import QuizLandingActions from './components/quiz-landing-actions';
import { buildQuizData } from '@/lib/quiz-data';
import { CATEGORY_ICONS } from './components/category-icons';
import { CircleCheck, Clock3, Layers, ListChecks, Sparkles } from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function QuizPage() {
    const messages = await getMessages();
    const t = await getTranslations('quiz.quizPage');
    const quizT = await getTranslations('quiz');
    const { categories } = buildQuizData(quizT);

    const QUIZ_STATS = [
        {
            value: t('stats.questions.value'),
            label: t('stats.questions.label'),
            icon: ListChecks,
        },
        {
            value: t('stats.dimensions.value'),
            label: t('stats.dimensions.label'),
            icon: Layers,
        },
        {
            value: t('stats.minutes.value'),
            label: t('stats.minutes.label'),
            icon: Clock3,
        },
    ];

    return (
        <NextIntlClientProvider messages={messages}>
            <main className='flex flex-col gap-12 p-6 md:flex-row md:px-12 lg:px-20'>
                <div className='mx-auto w-full max-w-330 space-y-10 overflow-hidden py-6 md:w-1/2'>
                    <div className='space-y-8'>
                        <span className='bg-accent-1 text-primary inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
                            <Sparkles className='size-4' />
                            {t('badge')}
                        </span>
                        <h1 className='text-foreground text-4xl leading-tight font-bold md:text-5xl'>
                            {t('title.prefix')}{' '}
                            <span className='text-primary'>{t('title.highlight')}</span>{' '}
                            {t('title.suffix')}
                        </h1>
                        <p className='text-grey-2 text-lg leading-relaxed'>{t('description')}</p>
                        <ul className='text-foreground/80 grid gap-2 text-sm sm:grid-cols-2'>
                            {[
                                t('highlights.finalUtility'),
                                t('highlights.criteriaBreakdown'),
                                t('highlights.auditableRanking'),
                                t('highlights.consistentResults'),
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
                        {categories.map((cat) => {
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
                        {t('placeholder')}
                    </div>
                    <span className='bg-primary/10 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl' />
                    <span className='bg-accent-1/30 absolute -bottom-12 -left-8 h-32 w-32 rounded-full blur-2xl' />
                </div>
            </main>
            <QuizAuthModal />
        </NextIntlClientProvider>
    );
}
