'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/quiz-data';
import { useQuizStore, QUESTION_KEYS } from '@/stores/quiz-store';
import { useAuthStore } from '@/stores/auth-store';
import AuthDialog from '@/components/globals/auth-modal';
import { Mode } from '@/types';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { CATEGORY_ICONS } from '@/components/quiz/category-icons';
import QuizFlow from '@/components/quiz/quiz-flow';

export default function QuizPage() {
    const router = useRouter();
    const { answers, currentStep, setStep, setSubmitting, isSubmitting, resetQuiz, answeredCount } =
        useQuizStore();

    const { accessToken, profile } = useAuthStore();
    const isLoggedIn = !!accessToken;

    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState<Mode>('login');

    const [hasStarted, setHasStarted] = useState(false);
    const hasProgress = Object.keys(answers).length > 0;

    const category = CATEGORIES[currentStep];
    const answeredByCategory = CATEGORIES.map((cat) =>
        cat.questions.every((q) => answers[q.key] !== undefined)
    );
    const currentCatAnswered = answeredByCategory[currentStep] ?? false;
    const isLastStep = currentStep === CATEGORIES.length - 1;
    const firstUnansweredIndex = answeredByCategory.findIndex((done) => !done);
    const maxReachableStep =
        firstUnansweredIndex === -1 ? CATEGORIES.length - 1 : firstUnansweredIndex;

    const handleStart = () => {
        if (!isLoggedIn) {
            setAuthMode('login');
            setAuthOpen(true);
            return;
        }
        setHasStarted(true);
    };

    const handleRestart = () => {
        resetQuiz();
        setStep(0);
        setHasStarted(false);
    };

    const handleAuthOpenChange = (open: boolean) => {
        setAuthOpen(open);
        if (!open && !!accessToken) {
            setHasStarted(true);
        }
    };

    const handleNext = () => {
        if (!currentCatAnswered) return;
        if (isLastStep) {
            handleSubmit();
        } else {
            setStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleStepChange = (step: number) => {
        if (step > maxReachableStep) return;
        setStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            setAuthMode('login');
            setAuthOpen(true);
            return;
        }

        setSubmitting(true);
        try {
            const survey = QUESTION_KEYS.reduce(
                (acc, key) => ({ ...acc, [key]: answers[key] ?? 3 }),
                {} as Record<string, number>
            );
            const data = await Fetch.POST<{ ok: boolean; dssRunId: string }>('/dss', {
                survey,
            });

            resetQuiz();
            router.push(`/${profile?.username}/results/${data.dssRunId}`);
        } catch (err) {
            console.error(err);
            toast.error('Gagal mengirim jawaban quiz, coba lagi.');
            setSubmitting(false);
        }
    };

    return (
        <>
            {!hasStarted ? (
                <main className='flex min-h-screen flex-col gap-12 p-6 md:flex-row md:px-12 lg:px-24 lg:py-12'>
                    <div className='w-full space-y-9 md:w-1/2'>
                        <div className='space-y-12'>
                            <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                                Temukan distro Linux <span className='text-grey-3'>yang tepat</span>{' '}
                                untukmu.
                            </h1>
                            {hasProgress ? (
                                <div className='flex flex-col gap-3 sm:flex-row'>
                                    <Button
                                        size='xl'
                                        onClick={handleStart}
                                        className='w-full sm:w-auto'
                                    >
                                        <Play className='mr-2 size-4' />
                                        Lanjutkan
                                    </Button>
                                    <Button
                                        size='xl'
                                        variant='outline'
                                        onClick={handleRestart}
                                        className='w-full sm:w-auto'
                                    >
                                        <RotateCcw className='mr-2 size-4' />
                                        Mulai Ulang
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size='xl'
                                    onClick={handleStart}
                                    className='w-full sm:w-auto'
                                >
                                    <Play className='mr-2 size-4' />
                                    Mulai Quiz
                                </Button>
                            )}
                            {hasProgress && (
                                <p className='text-grey-2 text-center font-mono text-sm sm:text-left'>
                                    Progress tersimpan — {answeredCount()}/12 pertanyaan terjawab
                                </p>
                            )}
                            <p className='text-grey-2 text-lg leading-relaxed'>
                                Jawab 12 pertanyaan singkat tentang preferensimu. Sistem kami akan
                                menganalisis dan merekomendasikan distro terbaik berdasarkan
                                kebutuhan nyata kamu.
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
                    <div className='bg-primary hidden h-[calc(100vh-10rem)] w-1/2 rounded-2xl md:block'></div>
                </main>
            ) : (
                <QuizFlow
                    category={category}
                    currentStep={currentStep}
                    answeredByCategory={answeredByCategory}
                    maxReachableStep={maxReachableStep}
                    currentCatAnswered={currentCatAnswered}
                    isSubmitting={isSubmitting}
                    isLastStep={isLastStep}
                    answeredCount={answeredCount()}
                    onStepChange={handleStepChange}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            )}
            <AuthDialog
                open={authOpen}
                onOpenChange={handleAuthOpenChange}
                mode={authMode}
                setMode={setAuthMode}
            />
        </>
    );
}
