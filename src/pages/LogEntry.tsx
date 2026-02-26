import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoafForm } from '../components/LoafForm';

export const LogEntry = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { editId?: string, iterateId?: string, initialData?: any } | null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
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
