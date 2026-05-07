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
        <main className='mx-auto space-y-24 p-6 md:flex-row md:px-12 lg:px-20 lg:py-12'>
            {/* 🔥 HERO */}
            <section className='grid gap-12 md:grid-cols-2 md:items-center'>
                <div className='space-y-6'>
                    <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                        Temukan distro Linux terbaik <span className='text-primary'>untukmu</span>
                    </h1>

                    <p className='text-muted-foreground text-lg leading-relaxed'>
                        Distromatch membantu kamu memilih distro Linux berdasarkan kebutuhan nyata
                        menggunakan metode <strong>data-driven</strong>, bukan sekadar opini.
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

                {/* 🎨 IMAGE PLACEHOLDER */}
                <div className='bg-primary/20 h-80 w-full rounded-2xl'>
                    {/* TODO: Hero illustration */}
                </div>
            </section>

            {/* 💡 VALUE PROPS */}
            <section className='grid gap-6 md:grid-cols-3'>
                {[
                    {
                        title: 'Data-Driven',
                        desc: 'Rekomendasi berdasarkan perhitungan SPK, bukan opini subjektif.',
                    },
                    {
                        title: 'Cepat & Mudah',
                        desc: 'Hanya butuh beberapa menit untuk mendapatkan hasil.',
                    },
                    {
                        title: 'Personalized',
                        desc: 'Disesuaikan dengan kebutuhan dan preferensi kamu.',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className='bg-background space-y-3 rounded-xl border p-6 shadow-sm'
                    >
                        <h3 className='font-semibold'>{item.title}</h3>
                        <p className='text-muted-foreground text-sm'>{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* 🧠 HOW IT WORKS */}
            <section className='space-y-10'>
                <div className='space-y-3 text-center'>
                    <h2 className='text-3xl font-semibold'>Bagaimana cara kerjanya?</h2>
                    <p className='text-muted-foreground'>
                        Proses sederhana dengan hasil yang powerful
                    </p>
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                    {[
                        {
                            step: '01',
                            title: 'Isi Quiz',
                            desc: 'Jawab pertanyaan tentang kebutuhan dan preferensimu.',
                        },
                        {
                            step: '02',
                            title: 'Analisis Sistem',
                            desc: 'Data diproses dengan metode SPK (TOPSIS & Bayesian).',
                        },
                        {
                            step: '03',
                            title: 'Dapatkan Hasil',
                            desc: 'Lihat distro terbaik lengkap dengan ranking.',
                        },
                    ].map((item) => (
                        <div key={item.step} className='space-y-3 rounded-xl border p-6'>
                            <div className='text-primary font-mono text-sm'>{item.step}</div>
                            <h3 className='font-semibold'>{item.title}</h3>
                            <p className='text-muted-foreground text-sm'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 📊 PREVIEW RESULT */}
            <section className='grid gap-12 md:grid-cols-2 md:items-center'>
                {/* 🎨 IMAGE PLACEHOLDER */}
                <div className='bg-primary/20 h-75 w-full rounded-2xl'>
                    {/* TODO: Screenshot hasil rekomendasi */}
                </div>

                <div className='space-y-6'>
                    <h2 className='text-3xl font-semibold'>Rekomendasi yang bisa kamu percaya</h2>

                    <p className='text-muted-foreground leading-relaxed'>
                        Distromatch tidak hanya memberikan satu pilihan, tetapi beberapa alternatif
                        distro dengan ranking yang jelas dan transparan.
                    </p>

                    <ul className='text-muted-foreground space-y-2 text-sm'>
                        <li>✔️ Ranking distro berdasarkan skor</li>
                        <li>✔️ Detail perhitungan lengkap</li>
                        <li>✔️ Insight dari setiap kriteria</li>
                    </ul>
                </div>
            </section>

            {/* 🎯 TARGET USERS */}
            <section className='space-y-8'>
                <div className='space-y-2 text-center'>
                    <h2 className='text-3xl font-semibold'>Cocok untuk siapa?</h2>
                </div>

                <div className='grid gap-6 md:grid-cols-3'>
                    {['Pemula Linux', 'Mahasiswa IT', 'Developer'].map((item) => (
                        <div key={item} className='rounded-xl border p-6 text-center'>
                            <p className='font-medium'>{item}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className='space-y-8'>
                <div className='space-y-2 text-center'>
                    <h2 className='text-3xl font-semibold'>Pertanyaan yang Sering Diajukan</h2>
                    <p className='text-muted-foreground text-sm'>
                        Beberapa hal yang mungkin ingin kamu ketahui
                    </p>
                </div>

                <Accordion type='single' collapsible className='mx-auto w-full max-w-4xl'>
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>Apa itu Distromatch?</AccordionTrigger>
                        <AccordionContent>
                            Distromatch adalah platform yang membantu kamu memilih distro Linux
                            terbaik berdasarkan kebutuhan menggunakan metode Sistem Pendukung
                            Keputusan (SPK).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-2'>
                        <AccordionTrigger>Apakah hasil rekomendasinya akurat?</AccordionTrigger>
                        <AccordionContent>
                            Hasil rekomendasi dihitung menggunakan metode seperti TOPSIS dan
                            Bayesian, sehingga lebih objektif dibanding sekadar opini atau
                            rekomendasi subjektif.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-3'>
                        <AccordionTrigger>Berapa lama waktu yang dibutuhkan?</AccordionTrigger>
                        <AccordionContent>
                            Hanya sekitar 2–3 menit untuk menjawab quiz dan mendapatkan hasil
                            rekomendasi.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-4'>
                        <AccordionTrigger>Apakah saya harus login?</AccordionTrigger>
                        <AccordionContent>
                            Ya, login diperlukan agar hasil quiz kamu bisa disimpan dan dilihat
                            kembali kapan saja.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-5'>
                        <AccordionTrigger>Apakah Distromatch gratis?</AccordionTrigger>
                        <AccordionContent>
                            Ya, Distromatch saat ini dapat digunakan secara gratis untuk semua
                            pengguna.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            {/* 🚀 CTA */}
            <section className='bg-primary/10 space-y-6 rounded-2xl p-10 text-center'>
                <h2 className='text-3xl font-semibold'>Siap menemukan distro Linux terbaikmu?</h2>

                <p className='text-muted-foreground'>
                    Mulai sekarang dan dapatkan rekomendasi dalam hitungan menit.
                </p>

                <Link href='/quiz'>
                    <Button size='lg'>Mulai Quiz Sekarang</Button>
                </Link>
            </section>
        </main>
    );
}
