export default function HeroSection() {
    return (
        <section className='grid gap-12 md:grid-cols-2 md:items-center'>
            <div className='space-y-6'>
                <span className='bg-accent-1 text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold'>
                    Sistem Pendukung Keputusan • Transparan dan Terukur
                </span>

                <h1 className='text-4xl leading-tight font-bold md:text-5xl'>
                    Tentang <span className='text-primary'>Distromatch</span>
                </h1>

                <div className='space-y-4'>
                    <p className='text-foreground/80 leading-relaxed'>
                        Distromatch adalah platform berbasis{' '}
                        <strong>Sistem Pendukung Keputusan (SPK)</strong>
                        yang membantu pengguna menemukan distro Linux paling sesuai melalui proses
                        perhitungan yang transparan dan mudah dipahami.
                    </p>

                    <p className='text-foreground/80 leading-relaxed'>
                        Sistem ini menggabungkan <strong>TOPSIS</strong>,{' '}
                        <strong>Bayesian shrinkage</strong>, dan{' '}
                        <strong>penalty-based ranking</strong> agar rekomendasi tetap objektif,
                        stabil, dan relevan dengan preferensi pengguna.
                    </p>
                </div>
            </div>

            <div className='bg-primary/10 border-stroke h-75 w-full rounded-2xl border p-6'>
                <div className='bg-accent-2/50 text-secondary flex h-full items-center justify-center rounded-xl text-sm font-medium'>
                    Ilustrasi proses perhitungan
                </div>
            </div>
        </section>
    );
}
