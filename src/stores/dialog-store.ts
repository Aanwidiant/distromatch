import { create } from 'zustand';

export type DialogType =
    | 'profile'
    | 'deleteAccount'
    | 'changePassword'
    | 'changeEmail'
    | 'deletePhoto'
    | 'changePhoto'
    | null;

type DialogState = {
    stack: DialogType[];

    open: (dialog: DialogType) => void;
    close: () => void;
    closeAll: () => void;

    isOpen: (dialog: DialogType) => boolean;
};

export const useDialogStore = create<DialogState>((set, get) => ({
    stack: [],

    open: (dialog) => {
        set((state) => ({
            stack: [...state.stack, dialog],
        }));
    },

    close: () => {
        set((state) => ({
            stack: state.stack.slice(0, -1),
        }));
    },

    closeAll: () => {
        set({ stack: [] });
    },

    isOpen: (dialog) => {
        const stack = get().stack;
        return stack[stack.length - 1] === dialog;
    },
}));
