import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';

export default function CtaSection() {
    return (
        <section className='bg-primary/10 border-stroke grid gap-8 rounded-2xl border p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10'>
            <div className='space-y-6'>
                <h2 className='text-foreground text-3xl font-semibold'>
                    Siap menemukan distro Linux terbaikmu?
                </h2>
                <p className='text-foreground/80'>
                    Mulai sekarang dan dapatkan rekomendasi berbasis perhitungan dalam hitungan
                    menit.
                </p>
                <div className='flex flex-col gap-3 sm:flex-row'>
                    <Link href='/quiz'>
                        <Button size='lg' className='w-full sm:w-auto'>
                            Mulai Quiz Sekarang
                        </Button>
                    </Link>
                </div>
            </div>
            <div className='bg-primary/15 border-stroke h-56 w-full rounded-2xl border p-4'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    Placeholder image CTA
                </div>
            </div>
        </section>
    );
}
