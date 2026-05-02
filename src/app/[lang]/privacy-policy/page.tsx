import { Info } from 'lucide-react';

type Section = {
    id: string;
    title: string;
    items?: string[];
    paragraph?: string;
};

const sections: Section[] = [
    {
        id: 'data-yang-kami-kumpulkan',
        title: '1. Data yang Kami Kumpulkan',
        items: [
            'Nama dan alamat email yang Anda masukkan saat pendaftaran.',
            'Nama dan email dari akun Google Anda jika menggunakan Login Google.',
            'Hasil kuis dan data perhitungan terkait kuis di distromatch.',
        ],
    },
    {
        id: 'cara-kami-mengumpulkan-data',
        title: '2. Cara Kami Mengumpulkan Data',
        items: [
            'Melalui formulir pendaftaran dengan validasi email (link verifikasi dikirim ke email).',
            'Melalui integrasi login Google.',
            'Dari mengikuti kuis yang tersedia di situs.',
        ],
    },
    {
        id: 'penggunaan-data',
        title: '3. Penggunaan Data',
        items: [
            'Data nama dan email digunakan untuk keperluan pendaftaran, login, dan identifikasi pengguna yang sah.',
            'Hasil kuis disimpan untuk audit sistem, analisis internal, dan dapat dibagikan secara publik (hanya hasil akhir, tanpa detail perhitungan, jika pengguna membagikan link hasil kuis).',
            'Informasi hasil kuis yang lebih rinci hanya dapat dilihat oleh user bersangkutan dan admin distromatch.',
        ],
    },
    {
        id: 'cookies-dan-tracking',
        title: '4. Cookies dan Tracking',
        items: [
            'Distromatch hanya menggunakan cookie untuk keperluan refresh token autentikasi.',
            'Tidak ada cookies pihak ketiga, pelacakan, atau analitik lain yang digunakan.',
        ],
    },
    {
        id: 'data-pengguna-yang-dibagikan',
        title: '5. Pembagian dan Retensi Data',
        items: [
            'Kami tidak membagikan data pengguna kepada pihak ketiga, partner, maupun untuk tujuan periklanan.',
            'Seluruh data digunakan secara eksklusif untuk keperluan internal dalam rangka penelitian dan pengembangan sistem.',
            'Kami menyimpan data selama akun Anda aktif atau selama diperlukan untuk tujuan layanan dan penelitian.',
        ],
    },
    {
        id: 'keamanan-data',
        title: '6. Keamanan Data',
        items: [
            'Kami berupaya menjaga kerahasiaan data pengguna dan menerapkan langkah keamanan yang wajar, namun tidak dapat menjamin keamanan mutlak data Anda di internet.',
        ],
    },
    {
        id: 'hak-pengguna',
        title: '7. Hak Pengguna',
        items: [
            'Pengguna dapat mengakses, memperbarui, atau menghapus data pribadinya dengan menggunakan fitur yang telah disediakan.',
        ],
    },
    {
        id: 'wilayah-layanan',
        title: '8. Wilayah Layanan',
        items: [
            'Website ini tersedia untuk pengguna di seluruh dunia dan mendukung bahasa Indonesia serta Inggris.',
        ],
    },
    {
        id: 'kontak',
        title: '9. Kontak',
        paragraph:
            'Jika ada pertanyaan terkait privasi, silakan hubungi kami melalui email yang tersedia di bagian bawah situs atau melalui form pesan di halaman about.',
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className='space-y-16 p-6 md:px-12 lg:px-24 lg:py-12'>
            <div className='mx-auto flex w-full max-w-7xl flex-col justify-center gap-8 md:gap-10 lg:gap-12'>
                <h1 className='block py-8 text-center text-3xl font-bold lg:text-5xl'>
                    Kebijakan Privasi
                </h1>
                <p className='mx-auto w-full text-justify md:w-2/3 md:text-center'>
                    Kami berkomitmen melindungi privasi Anda. Halaman ini menjelaskan bagaimana
                    distromatch mengumpulkan, menggunakan, dan melindungi informasi Anda.
                </p>
                <div className='flex flex-col gap-8 md:flex-row'>
                    <aside className='md:w-1/4'>
                        <div className='bg-bg-2 flex flex-col gap-3 overflow-auto rounded-lg p-4 md:sticky md:top-24 md:max-h-[calc(100vh-6rem)]'>
                            <span className='text-sm font-semibold'>Daftar Isi</span>
                            <ol className='text-grey-3 list-outside list-decimal space-y-2 pl-6 text-sm'>
                                {sections.map((section) => (
                                    <li key={section.id} className='pl-2'>
                                        <a
                                            className='hover:text-primary transition-colors'
                                            href={`#${section.id}`}
                                        >
                                            {section.title.replace(/^\d+\.\s*/, '')}
                                        </a>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>
                    <div className='flex max-w-none flex-col gap-4 md:w-2/3 md:gap-5 lg:gap-6'>
                        {sections.map((section) => (
                            <div key={section.id} className='flex flex-col gap-3'>
                                <h2
                                    id={section.id}
                                    className='block scroll-mt-24 text-xl font-semibold lg:text-2xl'
                                >
                                    {section.title}
                                </h2>
                                {section.items ? (
                                    <ul className='list-outside list-disc space-y-2 pl-12'>
                                        {section.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className='text-justify'>{section.paragraph}</p>
                                )}
                            </div>
                        ))}
                        <div className='flex items-center gap-3 rounded-md border p-3'>
                            <Info className='size-8 shrink-0' />
                            <p className='text-justify'>
                                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Periksa
                                halaman ini secara berkala untuk mengetahui perubahan terbaru.
                                Dengan terus menggunakan layanan distromatch, Anda menyetujui
                                kebijakan yang berlaku.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
