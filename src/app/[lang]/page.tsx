import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from '@/lib/i18n/navigation';

export default function LandingPage() {
    return (
        <main className='space-y-16'>
            {/* HERO */}
            <section className='grid gap-12 md:grid-cols-2 md:items-center'>
                <div className='space-y-6'>
                    <span className='bg-accent-1 text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                        Sistem Pendukung Keputusan • Data-Driven
                    </span>

                    <h1 className='text-foreground text-4xl leading-tight font-bold md:text-5xl'>
                        Rekomendasi distro Linux berbasis{' '}
                        <span className='text-primary'>perhitungan nyata</span>
                    </h1>

                    <p className='text-foreground/80 text-lg leading-relaxed'>
                        Distromatch memetakan kebutuhanmu, menimbang tiap kriteria, lalu memberi
                        ranking distro paling sesuai — transparan dan bisa dijelaskan.
                    </p>

                    <div className='flex flex-col gap-3 sm:flex-row'>
                        <Link href='/quiz'>
                            <Button size='lg' className='w-full sm:w-auto'>
                                Mulai Quiz
                            </Button>
                        </Link>

                        <Link href='/about-us'>
                            <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                                Pelajari Lebih Lanjut
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='bg-primary/10 border-stroke h-80 w-full rounded-2xl border p-6'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Visualisasi alur perhitungan
                    </div>
                </div>
            </section>

            {/* VALUE PROPS */}
            <section className='grid gap-6 md:grid-cols-3'>
                {[
                    {
                        title: 'Transparan',
                        desc: 'Setiap skor bisa ditelusuri: dari survei hingga utility.',
                    },
                    {
                        title: 'Objektif',
                        desc: 'Menggunakan TOPSIS & Bayesian shrinkage untuk hasil yang stabil.',
                    },
                    {
                        title: 'Personal',
                        desc: 'Penalti simetris memastikan distro cocok dengan levelmu.',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className='bg-background border-stroke space-y-3 rounded-xl border p-6 shadow-sm'
                    >
                        <h3 className='text-secondary font-semibold'>{item.title}</h3>
                        <p className='text-foreground/80 text-sm'>{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* HOW IT WORKS */}
            <section className='space-y-10'>
                <div className='space-y-3 text-center'>
                    <h2 className='text-foreground text-3xl font-semibold'>
                        Bagaimana perhitungannya?
                    </h2>
                    <p className='text-foreground/70'>
                        Alur dari data survei sampai ranking distro.
                    </p>
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                    {[
                        {
                            step: '01',
                            title: 'Survei & Bobot',
                            desc: 'Nilai kebutuhan dihitung per dimensi, lalu dibobotkan.',
                        },
                        {
                            step: '02',
                            title: 'TOPSIS',
                            desc: 'Normalisasi, ideal solusi, dan closeness coefficient.',
                        },
                        {
                            step: '03',
                            title: 'Bayesian + Penalti',
                            desc: 'Shrinkage confidence & penalti level untuk utility akhir.',
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            className='bg-bg-2 border-stroke space-y-3 rounded-xl border p-6'
                        >
                            <div className='text-primary font-mono text-sm'>{item.step}</div>
                            <h3 className='text-foreground font-semibold'>{item.title}</h3>
                            <p className='text-foreground/80 text-sm'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PREVIEW */}
            <section className='grid gap-12 md:grid-cols-2 md:items-center'>
                <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Preview hasil ranking
                    </div>
                </div>

                <div className='space-y-6'>
                    <h2 className='text-foreground text-3xl font-semibold'>
                        Ranking yang bisa dipertanggungjawabkan
                    </h2>

                    <p className='text-foreground/80 leading-relaxed'>
                        Setiap distro mendapat skor utility final yang dapat ditelusuri. Jika
                        nilainya berdekatan, tie-breaker menggunakan total review.
                    </p>

                    <ul className='text-foreground/80 space-y-2 text-sm'>
                        <li>✔️ Skor utility terukur (0–1)</li>
                        <li>✔️ Penjelasan tiap kriteria</li>
                        <li>✔️ Ranking stabil & adil</li>
                    </ul>
                </div>
            </section>

            {/* TARGET USERS */}
            <section className='space-y-8'>
                <div className='space-y-2 text-center'>
                    <h2 className='text-foreground text-3xl font-semibold'>Cocok untuk siapa?</h2>
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                    {['Pemula Linux', 'Mahasiswa IT', 'Developer'].map((item) => (
                        <div
                            key={item}
                            className='bg-background border-stroke rounded-xl border p-6 text-center'
                        >
                            <p className='text-foreground font-medium'>{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className='space-y-8'>
                <div className='space-y-2 text-center'>
                    <h2 className='text-foreground text-3xl font-semibold'>
                        Pertanyaan yang Sering Diajukan
                    </h2>
                    <p className='text-foreground/70 text-sm'>
                        Penjelasan singkat tentang metodologi Distromatch
                    </p>
                </div>

                <Accordion type='single' collapsible className='mx-auto w-full max-w-4xl'>
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>Apa itu Distromatch?</AccordionTrigger>
                        <AccordionContent>
                            Distromatch adalah platform rekomendasi distro berbasis sistem pendukung
                            keputusan (SPK) yang transparan dan terukur.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-2'>
                        <AccordionTrigger>Kenapa pakai TOPSIS & Bayesian?</AccordionTrigger>
                        <AccordionContent>
                            TOPSIS menentukan kedekatan ke solusi ideal, sedangkan Bayesian
                            shrinkage menstabilkan skor saat data terbatas.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-3'>
                        <AccordionTrigger>Bagaimana penalti level bekerja?</AccordionTrigger>
                        <AccordionContent>
                            Penalti simetris mengurangi skor jika level distro terlalu jauh dari
                            preferensimu, menjaga rekomendasi tetap relevan.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-4'>
                        <AccordionTrigger>Apakah hasilnya bisa dijelaskan?</AccordionTrigger>
                        <AccordionContent>
                            Ya, setiap skor bisa dilacak dari survei sampai utility akhir.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-5'>
                        <AccordionTrigger>Apakah Distromatch gratis?</AccordionTrigger>
                        <AccordionContent>
                            Ya, saat ini Distromatch dapat digunakan gratis oleh semua pengguna.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* CTA */}
            <section className='bg-primary/10 border-stroke space-y-6 rounded-2xl border p-10 text-center'>
                <h2 className='text-foreground text-3xl font-semibold'>
                    Siap menemukan distro Linux terbaikmu?
                </h2>

                <p className='text-foreground/80'>
                    Mulai sekarang dan dapatkan rekomendasi berbasis perhitungan dalam hitungan
                    menit.
                </p>

                <Link href='/quiz'>
                    <Button size='lg'>Mulai Quiz Sekarang</Button>
                </Link>
            </section>
        </main>
    );
}
