import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoafCard } from '../components/LoafCard';
import { useJournalStore } from '../store/useJournalStore';
import { Search } from 'lucide-react';

export const Home = () => {
    const { loaves } = useJournalStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLoaves = loaves.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-ink-main/10 pb-8 mb-8 gap-6">
                <div className="max-w-2xl">
                    <motion.h2 layoutId="page-title" className="text-6xl sm:text-7xl font-serif font-bold text-ink-main tracking-tighter leading-none mb-4">
                        The Breadbox
                    </motion.h2>
                    <p className="text-ink-muted text-xl font-serif italic">A chronicle of flour, water, temperature, time, and occasionally, tears.</p>
                </div>

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

            {loaves.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-32 border border-journal-border/80 rounded-[3rem] bg-white/40"
                >
                    <h3 className="text-3xl font-serif text-ink-main mb-4 tracking-tight">The breadbox is empty.</h3>
                    <p className="text-ink-muted text-xl font-serif italic mb-8">Let's get this bread. Your starter is hungry.</p>
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
