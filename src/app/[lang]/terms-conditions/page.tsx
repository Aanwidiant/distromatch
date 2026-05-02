import { Info } from 'lucide-react';

type Section = {
    id: string;
    title: string;
    items?: string[];
    paragraph?: string;
};

const sections: Section[] = [
    {
        id: 'tentang-distromatch',
        title: '1. Tentang Distromatch',
        paragraph:
            'Distromatch adalah website yang memberikan rekomendasi distribusi Linux berdasarkan hasil kuis dan menampilkan daftar informasi distro Linux.',
    },
    {
        id: 'pemilik-dan-pengelola',
        title: '2. Pemilik dan Pengelola',
        paragraph:
            'Website ini dimiliki dan dikelola oleh Aan Widianto, mahasiswa yang sedang melakukan penelitian DSS (Decision Support System) untuk keperluan pendidikan.',
    },
    {
        id: 'layanan-yang-tersedia',
        title: '3. Layanan yang Tersedia',
        items: [
            'Pengguna dapat mengikuti kuis untuk menentukan distro Linux yang cocok berdasarkan kebutuhan.',
            'Hasil kuis berupa rekomendasi dan link ke homepage serta dokumentasi resmi dari distro terkait.',
            'Daftar distro, rekomendasi, dan hasil kuis hanya untuk tujuan edukasi.',
        ],
    },
    {
        id: 'batasan-usia',
        title: '4. Batasan Usia',
        paragraph:
            'Tidak ada batas minimum usia penggunaan, namun layanan ini ditujukan bagi pengguna yang memahami sistem operasi Linux.',
    },
    {
        id: 'hak-kekayaan-intelektual',
        title: '5. Hak Kekayaan Intelektual',
        items: [
            'Data dan informasi distro diperoleh dari website distrowiz (dengan izin) dan distrowatch (dalam proses perizinan).',
            'Sistem perhitungan DSS merupakan hasil pengembangan dan tuning secara pribadi oleh pengelola sesuai best practice.',
            'Dilarang menggunakan kembali konten, data, atau sistem distromatch tanpa izin tertulis dari pengelola.',
        ],
    },
    {
        id: 'larangan-penggunaan',
        title: '6. Larangan Penggunaan',
        items: [
            'Dilarang melakukan spam pendaftaran atau percobaan untuk mengelabui sistem keamanan website.',
            'Dilarang menggunakan layanan untuk tujuan yang bertentangan dengan hukum atau norma yang berlaku.',
        ],
    },
    {
        id: 'konten-yang-dibagikan',
        title: '7. Konten yang Dibagikan',
        items: [
            'Pengguna dapat membagikan hasil kuis melalui link yang disediakan.',
            'Distromatch tidak bertanggung jawab atas penggunaan atau persebaran hasil kuis yang dibagikan secara publik oleh pengguna.',
        ],
    },
    {
        id: 'batasan-tanggung-jawab',
        title: '8. Batasan Tanggung Jawab',
        items: [
            'Distromatch hanya memberikan rekomendasi, tidak menyediakan file installer atau berkas unduhan distro Linux apapun.',
            'Kami tidak bertanggung jawab atas tindakan yang diambil berdasarkan hasil rekomendasi atau informasi pada situs ini.',
        ],
    },
    {
        id: 'penyelesaian-sengketa-dan-kontak',
        title: '9. Penyelesaian Sengketa dan Kontak',
        items: [
            'Jika ada pertanyaan, keluhan, atau sengketa terkait layanan, Anda dapat menghubungi email yang tercantum di footer website atau mengisi form pesan yang tersedia di halaman about.',
            'Setiap permasalahan akan diupayakan diselesaikan secara musyawarah demi mendapatkan solusi terbaik.',
        ],
    },
    {
        id: 'perubahan-syarat-dan-ketentuan',
        title: '10. Perubahan Syarat dan Ketentuan',
        paragraph:
            'Kami dapat mengubah Syarat dan Ketentuan sewaktu-waktu. Periksa halaman ini secara berkala untuk mengetahui ketentuan terbaru.',
    },
];

export default function TermsConditionsPage() {
    return (
        <main className='space-y-16 p-6 md:px-12 lg:px-24 lg:py-12'>
            <div className='mx-auto flex w-full max-w-7xl flex-col justify-center gap-8 md:gap-10 lg:gap-12'>
                <h1 className='block py-8 text-center text-3xl font-bold lg:text-5xl'>
                    Syarat dan Ketentuan
                </h1>
                <p className='mx-auto w-full text-justify md:w-2/3 md:text-center'>
                    Selamat datang di distromatch (“kami”, “website”). Dengan mengakses atau
                    menggunakan layanan kami, Anda menyetujui Syarat dan Ketentuan berikut:
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
                                Dengan menggunakan distromatch, Anda dianggap telah membaca dan
                                menyetujui seluruh Syarat & Ketentuan ini.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
