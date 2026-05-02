'use client';
// components/quiz/CategoryCard.tsx
import { Category, ANSWER_OPTIONS } from '@/lib/quiz-data';
import { QuestionKey, useQuizStore } from '@/stores/quiz-store';
import AnswerOption from './answer-options';
import { CircleCheck } from 'lucide-react';

type Props = {
    category: Category;
};

export default function CategoryCard({ category }: Props) {
    const { answers, setAnswer } = useQuizStore();

    return (
        <div className='space-y-10'>
            {category.questions.map((question, qIdx) => {
                const globalIdx = (category.id - 1) * 2 + qIdx + 1;
                const selected = answers[question.key];

                return (
                    <div key={question.key}>
                        <div className='mb-5'>
                            <div className='mb-3 flex items-center gap-2'>
                                <span className='text-grey-3 bg-accent-1 border-stroke rounded-md border px-2 py-0.5 font-mono text-xs'>
                                    Q{globalIdx}
                                </span>
                                {selected !== undefined && (
                                    <span className='text-green inline-flex items-center gap-1 font-mono text-xs'>
                                        <CircleCheck className='size-3.5' />
                                        Terjawab
                                    </span>
                                )}
                            </div>
                            <p className='text-foreground text-lg leading-relaxed font-medium'>
                                {question.text}
                            </p>
                        </div>
                        <div className='grid grid-cols-1 gap-2.5 md:grid-cols-5'>
                            {ANSWER_OPTIONS.map((opt) => (
                                <AnswerOption
                                    key={opt.value}
                                    value={opt.value}
                                    label={opt.label}
                                    selected={selected === opt.value}
                                    onClick={() =>
                                        setAnswer(question.key as QuestionKey, opt.value)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
