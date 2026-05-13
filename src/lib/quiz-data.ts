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

type QuizCategoryConfig = {
    id: number;
    key:
        | 'userExperience'
        | 'performance'
        | 'stability'
        | 'features'
        | 'support'
        | 'targetUserLevel';
    questions: { key: QuestionKey; tKey: string }[];
};

const QUIZ_CATEGORY_CONFIG: QuizCategoryConfig[] = [
    {
        id: 1,
        key: 'userExperience',
        questions: [
            { key: 'q1_ux', tKey: 'quizData.categories.userExperience.questions.q1' },
            { key: 'q2_ux', tKey: 'quizData.categories.userExperience.questions.q2' },
        ],
    },
    {
        id: 2,
        key: 'performance',
        questions: [
            { key: 'q3_performance', tKey: 'quizData.categories.performance.questions.q1' },
            { key: 'q4_performance', tKey: 'quizData.categories.performance.questions.q2' },
        ],
    },
    {
        id: 3,
        key: 'stability',
        questions: [
            { key: 'q5_stability', tKey: 'quizData.categories.stability.questions.q1' },
            { key: 'q6_stability', tKey: 'quizData.categories.stability.questions.q2' },
        ],
    },
    {
        id: 4,
        key: 'features',
        questions: [
            { key: 'q7_features', tKey: 'quizData.categories.features.questions.q1' },
            { key: 'q8_features', tKey: 'quizData.categories.features.questions.q2' },
        ],
    },
    {
        id: 5,
        key: 'support',
        questions: [
            { key: 'q9_support', tKey: 'quizData.categories.support.questions.q1' },
            { key: 'q10_support', tKey: 'quizData.categories.support.questions.q2' },
        ],
    },
    {
        id: 6,
        key: 'targetUserLevel',
        questions: [
            { key: 'q11_level_pref', tKey: 'quizData.categories.targetUserLevel.questions.q1' },
            { key: 'q12_level_pref', tKey: 'quizData.categories.targetUserLevel.questions.q2' },
        ],
    },
];

export const buildQuizData = (t: (key: string) => string) => {
    const categories: Category[] = QUIZ_CATEGORY_CONFIG.map((cat) => {
        const baseKey = `quizData.categories.${cat.key}`;
        return {
            id: cat.id,
            title: t(`${baseKey}.title`),
            subtitle: t(`${baseKey}.subtitle`),
            questions: cat.questions.map((q) => ({ key: q.key, text: t(q.tKey) })),
        };
    });

    const answerOptions = [
        { value: 1, label: t('quizData.answerOptions.1') },
        { value: 2, label: t('quizData.answerOptions.2') },
        { value: 3, label: t('quizData.answerOptions.3') },
        { value: 4, label: t('quizData.answerOptions.4') },
        { value: 5, label: t('quizData.answerOptions.5') },
    ] as const;

    return { categories, answerOptions };
};

export const TOTAL_QUESTIONS = QUIZ_CATEGORY_CONFIG.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);
