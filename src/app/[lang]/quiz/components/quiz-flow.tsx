import { Category, CATEGORIES } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import QuizProgress from './progress';
import CategoryCard from './category-card';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { CATEGORY_ICONS } from './category-icons';

type QuizFlowProps = {
    category: Category;
    currentStep: number;
    answeredByCategory: boolean[];
    maxReachableStep: number;
    currentCatAnswered: boolean;
    isSubmitting: boolean;
    isLastStep: boolean;
    answeredCount: number;
    onStepChange: (step: number) => void;
    onPrev: () => void;
    onNext: () => void;
};

export default function QuizFlow({
    category,
    currentStep,
    answeredByCategory,
    maxReachableStep,
    currentCatAnswered,
    isSubmitting,
    isLastStep,
    answeredCount,
    onStepChange,
    onPrev,
    onNext,
}: QuizFlowProps) {
    return (
        <main className='flex flex-col p-6 md:px-12 lg:px-20'>
            <div className='mx-auto w-full max-w-330 space-y-6 overflow-hidden py-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]'>
                    <aside className='order-2 space-y-4 md:order-0'>
                        <QuizProgress answeredCount={answeredCount} />
                        <div className='border-stroke bg-bg-2 rounded-xl border p-4'>
                            <div className='text-grey-3 mb-3 font-mono text-xs tracking-widest uppercase'>
                                Daftar Kategori
                            </div>
                            <div className='flex flex-col gap-2'>
                                {CATEGORIES.map((cat, index) => {
                                    const Icon =
                                        CATEGORY_ICONS[cat.id as keyof typeof CATEGORY_ICONS];
                                    const isActive = index === currentStep;
                                    const isDone = answeredByCategory[index];
                                    const isDisabled = index > maxReachableStep;
                                    return (
                                        <button
                                            key={cat.id}
                                            type='button'
                                            disabled={isDisabled}
                                            onClick={() => onStepChange(index)}
                                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                                                isActive
                                                    ? 'border-primary bg-accent-1 text-foreground'
                                                    : isDone
                                                      ? 'border-primary/30 bg-accent-1 text-foreground'
                                                      : 'border-stroke bg-bg-2 text-grey-3'
                                            } ${
                                                isDisabled
                                                    ? 'cursor-not-allowed opacity-40'
                                                    : 'hover:border-primary/40'
                                            }`}
                                        >
                                            <Icon className='text-primary size-4' />
                                            <span className='font-medium'>{cat.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                    <section className='order-1 md:order-0'>
                        <div className='mb-6'>
                            <div className='mb-2 flex items-center gap-3'>
                                {(() => {
                                    const Icon =
                                        CATEGORY_ICONS[category.id as keyof typeof CATEGORY_ICONS];
                                    return <Icon className='text-primary size-7' />;
                                })()}
                                <div>
                                    <div className='text-grey-3 mb-0.5 font-mono text-xs tracking-widest uppercase'>
                                        Kategori {category.id} dari {CATEGORIES.length}
                                    </div>
                                    <h2 className='text-2xl font-bold'>{category.title}</h2>
                                </div>
                            </div>
                            <p className='text-grey-2 ml-12 text-sm'>{category.subtitle}</p>
                        </div>
                        <div className='bg-stroke mb-8 h-px' />
                        <CategoryCard category={category} />
                        <div className='border-stroke mt-8 flex items-center justify-between border-t pt-6'>
                            <Button
                                variant='outline'
                                size='lg'
                                onClick={onPrev}
                                disabled={currentStep === 0}
                                className='gap-2 font-mono text-sm'
                            >
                                <ArrowLeft className='size-4' />
                                Sebelumnya
                            </Button>

                            <Button
                                size='lg'
                                onClick={onNext}
                                disabled={!currentCatAnswered || isSubmitting}
                                className='gap-2 font-semibold'
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className='size-4 animate-spin' />
                                        Menganalisis...
                                    </>
                                ) : isLastStep ? (
                                    <>
                                        <Sparkles className='size-4' />
                                        Lihat Hasil
                                    </>
                                ) : (
                                    <>
                                        Lanjut
                                        <ArrowRight className='size-4' />
                                    </>
                                )}
                            </Button>
                        </div>
                        {!currentCatAnswered && (
                            <p className='text-grey-3 mt-4 text-center font-mono text-xs'>
                                Jawab semua pertanyaan di kategori ini untuk melanjutkan
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
