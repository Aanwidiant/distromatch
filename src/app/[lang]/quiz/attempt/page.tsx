import QuizAuthModal from '@/components/quiz/quiz-auth-modal';
import QuizFlowController from '@/components/quiz/quiz-flow-controller';

export default function QuizAttemptPage() {
    return (
        <>
            <QuizFlowController />
            <QuizAuthModal />
        </>
    );
}
