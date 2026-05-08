import { ContactSection } from '@/components/globals/contact-section';

export default function AboutPage() {
    return (
        <main className='space-y-24 md:flex-row'>
            <section className='grid gap-10 md:grid-cols-2 md:items-center'>
                <div className='space-y-6'>
                    <span className='bg-accent-1 text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                        Metodologi SPK • Transparan & Terukur
                    </span>

                    <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                        Tentang <span className='text-primary'>Distromatch</span>
                    </h1>

                    <p className='text-foreground/80 leading-relaxed'>
                        Distromatch adalah platform berbasis{' '}
                        <strong>Sistem Pendukung Keputusan (SPK)</strong>
                        yang membantu pengguna menemukan distro Linux paling sesuai lewat proses
                        perhitungan yang bisa dijelaskan.
                    </p>

                    <p className='text-foreground/80 leading-relaxed'>
                        Kami menggunakan kombinasi <strong>TOPSIS</strong>,{' '}
                        <strong>Bayesian shrinkage</strong>, dan{' '}
                        <strong>penalty-based ranking</strong> agar rekomendasi tetap objektif,
                        stabil, dan relevan dengan preferensi pengguna.
                    </p>
                </div>

                <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Ilustrasi proses perhitungan
                    </div>
                </div>
            </section>

            {/* 🚀 WHAT IT DOES */}
            <section className='space-y-6'>
                <h2 className='text-foreground text-2xl font-semibold'>
                    Apa yang dilakukan Distromatch?
                </h2>

                <div className='grid gap-6 md:grid-cols-3'>
                    {[
                        {
                            title: 'Survey Kebutuhan',
                            desc: 'Mengubah jawaban pengguna menjadi skor per dimensi kebutuhan.',
                        },
                        {
                            title: 'Analisis SPK',
                            desc: 'Mengolah data dengan pembobotan, TOPSIS, dan Bayesian.',
                        },
                        {
                            title: 'Ranking Transparan',
                            desc: 'Menampilkan skor utility dan urutan distro yang jelas.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className='bg-background border-stroke space-y-3 rounded-xl border p-5 shadow-sm'
                        >
                            <h3 className='text-secondary font-semibold'>{item.title}</h3>
                            <p className='text-foreground/80 text-sm'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🧠 HOW IT WORKS */}
            <section className='space-y-6'>
                <h2 className='text-foreground text-2xl font-semibold'>
                    Langkah-langkah perhitungan
                </h2>

                <div className='grid gap-6 md:grid-cols-3'>
                    {[
                        {
                            step: '01',
                            title: 'Survey & Bobot',
                            desc: 'Nilai per dimensi dihitung dan dibobotkan sesuai preferensi.',
                        },
                        {
                            step: '02',
                            title: 'Normalisasi & TOPSIS',
                            desc: 'Matriks ternormalisasi, solusi ideal, dan closeness coefficient.',
                        },
                        {
                            step: '03',
                            title: 'Bayesian Shrinkage',
                            desc: 'Menstabilkan skor jika data review terbatas.',
                        },
                        {
                            step: '04',
                            title: 'Penalti Simetris',
                            desc: 'Mengurangi skor bila level distro terlalu jauh dari preferensi.',
                        },
                        {
                            step: '05',
                            title: 'Utility & Ranking',
                            desc: 'Skor final (0–1) lalu diurutkan dengan tie-breaker review.',
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            className='bg-bg-2 border-stroke space-y-3 rounded-xl border p-5'
                        >
                            <div className='text-primary font-mono text-sm'>{item.step}</div>
                            <h3 className='text-foreground font-semibold'>{item.title}</h3>
                            <p className='text-foreground/80 text-sm'>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🎯 WHY */}
            <section className='grid gap-10 md:grid-cols-2 md:items-center'>
                <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                    <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                        Ilustrasi manfaat
                    </div>
                </div>

                <div className='space-y-6'>
                    <h2 className='text-foreground text-2xl font-semibold'>
                        Kenapa Distromatch dibuat?
                    </h2>

                    <p className='text-foreground/80 leading-relaxed'>
                        Banyak pengguna—terutama pemula—bingung memilih distro Linux karena terlalu
                        banyak pilihan dan informasi yang tersebar.
                    </p>

                    <p className='text-foreground/80 leading-relaxed'>
                        Distromatch menyederhanakan proses tersebut lewat sistem berbasis data,
                        sehingga keputusan bisa dibuat dengan lebih percaya diri.
                    </p>
                </div>
            </section>

            {/* 📊 STATS / TRUST */}
            <section className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                {[
                    { value: '12', label: 'Pertanyaan Quiz' },
                    { value: '6', label: 'Dimensi Penilaian' },
                    { value: 'Multi', label: 'Metode SPK' },
                    { value: '100%', label: 'Data-driven' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className='bg-background border-stroke space-y-2 rounded-xl border p-4 text-center'
                    >
                        <div className='text-foreground text-xl font-bold'>{item.value}</div>
                        <div className='text-foreground/70 text-xs tracking-wide uppercase'>
                            {item.label}
                        </div>
                    </div>
                ))}
            </section>

            <ContactSection />
        </main>
    );
}
