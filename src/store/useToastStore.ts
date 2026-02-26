import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'confirm';

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
    onConfirm?: () => void;
}

interface ToastState {
    toasts: ToastMessage[];
    addToast: (message: string, type: ToastType) => void;
    addConfirm: (message: string, onConfirm: () => void) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (message, type) => {
        const id = crypto.randomUUID();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        // Auto-dismiss after 4 seconds for non-confirms
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
        }, 4000);
    },
    addConfirm: (message, onConfirm) => {
        const id = crypto.randomUUID();
        set((state) => ({ toasts: [...state.toasts, { id, message, type: 'confirm', onConfirm }] }));
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }))
}));
