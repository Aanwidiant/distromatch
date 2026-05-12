import { TOTAL_QUESTIONS } from '@/lib/quiz-data';

type Props = {
    answeredCount: number;
};

export default function QuizProgress({ answeredCount }: Props) {
    const rawPercent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
    const percent = Math.min(100, Math.max(0, rawPercent));
    const size = 72;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className='border-stroke bg-bg-2 flex items-center gap-3 rounded-xl border p-4'>
            <div className='relative h-18 w-18'>
                <svg
                    className='h-18 w-18 -rotate-90'
                    viewBox={`0 0 ${size} ${size}`}
                    aria-hidden='true'
                >
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        className='text-stroke/70'
                        stroke='currentColor'
                        strokeWidth={strokeWidth}
                        fill='none'
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        className='text-primary'
                        stroke='currentColor'
                        strokeWidth={strokeWidth}
                        strokeLinecap='round'
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        fill='none'
                    />
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-foreground text-lg font-bold'>{percent}%</span>
                    <span className='text-grey-3 text-[10px]'>Progress</span>
                </div>
            </div>
            <div className='space-y-1'>
                <div className='text-grey-3 font-mono text-xs tracking-widest uppercase'>
                    Progress Quiz
                </div>
                <div className='text-foreground text-sm font-semibold'>
                    {answeredCount}/{TOTAL_QUESTIONS} pertanyaan
                </div>
            </div>
        </div>
    );
}
