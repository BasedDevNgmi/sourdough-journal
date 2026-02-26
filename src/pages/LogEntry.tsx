import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoafForm } from '../components/LoafForm';

const pageTransition = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, filter: 'blur(10px)' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

export const LogEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { editId?: string, iterateId?: string, initialData?: any } | null;

    return (
        <motion.div
            {...pageTransition}
            className="w-full"
        >
            <div className="border-b border-ink-main/20 pb-8 mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-5xl sm:text-6xl font-serif font-bold text-ink-main tracking-tighter mb-4">
                        {state?.editId ? 'Edit Entry' : state?.iterateId ? 'Iterate Recipe' : 'New Entry'}
                    </h2>
                    <p className="text-ink-muted text-xl font-serif italic">
                        {state?.editId ? 'Refine the record.' : state?.iterateId ? 'A new iteration of a proven formula.' : 'Document the ritual.'}
                    </p>
                </div>
            </div>

            <LoafForm
                onComplete={() => navigate('/')}
                initialData={state?.initialData}
                editId={state?.editId}
            />
        </motion.div>
    );
};
