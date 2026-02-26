import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, type ToastMessage } from '../store/useToastStore';
import { Info, CheckCircle2, AlertTriangle, HelpCircle, X } from 'lucide-react';

const ToastItem = ({ toast }: { toast: ToastMessage }) => {
    const removeToast = useToastStore(state => state.removeToast);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-sage-dark" />,
        error: <AlertTriangle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        confirm: <HelpCircle className="w-5 h-5 text-crust" />
    };

    const isConfirm = toast.type === 'confirm';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-journal-card p-4 sm:px-6 sm:py-4 rounded-2xl shadow-toast border border-journal-border/50 max-w-sm w-full`}
        >
            <div className="flex-shrink-0 mt-1 sm:mt-0">{icons[toast.type]}</div>
            <div className="flex-grow font-serif text-ink-main dark:text-[#E8E6E1] text-sm sm:text-base pr-4">
                {toast.message}
            </div>

            {isConfirm ? (
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="px-4 py-2 rounded-xl text-ink-muted text-sm font-sans uppercase tracking-wider font-bold hover:bg-journal-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (toast.onConfirm) toast.onConfirm();
                            removeToast(toast.id);
                        }}
                        className="px-4 py-2 rounded-xl bg-crust text-white text-sm font-sans uppercase tracking-wider font-bold shadow-sm hover:scale-105 transition-all"
                    >
                        Confirm
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => removeToast(toast.id)}
                    className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1 text-ink-faint hover:text-ink-main transition-colors focus:outline-none"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    );
};

export const ToastContainer = () => {
    const toasts = useToastStore(state => state.toasts);

    return (
        <div className="fixed top-4 left-0 right-0 z-[999] flex flex-col items-center gap-3 pointer-events-none px-4">
            <AnimatePresence>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};
