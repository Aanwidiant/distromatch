import QuizAuthModal from '@/app/[lang]/quiz/components/quiz-auth-modal';
import QuizFlowController from '@/app/[lang]/quiz/components/quiz-flow-controller';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function QuizAttemptPage() {
    const messages = await getMessages();
    return (
        <NextIntlClientProvider messages={messages}>
            <QuizFlowController />
            <QuizAuthModal />
        </NextIntlClientProvider>
    );
}
