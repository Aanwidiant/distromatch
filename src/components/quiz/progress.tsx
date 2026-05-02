import { CATEGORIES, TOTAL_QUESTIONS } from '@/lib/quiz-data';
import { Gauge, Layers, ShieldCheck, Sparkles, UserRound, Users } from 'lucide-react';

const CATEGORY_ICONS = {
    1: Sparkles,
    2: Gauge,
    3: ShieldCheck,
    4: Layers,
    5: Users,
    6: UserRound,
} as const;

type Props = {
    currentStep: number;
    answeredCount: number;
    answeredByCategory: boolean[];
    maxReachableStep: number;
    onStepChange?: (step: number) => void;
};

export default function QuizProgress({
    currentStep,
    answeredCount,
    answeredByCategory,
    maxReachableStep,
    onStepChange,
}: Props) {
    const percent = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

    return (
        <div className='mb-10'>
            <div className='custom-scroll mb-4 flex items-center gap-2 overflow-x-auto pb-2 md:justify-between md:overflow-visible'>
                {CATEGORIES.map((cat, i) => {
                    const isCompleted = answeredByCategory[i] ?? false;
                    const isCurrent = i === currentStep;
                    const isDisabled = i > maxReachableStep;
                    const Icon = CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS];
                    return (
                        <div key={cat.id} className='flex shrink-0 items-center'>
                            <div className='flex flex-col items-center gap-1'>
                                <button
                                    type='button'
                                    onClick={() => onStepChange?.(i)}
                                    disabled={isDisabled}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm transition-all duration-300 ${isCompleted ? 'bg-primary text-white' : isCurrent ? 'bg-accent-1 text-foreground border-primary/40 border' : 'bg-bg-2 text-grey-3 border-stroke border'} ${isDisabled ? 'cursor-not-allowed opacity-40' : 'hover:border-primary/40'} `}
                                    aria-label={`Ke kategori ${cat.title}`}
                                >
                                    <Icon className='size-4' />
                                </button>
                                <span
                                    className={`hidden font-mono text-[10px] tracking-wide transition-colors sm:block ${isCurrent ? 'text-foreground' : isCompleted ? 'text-grey-2' : 'text-grey-3'}`}
                                >
                                    {cat.title.split(' ')[0]}
                                </span>
                            </div>
                            {i < CATEGORIES.length - 1 && (
                                <div className='bg-stroke relative mx-2 h-px w-8 overflow-hidden'>
                                    <div
                                        className='bg-primary/70 absolute inset-y-0 left-0 transition-all duration-500'
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
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
