export default function WhySection() {
    return (
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
                    Banyak pengguna, terutama pemula, bingung memilih distro Linux karena pilihan
                    yang sangat banyak dan informasi yang tersebar.
                </p>

                <p className='text-foreground/80 leading-relaxed'>
                    Distromatch membantu merapikan proses ini dengan sistem berbasis data yang
                    transparan, sehingga keputusan bisa dibuat dengan lebih jelas dan percaya diri.
                </p>
            </div>
        </section>
    );
}
