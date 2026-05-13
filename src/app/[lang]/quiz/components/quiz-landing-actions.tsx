'use client';

import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useQuizStore } from '@/stores/quiz-store';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function QuizLandingActions() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const t = useTranslations('quiz.quizLandingActions');

    const { isAuthenticated } = useAuthStore();

    const {
        answers,
        answeredCount,
        resetQuiz,
        setStep,
        setAuthMode,
        setAuthOpen,
        setAuthRedirectTo,
    } = useQuizStore();

    const hasProgress = Object.keys(answers).length > 0;
    const attemptPath = `/${lang}/quiz/attempt`;

    const handleStart = () => {
        if (!isAuthenticated) {
            setAuthMode('login');
            setAuthRedirectTo(attemptPath);
            setAuthOpen(true);
            return;
        }
        router.push(attemptPath);
    };

    const handleRestart = () => {
        resetQuiz();
        setStep(0);
    };

    return (
        <div className='space-y-4'>
            {hasProgress ? (
                <div className='flex flex-col gap-3 sm:flex-row'>
                    <Button size='xl' onClick={handleStart} className='w-full sm:w-auto'>
                        <Play className='mr-2 size-4' />
                        {t('buttons.continue')}
                    </Button>
                    <Button
                        size='xl'
                        variant='outline'
                        onClick={handleRestart}
                        className='w-full sm:w-auto'
                    >
                        <RotateCcw className='mr-2 size-4' />
                        {t('buttons.restart')}
                    </Button>
                </div>
            ) : (
                <Button size='xl' onClick={handleStart} className='w-full sm:w-auto'>
                    <Play className='mr-2 size-4' />
                    {t('buttons.startQuiz')}
                </Button>
            )}
            {hasProgress && (
                <p className='text-grey-2 text-center font-mono text-sm sm:text-left'>
                    {t('progress', { answered: answeredCount() })}
                </p>
            )}
        </div>
    );
}
