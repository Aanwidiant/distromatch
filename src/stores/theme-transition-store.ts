import { create } from 'zustand';

type ThemeTransitionState = {
    isThemeAnimating: boolean;
    toDark: boolean | null;
};

type ThemeTransitionActions = {
    startThemeTransition: (toDark: boolean) => void;
    endThemeTransition: () => void;
};

export type ThemeTransitionStore = ThemeTransitionState & ThemeTransitionActions;

export const useThemeTransitionStore = create<ThemeTransitionStore>((set) => ({
    isThemeAnimating: false,
    toDark: null,

    startThemeTransition: (toDark) =>
        set({
            isThemeAnimating: true,
            toDark,
        }),

    endThemeTransition: () =>
        set({
            isThemeAnimating: false,
            toDark: null,
        }),
}));
