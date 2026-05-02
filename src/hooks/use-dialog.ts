import { useDialogStore, DialogType } from '@/stores/dialog-store';

export function useDialog(dialog: DialogType) {
    const { open, close, closeAll, isOpen } = useDialogStore();

    return {
        open: () => open(dialog),
        close,
        closeAll,
        isOpen: isOpen(dialog),
    };
}
