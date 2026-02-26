import { motion } from 'framer-motion';

export const LoafCardSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group block bg-white dark:bg-journal-card rounded-3xl overflow-hidden shadow-subtle border border-journal-border hover:shadow-hover transition-all duration-500 hover:-translate-y-1 relative"
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-journal-bg/50 animate-pulse">
                {/* Image Placeholder */}
            </div>

            <div className="p-6 sm:p-8 relative bg-white dark:bg-journal-card">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-3 w-2/3">
                        <div className="h-4 bg-journal-bg dark:bg-journal-border/50 rounded-full w-1/3 animate-pulse"></div>
                        <div className="h-8 bg-journal-bg dark:bg-journal-border/50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="h-12 bg-journal-bg dark:bg-journal-border/50 rounded-2xl w-1/2 animate-pulse"></div>
                    <div className="h-12 bg-journal-bg dark:bg-journal-border/50 rounded-2xl w-1/2 animate-pulse"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-4 bg-journal-bg dark:bg-journal-border/50 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-journal-bg dark:bg-journal-border/50 rounded-full w-5/6 animate-pulse"></div>
                </div>
            </div>

            {/* Shimmer Effect Overlay */}
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent skew-x-12"
                animate={{ translateX: ['-150%', '150%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
        </motion.div>
    );
};
