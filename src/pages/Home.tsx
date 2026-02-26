import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoafCard } from '../components/LoafCard';
import { LoafCardSkeleton } from '../components/LoafCardSkeleton';
import { useJournalStore } from '../store/useJournalStore';
import { StarterPeakPredictor } from '../components/StarterPeakPredictor';
import { Search, Wheat } from 'lucide-react';

const pageTransition = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, filter: 'blur(10px)' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

export const Home = () => {
    const { loaves, isLoaded } = useJournalStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLoaves = loaves.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <motion.div
            {...pageTransition}
            className="space-y-12"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-ink-main/10 pb-8 mb-8 gap-6">
                <div className="max-w-2xl">
                    <motion.h2 layoutId="page-title" className="text-6xl sm:text-7xl font-serif font-bold text-ink-main tracking-tighter leading-none mb-4">
                        The Breadbox
                    </motion.h2>
                    <p className="text-ink-muted text-xl font-serif italic">A chronicle of flour, water, temperature, time, and occasionally, tears.</p>
                </div>

                <div className="flex flex-col sm:items-end gap-4 relative w-full sm:w-auto">
                    <StarterPeakPredictor />

                    {loaves.length > 0 && (
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                            <input
                                type="text"
                                placeholder="Search the breadbox..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/50 border border-journal-border rounded-full py-2.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:border-crust focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {!isLoaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
                    <div className="space-y-6 lg:space-y-10">
                        <LoafCardSkeleton />
                        <LoafCardSkeleton />
                    </div>
                    <div className="space-y-6 lg:space-y-10 mt-0 sm:mt-12">
                        <LoafCardSkeleton />
                    </div>
                </div>
            ) : loaves.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-center py-32 border border-journal-border/80 rounded-[3rem] bg-white/40 shadow-sm relative overflow-hidden group"
                >
                    <motion.div
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="inline-block mb-8"
                    >
                        <Wheat className="w-24 h-24 mx-auto text-sage/40 group-hover:text-crust transition-colors duration-500" strokeWidth={1} />
                    </motion.div>
                    <h3 className="text-4xl font-serif text-ink-main mb-4 tracking-tight">The breadbox is empty.</h3>
                    <p className="text-ink-muted text-xl font-serif italic">Let's get this bread. Your starter is hungry.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-start">
                    {/* Masonry-ish distribution by odd/even index for the editorial asymmetrical look */}
                    <div className="space-y-6 lg:space-y-10">
                        <AnimatePresence>
                            {filteredLoaves.filter((_, i) => i % 2 === 0).map((loaf) => (
                                <LoafCard key={loaf.id} loaf={loaf} />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="space-y-6 lg:space-y-10">
                        <AnimatePresence>
                            {filteredLoaves.filter((_, i) => i % 2 !== 0).map((loaf) => (
                                <LoafCard key={loaf.id} loaf={loaf} />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
