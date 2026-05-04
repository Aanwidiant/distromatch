import { TOTAL_QUESTIONS } from '@/lib/quiz-data';

type Props = {
    answeredCount: number;
};

export default function QuizProgress({ answeredCount }: Props) {
    const percent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

    return (
        <div className='mb-6'>
            <div className='bg-stroke/70 relative h-1.5 overflow-hidden rounded-full'>
                <div
                    className='bg-primary absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out'
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className='mt-2 flex justify-between'>
                <span className='text-grey-3 font-mono text-xs'>
                    {answeredCount}/{TOTAL_QUESTIONS} pertanyaan
                </span>
                <span className='text-grey-3 font-mono text-xs'>{percent}%</span>
            </div>
        </div>
    );
}
