import QuizAuthModal from '@/app/[lang]/quiz/components/quiz-auth-modal';
import QuizFlowController from '@/app/[lang]/quiz/components/quiz-flow-controller';

export default function QuizAttemptPage() {
    return (
        <>
            <QuizFlowController />
            <QuizAuthModal />
        </>
    );
}
