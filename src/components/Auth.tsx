import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Mail, Lock, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

type AuthMode = 'signin' | 'signup' | 'magiclink' | 'forgotpassword';

export const Auth = ({ onComplete = () => { } }: { onComplete?: () => void }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const addToast = useToastStore(state => state.addToast);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!supabase) {
            setError("Cloud Sync is not configured.");
            setIsLoading(false);
            return;
        }

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                addToast("Starter fed! Check your email to verify your account.", "success");
                setMode('signin');
            } else if (mode === 'signin') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                addToast("Welcome back to the bakery.", "success");
                onComplete();
            } else if (mode === 'magiclink') {
                const { error } = await supabase.auth.signInWithOtp({ email });
                if (error) throw error;
                addToast("Magic link sent! Check your inbox.", "success");
                setMode('signin');
            } else if (mode === 'forgotpassword') {
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                addToast("Password reset instructions sent! Check your email.", "success");
                setMode('signin');
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred during fermentation.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        // We purposely do NOT clear email, so if they mistyped and switch to signup, it's preserved.
        if (newMode === 'magiclink' || newMode === 'forgotpassword') {
            setPassword('');
        }
    };

    const getModeTitle = () => {
        switch (mode) {
            case 'signin': return 'Welcome Back';
            case 'signup': return 'Join the Bakery';
            case 'magiclink': return 'Magic Link';
            case 'forgotpassword': return 'Reset Password';
        }
    };

    const getModeCopy = () => {
        switch (mode) {
            case 'signin': return 'Proof your identity to access your cloud archives.';
            case 'signup': return 'Start logging your bakes securely in the cloud.';
            case 'magiclink': return 'We\'ll send a magic link to instantly log you in. No password kneading required.';
            case 'forgotpassword': return 'Over-fermented your memory? Enter your email to reset your password.';
        }
    };

    const getPrimaryAction = () => {
        if (isLoading) return 'Proofing...';
        switch (mode) {
            case 'signin': return 'Sign In';
            case 'signup': return 'Create Account';
            case 'magiclink': return 'Send Magic Link';
            case 'forgotpassword': return 'Send Reset Link';
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center max-h-full">
            {/* Massive Landing Page Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8 text-center flex flex-col items-center"
            >
                {/* Minimal & Elegant Dough / Twist SVG */}
                <motion.svg
                    width="48"
                    height="48"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-4 text-ink-main dark:text-[#E8E6E1] drop-shadow-sm"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {/* Minimal outline of a sourdough boule */}
                    <path d="M15,60 C10,35 30,20 50,20 C70,20 90,35 85,60 C80,85 20,85 15,60 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="transparent" />
                    {/* Minimalist elegant scoring (twist/wheat hybrid) */}
                    <path d="M35,35 Q 50,55 35,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="transparent" />
                    <path d="M65,35 Q 50,55 65,75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="transparent" />
                    <path d="M50,25 L50,80" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
                </motion.svg>

                <h1 className="text-4xl sm:text-5xl font-serif font-black italic text-ink-main dark:text-[#E8E6E1] tracking-tighter drop-shadow-sm leading-none">
                    Proof.
                </h1>
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase font-bold text-ink-muted mt-4">
                    The Sourdough Journal
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.3, delay: 0.2 }}
                className="w-full bg-white/60 dark:bg-journal-card/80 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden"
            >

                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-sage-light dark:bg-journal-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-subtle border border-journal-border">
                            <Lock className="w-8 h-8 text-sage-dark dark:text-sage" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-ink-main dark:text-white mb-3">
                            {getModeTitle()}
                        </h2>
                        <p className="text-sm font-sans text-ink-muted">
                            {getModeCopy()}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 flex gap-3 text-red-800 dark:text-red-300 items-start overflow-hidden"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="text-sm font-sans">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-ink-muted ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-ink-faint group-focus-within:text-sage transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="baker@wildyeast.com"
                                    className="w-full pl-12 pr-5 py-4 bg-journal-bg dark:bg-journal-bg border-2 border-journal-border rounded-2xl focus:border-sage focus:ring-0 transition-all font-sans text-ink-main outline-none text-base"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {(mode === 'signin' || mode === 'signup') && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1.5 overflow-hidden"
                                >
                                    <label className="text-xs font-bold uppercase tracking-wider text-ink-muted ml-1 flex justify-between">
                                        <span>Password</span>
                                        {mode === 'signin' && (
                                            <button type="button" onClick={() => toggleMode('forgotpassword')} className="text-sage-dark hover:text-sage transition-colors">
                                                Forgot?
                                            </button>
                                        )}
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <KeyRound className="w-5 h-5 text-ink-faint group-focus-within:text-sage transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-5 py-4 bg-journal-bg dark:bg-journal-bg border-2 border-journal-border rounded-2xl focus:border-sage focus:ring-0 transition-all font-sans text-ink-main outline-none text-base"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-4 bg-ink-main dark:bg-white text-white dark:text-ink-main rounded-2xl font-serif font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {getPrimaryAction()}
                            {mode === 'magiclink' && <Sparkles className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-amber-300 transition-all" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-journal-border/50 text-center flex flex-col gap-3">
                        {mode === 'signin' ? (
                            <>
                                <button type="button" onClick={() => toggleMode('signup')} className="text-sm font-sans text-ink-muted hover:text-ink-main transition-colors">
                                    Need an account? <span className="font-bold underline decoration-sage/50 underline-offset-4">Sign Up</span>
                                </button>
                                <button type="button" onClick={() => toggleMode('magiclink')} className="text-sm font-sans text-ink-muted hover:text-ink-main transition-colors">
                                    prefer passwordless? <span className="font-bold">Use Magic Link</span>
                                </button>
                            </>
                        ) : (
                            <button type="button" onClick={() => toggleMode('signin')} className="text-sm font-sans text-ink-muted hover:text-ink-main transition-colors">
                                Already have an account? <span className="font-bold underline decoration-sage/50 underline-offset-4">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
