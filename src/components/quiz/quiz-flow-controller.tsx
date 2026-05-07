'use client';

import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/quiz-data';
import { useQuizStore, QUESTION_KEYS } from '@/stores/quiz-store';
import { useAuthStore } from '@/stores/auth-store';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import QuizFlow from '@/components/quiz/quiz-flow';

export default function QuizFlowController() {
    const router = useRouter();
    const {
        answers,
        currentStep,
        setStep,
        setSubmitting,
        isSubmitting,
        resetQuiz,
        answeredCount,
        setAuthMode,
        setAuthOpen,
        setAuthRedirectTo,
    } = useQuizStore();

    const { accessToken, profile } = useAuthStore();
    const isLoggedIn = !!accessToken;

    const category = CATEGORIES[currentStep];
    const answeredByCategory = CATEGORIES.map((cat) =>
        cat.questions.every((q) => answers[q.key] !== undefined)
    );
    const currentCatAnswered = answeredByCategory[currentStep] ?? false;
    const isLastStep = currentStep === CATEGORIES.length - 1;
    const firstUnansweredIndex = answeredByCategory.findIndex((done) => !done);
    const maxReachableStep =
        firstUnansweredIndex === -1 ? CATEGORIES.length - 1 : firstUnansweredIndex;

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
            setAuthRedirectTo(null);
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
        } catch {
            toast.error('Gagal mengirim jawaban quiz, coba lagi.');
            setSubmitting(false);
        }
    };

    return (
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
    );
}
