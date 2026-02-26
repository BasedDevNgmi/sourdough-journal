import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/useSettingsStore';
import type { ThemeColor, ThemeMode } from '../store/useSettingsStore';

export const Settings = () => {
    const { bakerName, setBakerName, themeColor, setThemeColor, themeMode, setThemeMode } = useSettingsStore();

    const themes: { id: ThemeColor, name: string }[] = [
        { id: 'original', name: 'Tartine Classic (Charcoal)' },
        { id: 'matcha', name: 'Matcha Milk Bread (Green Tea)' },
        { id: 'lavender', name: 'Lavender Focaccia (Purple)' },
        { id: 'honey', name: 'Golden Brioche (Amber)' },
        { id: 'rose', name: 'Cranberry Rose (Petal)' },
    ];

    const modes: { id: ThemeMode, name: string }[] = [
        { id: 'light', name: 'Oven Light' },
        { id: 'dark', name: 'Proof Box' },
        { id: 'system', name: 'Starter (Auto)' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-12"
        >
            <div className="border-b border-ink-main/20 pb-8">
                <h2 className="text-5xl sm:text-6xl font-serif font-bold text-ink-main tracking-tighter mb-4">The Lab</h2>
                <p className="text-ink-muted text-xl font-serif italic">Personalize your proofing environment.</p>
            </div>

            <div className="glass-card p-8 sm:p-12 rounded-[2.5rem] space-y-12">
                <div>
                    <label className="block text-sm font-bold text-ink-muted mb-3 uppercase tracking-wider text-xs">Baker's Moniker</label>
                    <input
                        type="text"
                        value={bakerName}
                        onChange={(e) => setBakerName(e.target.value)}
                        placeholder="e.g. Chad Robertson"
                        className="w-full bg-journal-bg/50 border-2 border-transparent border-b-journal-border rounded-t-2xl px-5 py-5 text-ink-main text-xl focus:outline-none focus:bg-white dark:focus:bg-journal-card focus:border-b-crust focus:border-2 transition-all placeholder:text-ink-faint font-serif"
                    />
                    <p className="text-sm text-ink-muted mt-3 font-serif italic">Used to sign your master formulas.</p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs">Aesthetic Palette</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setThemeColor(t.id)}
                                className={`py-4 px-6 rounded-2xl border-2 transition-all font-serif text-lg text-left ${themeColor === t.id ? 'border-crust bg-white dark:bg-journal-card text-ink-main dark:text-[#E8E6E1] shadow-sm' : 'border-journal-border bg-journal-bg/50 dark:bg-journal-bg/5 text-ink-muted hover:bg-white/50 dark:hover:bg-journal-card/50'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs">Color Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                        {modes.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setThemeMode(m.id)}
                                className={`w-full py-4 px-2 sm:px-6 rounded-2xl border-2 transition-all font-sans text-xs sm:text-sm tracking-widest uppercase font-semibold text-center ${themeMode === m.id ? 'border-crust bg-white dark:bg-journal-card text-crust shadow-sm' : 'border-journal-border bg-journal-bg/50 dark:bg-journal-bg/5 text-ink-muted hover:bg-white/50 dark:hover:bg-journal-card/50'}`}
                            >
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-8 border-t border-journal-border/50">
                    <label className="block text-sm font-bold text-red-900/40 dark:text-red-400/40 mb-4 uppercase tracking-wider text-xs">Danger Zone</label>
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to wipe all your journal entries? This will re-seed the initial mock data.")) {
                                const { useJournalStore } = await import('../store/useJournalStore');
                                await useJournalStore.getState().clearAllLoaves();
                                window.location.href = '/';
                            }
                        }}
                        className="py-3 px-6 rounded-2xl border-2 border-red-900/10 dark:border-red-400/10 text-red-900/60 dark:text-red-400/60 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-900/30 dark:hover:border-red-400/30 transition-all font-sans text-sm tracking-widest uppercase font-semibold w-full sm:w-auto"
                    >
                        Scrap Dough & Reset Demo
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
