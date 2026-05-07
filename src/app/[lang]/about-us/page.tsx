import { ContactSection } from '@/components/globals/contact-section';

export default function AboutPage() {
    return (
        <main className='mx-auto space-y-24 p-6 md:flex-row md:px-12 lg:px-20 lg:py-12'>
            {/* 🔥 HERO */}
            <section className='grid gap-10 md:grid-cols-2 md:items-center'>
                <div className='space-y-6'>
                    <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                        Tentang <span className='text-primary'>Distromatch</span>
                    </h1>

                    <p className='text-muted-foreground leading-relaxed'>
                        Distromatch adalah platform berbasis{' '}
                        <strong>Sistem Pendukung Keputusan (SPK)</strong>
                        yang membantu pengguna menemukan distro Linux paling sesuai dengan kebutuhan
                        mereka.
                    </p>

                    <p className='text-muted-foreground leading-relaxed'>
                        Dengan pendekatan berbasis data dan metode perhitungan seperti
                        <strong> TOPSIS</strong>, <strong> Bayesian</strong>, dan{' '}
                        <strong> penalty-based ranking</strong>, Distromatch memberikan rekomendasi
                        yang lebih objektif dibanding sekadar opini subjektif.
                    </p>
                </div>

                {/* 🎨 IMAGE PLACEHOLDER */}
                <div className='bg-primary/20 h-75 w-full rounded-2xl'>
                    {/* TODO: ganti dengan ilustrasi / hero image */}
                </div>
            </section>

            {/* 🚀 WHAT IT DOES */}
            <section className='space-y-6'>
                <h2 className='text-2xl font-semibold'>Apa yang dilakukan Distromatch?</h2>

                <div className='grid gap-6 md:grid-cols-3'>
                    {[
                        {
                            title: 'Quiz Interaktif',
                            desc: 'Menjawab pertanyaan sederhana untuk memahami kebutuhan dan preferensi pengguna.',
                        },
                        {
                            title: 'Analisis Data',
                            desc: 'Mengolah jawaban menggunakan metode SPK untuk menghasilkan skor objektif.',
                        },
                        {
                            title: 'Rekomendasi Distro',
                            desc: 'Menampilkan distro Linux terbaik lengkap dengan ranking dan detailnya.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className='bg-background space-y-3 rounded-xl border p-5 shadow-sm'
                        >
                            <h3 className='font-semibold'>{item.title}</h3>
                            <p className='text-muted-foreground text-sm'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🧠 HOW IT WORKS */}
            <section className='space-y-6'>
                <h2 className='text-2xl font-semibold'>Bagaimana cara kerjanya?</h2>

                <div className='text-muted-foreground space-y-4 leading-relaxed'>
                    <p>
                        Distromatch menggunakan pendekatan multi-metode untuk memastikan hasil yang
                        akurat:
                    </p>

                    <ul className='list-disc space-y-2 pl-5'>
                        <li>
                            <strong>Normalisasi Data</strong> untuk menyamakan skala antar kriteria.
                        </li>
                        <li>
                            <strong>Weighted Scoring</strong> berdasarkan preferensi pengguna.
                        </li>
                        <li>
                            <strong>TOPSIS</strong> untuk menentukan solusi terbaik dari alternatif.
                        </li>
                        <li>
                            <strong>Bayesian Calculation</strong> untuk memperkuat probabilitas
                            rekomendasi.
                        </li>
                        <li>
                            <strong>Penalty & Ranking</strong> untuk menghasilkan urutan akhir
                            distro.
                        </li>
                    </ul>
                </div>
            </section>

            {/* 🎯 WHY */}
            <section className='grid gap-10 md:grid-cols-2 md:items-center'>
                {/* 🎨 IMAGE PLACEHOLDER */}
                <div className='bg-primary/20 h-75 w-full rounded-2xl'>
                    {/* TODO: ganti dengan ilustrasi kedua */}
                </div>

                <div className='space-y-6'>
                    <h2 className='text-2xl font-semibold'>Kenapa Distromatch dibuat?</h2>

                    <p className='text-muted-foreground leading-relaxed'>
                        Banyak pengguna—terutama pemula—bingung memilih distro Linux karena terlalu
                        banyak pilihan dan informasi yang tersebar.
                    </p>

                    <p className='text-muted-foreground leading-relaxed'>
                        Distromatch hadir untuk menyederhanakan proses tersebut dengan pendekatan
                        berbasis data, sehingga pengguna bisa mengambil keputusan dengan lebih
                        percaya diri.
                    </p>
                </div>
            </section>

            {/* 📊 STATS / TRUST */}
            <section className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                {[
                    { value: '12', label: 'Pertanyaan Quiz' },
                    { value: '6', label: 'Kriteria Penilaian' },
                    { value: 'Multi', label: 'Metode SPK' },
                    { value: '100%', label: 'Data-driven' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className='bg-background space-y-2 rounded-xl border p-4 text-center'
                    >
                        <div className='text-xl font-bold'>{item.value}</div>
                        <div className='text-muted-foreground text-xs tracking-wide uppercase'>
                            {item.label}
                        </div>
                    </div>
                ))}
            </section>
            <ContactSection />
        </main>
    );
}
