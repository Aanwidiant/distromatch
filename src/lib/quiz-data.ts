import { QuestionKey } from '@/stores/quiz-store';

export type Question = {
    key: QuestionKey;
    text: string;
};

export type Category = {
    id: number;
    title: string;
    subtitle: string;
    questions: Question[];
};

export const ANSWER_OPTIONS = [
    { value: 1, label: 'Tidak penting' },
    { value: 2, label: 'Kurang penting' },
    { value: 3, label: 'Cukup penting' },
    { value: 4, label: 'Penting' },
    { value: 5, label: 'Sangat penting' },
] as const;

export const CATEGORIES: Category[] = [
    {
        id: 1,
        title: 'User Experience',
        subtitle: 'Kemudahan penggunaan sehari-hari',
        questions: [
            {
                key: 'q1_ux',
                text: 'Seberapa penting antarmuka yang mudah dipahami untuk pemakaian harian?',
            },
            {
                key: 'q2_ux',
                text: 'Seberapa penting proses instalasi dan konfigurasi awal yang mudah?',
            },
        ],
    },
    {
        id: 2,
        title: 'Performance',
        subtitle: 'Kecepatan dan efisiensi sistem',
        questions: [
            {
                key: 'q3_performance',
                text: 'Seberapa penting sistem terasa cepat/responsif saat dipakai?',
            },
            {
                key: 'q4_performance',
                text: 'Seberapa penting penggunaan resource (RAM/CPU) yang efisien (ringan)?',
            },
        ],
    },
    {
        id: 3,
        title: 'Stability',
        subtitle: 'Keandalan dan keamanan update',
        questions: [
            {
                key: 'q5_stability',
                text: 'Seberapa penting kestabilan (minim crash/bug) saat digunakan?',
            },
            {
                key: 'q6_stability',
                text: 'Seberapa penting update yang aman dan tidak sering menyebabkan masalah?',
            },
        ],
    },
    {
        id: 4,
        title: 'Features',
        subtitle: 'Kelengkapan fitur dan software',
        questions: [
            {
                key: 'q7_features',
                text: 'Seberapa penting ketersediaan fitur bawaan/aplikasi dasar yang lengkap?',
            },
            {
                key: 'q8_features',
                text: 'Seberapa penting kemudahan menambah aplikasi/software sesuai kebutuhan (repositori/package manager)?',
            },
        ],
    },
    {
        id: 5,
        title: 'Support',
        subtitle: 'Komunitas dan dokumentasi',
        questions: [
            {
                key: 'q9_support',
                text: 'Seberapa penting dukungan komunitas dan dokumentasi yang banyak?',
            },
            {
                key: 'q10_support',
                text: 'Seberapa penting kemudahan mencari solusi saat ada error (tutorial, forum, Q&A)?',
            },
        ],
    },
    {
        id: 6,
        title: 'Target User Level',
        subtitle: 'Kesesuaian untuk tingkat penggunaan',
        questions: [
            {
                key: 'q11_level_pref',
                text: 'Seberapa penting distro yang ramah pemula (minim perintah terminal)?',
            },
            {
                key: 'q12_level_pref',
                text: "Seberapa penting sistem yang 'langsung bisa dipakai' tanpa banyak tweak/oprek?",
            },
        ],
    },
];

export const TOTAL_QUESTIONS = CATEGORIES.reduce((acc, cat) => acc + cat.questions.length, 0);
