import { useEffect, useState, lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { Plus, Book, Settings as SettingsIcon, Wheat } from 'lucide-react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer } from './components/Toast';
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const LogEntry = lazy(() => import('./pages/LogEntry').then(m => ({ default: m.LogEntry })));
const LoafDetail = lazy(() => import('./pages/LoafDetail').then(m => ({ default: m.LoafDetail })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
import { useJournalStore } from './store/useJournalStore';
import { useSettingsStore } from './store/useSettingsStore';

const NavItem = ({ to, label, active, icon }: { to: string, label: string, active: boolean, icon: ReactNode }) => (
    <Link to={to} className={`relative flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-300 z-10 group outline-none ${active ? 'text-journal-bg dark:text-[#1C1B19]' : 'text-ink-muted dark:text-white/50 hover:text-ink-main dark:hover:text-white'}`}>
        {active && (
            <motion.div
                layoutId="nav-active-pill"
                className="absolute inset-0 bg-ink-main dark:bg-[#E8E6E1] rounded-full z-[-1]"
                transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            />
        )}
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
        <span className={`relative z-10 font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-bold`}>{label}</span>
    </Link>
);

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

    if (!isLoaded) return (
        <div className="min-h-screen bg-journal-bg dark:bg-[#1C1B19] flex items-center justify-center">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex flex-col items-center gap-4 text-ink-muted dark:text-[#E8E6E1]/50"
            >
                <Wheat className="w-8 h-8 opacity-50" />
                <span className="font-serif italic text-sm tracking-widest uppercase">Waking the starter...</span>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-journal-bg dark:bg-[#1C1B19] text-ink-main dark:text-[#E8E6E1] font-sans selection:bg-crust selection:text-white pb-32 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-crust/10 dark:bg-crust/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse duration-10000 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sage/10 dark:bg-sage/5 rounded-full blur-[140px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
            <div className="absolute inset-0 texture-overlay pointer-events-none" />

            {/* The Dynamic Breadboard (Nav) */}
            <motion.div
                className={`fixed z-[100] left-0 right-0 mx-auto flex justify-center pointer-events-none
                    bottom-6 sm:bottom-auto sm:top-8
                `}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
            >
                <motion.div
                    layout
                    className={`pointer-events-auto flex items-center p-2 rounded-full backdrop-blur-2xl bg-white/70 dark:bg-[#1C1B19]/70 border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500`}
                >
                    <Link to="/" className="flex items-center pl-4 pr-3 sm:pr-6 cursor-pointer group outline-none">
                        <motion.div layout="position" className="w-8 h-8 rounded-full border-[3px] border-crust flex items-center justify-center group-hover:bg-crust transition-all duration-300 flex-shrink-0 relative overflow-hidden">
                            <motion.div
                                className="w-2.5 h-2.5 rounded-full bg-crust group-hover:bg-white transition-all duration-300"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            />
                        </motion.div>
                        <AnimatePresence>
                            {!isScrolled && (
                                <motion.h1
                                    layout="position"
                                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    transition={{ duration: 0.3, ease: "circInOut" }}
                                    className="font-serif tracking-tight text-ink-main dark:text-[#E8E6E1] group-hover:text-crust transition-colors duration-300 hidden sm:block text-xl font-black italic whitespace-nowrap overflow-hidden pr-2"
                                >
                                    Proof.
                                </motion.h1>
                            )}
                        </AnimatePresence>
                    </Link>

                    <div className="w-px h-8 bg-ink-main/10 dark:bg-white/10 mx-1 sm:mx-2" />

                    <nav className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-2">
                        <LayoutGroup>
                            <NavItem to="/" label="Archive" icon={<Book className="w-4 h-4 sm:w-4 sm:h-4" />} active={location.pathname === '/' || location.pathname.startsWith('/loaf')} />
                            <NavItem to="/settings" label="Lab" icon={<SettingsIcon className="w-4 h-4 sm:w-4 sm:h-4" />} active={location.pathname === '/settings'} />
                        </LayoutGroup>

                        <div className="w-px h-8 bg-ink-main/10 dark:bg-white/10 mx-1 sm:mx-2" />

                        <Link to="/log" className="relative group overflow-hidden px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-crust text-white shadow-lg hover:shadow-crust/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 outline-none">
                            <span className="relative z-10 flex items-center gap-2">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-90" />
                                <span className="hidden sm:inline font-sans text-xs sm:text-sm tracking-[0.1em] uppercase font-bold text-white">Bake</span>
                            </span>
                            {/* Animated shiny overlay */}
                            <motion.div
                                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                animate={{ translateX: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 4, delay: 1, ease: 'linear' }}
                            />
                        </Link>
                    </nav>
                </motion.div>
            </motion.div>

            <ToastContainer />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 relative z-10 min-h-[80vh]">
                <Suspense fallback={
                    <div className="flex h-[40vh] items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="flex flex-col items-center gap-4 text-ink-muted">
                            <Wheat className="w-8 h-8 opacity-50" />
                            <span className="font-serif italic text-sm tracking-widest uppercase">Fetching dough...</span>
                        </motion.div>
                    </div>
                }>
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Home />} />
                            <Route path="/log" element={<LogEntry />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/loaf/:id" element={<LoafDetail />} />
                        </Routes>
                    </AnimatePresence>
                </Suspense>
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
