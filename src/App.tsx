import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { LogEntry } from './pages/LogEntry';
import { LoafDetail } from './pages/LoafDetail';
import { Settings } from './pages/Settings';
import { useJournalStore } from './store/useJournalStore';
import { useSettingsStore } from './store/useSettingsStore';

// We need a wrapper component to use location hooks
const AppContent = () => {
    const location = useLocation();
    const { isLoaded, loadLoaves } = useJournalStore();
    const { themeColor, themeMode } = useSettingsStore();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        loadLoaves();
    }, [loadLoaves]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply dark mode and theme color to HTML tag 
    useEffect(() => {
        const isDark =
            themeMode === 'dark' ||
            (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        document.documentElement.setAttribute('data-theme', themeColor);
    }, [themeMode, themeColor]);

    if (!isLoaded) return <div className="min-h-screen bg-journal-bg dark:bg-ink-main flex items-center justify-center font-serif text-ink-muted dark:text-journal-bg">Waking the starter...</div>;

    return (
        <div className="min-h-screen bg-journal-bg dark:bg-[#1C1B19] text-ink-main dark:text-[#E8E6E1] font-sans selection:bg-crust selection:text-white pb-32 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crust/10 dark:bg-crust/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse duration-10000 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sage/10 dark:bg-sage/5 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
            <div className="absolute inset-0 texture-overlay pointer-events-none" />

            {/* Header / Global Navigation */}
            <motion.div
                layout
                initial={false}
                animate={{
                    y: 0,
                    width: isScrolled ? "100%" : "auto",
                    borderRadius: isScrolled ? "0px" : "9999px",
                }}
                transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 35,
                    mass: 0.8
                }}
                className={`fixed z-50 flex justify-center left-0 right-0 mx-auto
                    /* Mobile: Always full width footer at bottom */
                    bottom-0 w-full rounded-none
                    /* Desktop: Floating Pill -> Sticky Header */
                    sm:bottom-auto sm:w-auto
                    ${isScrolled ? 'sm:top-0' : 'sm:top-6'}
                `}
            >
                <motion.div
                    layout
                    className={`bg-journal-bg/90 dark:bg-[#1C1B19]/90 backdrop-blur-xl flex items-center justify-between transition-colors duration-500 overflow-hidden ${isScrolled
                        ? 'w-full border-t sm:border-t-0 sm:border-b border-journal-border shadow-sm px-6 py-4'
                        : 'w-full sm:w-auto border-t sm:border-t-0 sm:border border-journal-border sm:shadow-lg sm:dark:shadow-[0_8px_30px_rgba(255,255,255,0.05)] px-6 sm:px-8 py-4 sm:py-3 sm:rounded-full'
                        }`}
                >
                    <motion.div layout className={`flex items-center justify-between w-full mx-auto transition-all duration-500 ${isScrolled ? 'max-w-5xl' : 'max-w-max sm:gap-10'}`}>
                        <Link to="/" className={`flex items-center gap-3 cursor-pointer group`}>
                            <motion.div layout="position" className="w-8 h-8 rounded-full border-2 border-crust flex items-center justify-center group-hover:bg-crust transition-all duration-300 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-crust group-hover:bg-white transition-all duration-300" />
                            </motion.div>
                            <AnimatePresence>
                                {!isScrolled && (
                                    <motion.h1
                                        layout="position"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="font-serif font-bold tracking-tight text-ink-main dark:text-[#E8E6E1] group-hover:text-ink-muted dark:group-hover:text-white/60 transition-colors duration-500 whitespace-nowrap overflow-hidden hidden sm:block text-xl"
                                    >
                                        Proof.
                                    </motion.h1>
                                )}
                            </AnimatePresence>
                        </Link>

                        <nav className={`flex items-center font-sans text-sm tracking-widest uppercase font-medium ${isScrolled ? 'gap-6 sm:gap-8' : 'justify-between w-full sm:w-auto gap-4 sm:gap-6'}`}>
                            <Link to="/" className={`transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-crust border-b-2 border-crust pb-0.5' : 'text-ink-muted dark:text-white/40 hover:text-ink-main dark:hover:text-white'}`}>
                                Logbook
                            </Link>
                            <Link to="/settings" className={`transition-colors whitespace-nowrap ${location.pathname === '/settings' ? 'text-crust border-b-2 border-crust pb-0.5' : 'text-ink-muted dark:text-white/40 hover:text-ink-main dark:hover:text-white'}`}>
                                Settings
                            </Link>
                            <Link to="/log" className={`flex items-center justify-center gap-2 shadow-sm hover:opacity-90 whitespace-nowrap overflow-hidden transition-all duration-300 ${isScrolled
                                ? 'px-5 py-2 rounded-full bg-crust text-white'
                                : 'px-5 py-2 rounded-full bg-crust text-white sm:bg-ink-main sm:dark:bg-[#E8E6E1] sm:text-journal-bg sm:dark:text-[#1C1B19]'
                                }`}>
                                <Plus className="w-4 h-4 flex-shrink-0" /> <span className="hidden sm:inline">Log</span>
                            </Link>
                        </nav>
                    </motion.div>
                </motion.div>
            </motion.div>


            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 relative z-10 min-h-[80vh]">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/log" element={<LogEntry />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/loaf/:id" element={<LoafDetail />} />
                    </Routes>
                </AnimatePresence>
            </main>

        </div >
    );
};

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
