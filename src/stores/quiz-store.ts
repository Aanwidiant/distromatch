import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuizAnswers = {
    q1_ux?: number;
    q2_ux?: number;
    q3_performance?: number;
    q4_performance?: number;
    q5_stability?: number;
    q6_stability?: number;
    q7_features?: number;
    q8_features?: number;
    q9_support?: number;
    q10_support?: number;
    q11_level_pref?: number;
    q12_level_pref?: number;
};

export const QUESTION_KEYS = [
    'q1_ux',
    'q2_ux',
    'q3_performance',
    'q4_performance',
    'q5_stability',
    'q6_stability',
    'q7_features',
    'q8_features',
    'q9_support',
    'q10_support',
    'q11_level_pref',
    'q12_level_pref',
] as const;

export type QuestionKey = (typeof QUESTION_KEYS)[number];

type QuizStore = {
    answers: QuizAnswers;
    currentStep: number; // 0-5 (6 categories)
    isSubmitting: boolean;
    authOpen: boolean;
    authMode: 'login' | 'register';
    authRedirectTo: string | null;
    setAnswer: (key: QuestionKey, value: number) => void;
    setStep: (step: number) => void;
    setSubmitting: (v: boolean) => void;
    setAuthOpen: (v: boolean) => void;
    setAuthMode: (v: 'login' | 'register') => void;
    setAuthRedirectTo: (v: string | null) => void;
    resetQuiz: () => void;
    isComplete: () => boolean;
    answeredCount: () => number;
};

export const useQuizStore = create<QuizStore>()(
    persist(
        (set, get) => ({
            answers: {},
            currentStep: 0,
            isSubmitting: false,
            authOpen: false,
            authMode: 'login',
            authRedirectTo: null,

            setAnswer: (key, value) =>
                set((state) => ({ answers: { ...state.answers, [key]: value } })),

            setStep: (step) => set({ currentStep: step }),

            setSubmitting: (v) => set({ isSubmitting: v }),

            setAuthOpen: (v) => set({ authOpen: v }),

            setAuthMode: (v) => set({ authMode: v }),

            setAuthRedirectTo: (v) => set({ authRedirectTo: v }),

            resetQuiz: () => set({ answers: {}, currentStep: 0, isSubmitting: false }),

            isComplete: () => {
                const { answers } = get();
                return QUESTION_KEYS.every((k) => answers[k] !== undefined);
            },

            answeredCount: () => {
                const { answers } = get();
                return QUESTION_KEYS.filter((k) => answers[k] !== undefined).length;
            },
        }),
        {
            name: 'linux-quiz-state', // localStorage key
            partialize: (state) => ({
                answers: state.answers,
                currentStep: state.currentStep,
            }),
        }
    )
);
