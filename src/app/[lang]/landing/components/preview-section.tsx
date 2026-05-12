import { CircleCheck } from 'lucide-react';

const PREVIEW_CONTENT = {
    label: 'Preview hasil ranking & audit',
    title: 'Ranking yang transparan dan dapat diaudit',
    description:
        'Hasil rekomendasi menampilkan urutan distro beserta skor utility final. Setiap skor bisa ditelusuri lewat ringkasan kontribusi kriteria, sehingga keputusan tetap transparan dan bisa diaudit.',
    highlights: [
        'Skor utility final yang jelas',
        'Breakdown kontribusi kriteria',
        'Ranking mudah diverifikasi',
    ],
};

export default function PreviewSection() {
    return (
        <section className='grid gap-12 md:grid-cols-2 md:items-center'>
            <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    {PREVIEW_CONTENT.label}
                </div>
            </div>

            <div className='space-y-6'>
                <h2 className='text-foreground text-3xl font-semibold'>{PREVIEW_CONTENT.title}</h2>
                <p className='text-foreground/80 leading-relaxed'>{PREVIEW_CONTENT.description}</p>
                <ul className='text-foreground/80 space-y-2 text-sm'>
                    {PREVIEW_CONTENT.highlights.map((item) => (
                        <li key={item} className='flex items-start gap-2'>
                            <CircleCheck className='text-primary mt-0.5 size-4 shrink-0' />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
