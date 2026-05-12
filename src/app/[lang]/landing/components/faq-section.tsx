import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CircleChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
    {
        id: 'faq-1',
        question: 'Apa itu Distromatch?',
        answer: 'Distromatch adalah platform rekomendasi distro Linux berbasis sistem pendukung keputusan yang transparan dan terukur.',
    },
    {
        id: 'faq-2',
        question: 'Mengapa menggunakan TOPSIS dan Bayesian shrinkage?',
        answer: 'TOPSIS menilai kedekatan terhadap solusi ideal, sedangkan Bayesian shrinkage menstabilkan skor ketika data terbatas.',
    },
    {
        id: 'faq-3',
        question: 'Bagaimana penalti level diterapkan?',
        answer: 'Penalti simetris menurunkan skor jika level distro terlalu jauh dari preferensi pengguna sehingga rekomendasi tetap relevan.',
    },
    {
        id: 'faq-4',
        question: 'Apakah hasil rekomendasi dapat dijelaskan?',
        answer: 'Ya. Setiap skor dapat ditelusuri melalui ringkasan kontribusi kriteria hingga utility akhir.',
    },
    {
        id: 'faq-5',
        question: 'Apakah Distromatch dapat digunakan secara gratis?',
        answer: 'Saat ini Distromatch dapat digunakan secara gratis oleh seluruh pengguna.',
    },
    {
        id: 'faq-6',
        question: 'Apakah saya perlu mendaftar untuk menggunakan Distromatch?',
        answer: 'Ya. Pendaftaran dan login diperlukan agar hasil rekomendasi dapat disimpan serta diaudit.',
    },
];

export default function FaqSection() {
    return (
        <section className='mx-auto max-w-5xl space-y-8'>
            <h2 className='text-center text-2xl font-semibold md:text-3xl'>
                Pertanyaan yang Sering Diajukan
            </h2>
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
