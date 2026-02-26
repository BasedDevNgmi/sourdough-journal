import { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-journal-bg dark:bg-[#1C1B19] flex items-center justify-center p-6 selection:bg-crust selection:text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full bg-white dark:bg-journal-card p-10 rounded-[3rem] shadow-float border border-journal-border text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 mb-8">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-ink-main dark:text-[#E8E6E1] mb-4">The dough collapsed.</h1>
                        <p className="text-ink-muted italic font-serif text-lg mb-8 leading-relaxed">
                            An unexpected error occurred in the proofing box. Our bakers have been notified.
                        </p>
                        {this.state.error && (
                            <div className="text-left bg-journal-bg/50 dark:bg-[#1C1B19]/50 p-4 rounded-2xl border border-journal-border overflow-auto max-h-32 mb-8 hidden">
                                <code className="text-xs text-red-400 font-mono break-all">
                                    {this.state.error.message}
                                </code>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-ink-main text-journal-bg px-8 py-4 rounded-full font-serif font-bold text-lg hover:bg-crust transition-all hover:scale-105 shadow-sm inline-flex items-center gap-2 w-full justify-center"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            Restart Session
                        </button>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
