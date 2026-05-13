import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CircleChevronDown } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function FaqSection() {
    const t = await getTranslations('landing.faqSection');
    const FAQ_ITEMS = [
        {
            id: 'faq-1',
            question: t('items.whatIsDistromatch.question'),
            answer: t('items.whatIsDistromatch.answer'),
        },
        {
            id: 'faq-2',
            question: t('items.whyTopsisBayesian.question'),
            answer: t('items.whyTopsisBayesian.answer'),
        },
        {
            id: 'faq-3',
            question: t('items.howPenaltyWorks.question'),
            answer: t('items.howPenaltyWorks.answer'),
        },
        {
            id: 'faq-4',
            question: t('items.recommendationExplainable.question'),
            answer: t('items.recommendationExplainable.answer'),
        },
        {
            id: 'faq-5',
            question: t('items.freeToUse.question'),
            answer: t('items.freeToUse.answer'),
        },
        {
            id: 'faq-6',
            question: t('items.needRegistration.question'),
            answer: t('items.needRegistration.answer'),
        },
    ];

    return (
        <section className='mx-auto max-w-5xl space-y-8'>
            <h2 className='text-center text-2xl font-semibold md:text-3xl'>{t('title')}</h2>
            <div className='flex w-full'>
                <Accordion
                    type='single'
                    collapsible
                    className='w-full space-y-3'
                    defaultValue={FAQ_ITEMS[0].id}
                >
                    {FAQ_ITEMS.map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger
                                icon={
                                    <CircleChevronDown className='stroke-primary size-6 shrink-0' />
                                }
                                className='cursor-pointer font-semibold hover:no-underline'
                            >
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className='text-grey-3'>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
