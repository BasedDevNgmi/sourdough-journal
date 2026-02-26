import { motion } from 'framer-motion';
import { useState } from 'react';
import { Download, Upload, FlaskConical } from 'lucide-react';
import { exportDatabase, importDatabase, saveStarterLog, saveLoaf } from '../utils/db';
import { isCloudSyncConfigured, fetchAllCloudLoaves, fetchAllCloudStarterLogs } from '../utils/supabase';
import { useSettingsStore } from '../store/useSettingsStore';
import { useToastStore } from '../store/useToastStore';
import { useAuthStore } from '../store/useAuthStore';
import type { ThemeColor, ThemeMode } from '../store/useSettingsStore';

const pageTransition = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, filter: 'blur(10px)' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

export const Settings = () => {
    const { bakerName, setBakerName, themeColor, setThemeColor, themeMode, setThemeMode } = useSettingsStore();
    const { session, signOut } = useAuthStore();
    const { addToast, addConfirm } = useToastStore();

    const [starterRatio, setStarterRatio] = useState('1:1:1');
    const [starterAmount, setStarterAmount] = useState(25);
    const [isSyncing, setIsSyncing] = useState(false);

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
            {...pageTransition}
            className="w-full space-y-16"
        >
            <div className="border-b border-ink-main/20 pb-8">
                <h2 className="text-5xl sm:text-6xl font-serif font-bold text-ink-main tracking-tighter mb-4">The Lab</h2>
                <p className="text-ink-muted text-xl font-serif italic">Personalize your proofing environment.</p>
            </div>

            <div className="glass-card p-10 sm:p-16 rounded-[2.5rem] space-y-16">
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
                    <label className="block text-sm font-bold text-ink-muted mb-6 uppercase tracking-wider text-xs flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-sage-dark" />
                        Starter Maintenance
                    </label>
                    <div className="bg-journal-bg/30 p-6 rounded-2xl border border-journal-border space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-xs uppercase text-ink-muted mb-1">Ratio</label>
                                <input type="text" value={starterRatio} onChange={e => setStarterRatio(e.target.value)} placeholder="1:2:2" className="w-full p-2.5 rounded-lg bg-white dark:bg-journal-card border border-journal-border font-serif text-center" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-ink-muted mb-1">Starter (g)</label>
                                <input type="number" value={starterAmount} onChange={e => setStarterAmount(Number(e.target.value))} className="w-full p-2.5 rounded-lg bg-white dark:bg-journal-card border border-journal-border font-serif text-center" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-ink-muted mb-1">Flour (g)</label>
                                <input type="number" value={starterAmount * parseInt(starterRatio.split(':')[1] || '1')} readOnly className="w-full p-2.5 rounded-lg bg-white/50 dark:bg-journal-card/50 border border-journal-border font-serif text-center text-ink-muted" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-ink-muted mb-1">Water (g)</label>
                                <input type="number" value={starterAmount * parseInt(starterRatio.split(':')[2] || '1')} readOnly className="w-full p-2.5 rounded-lg bg-white/50 dark:bg-journal-card/50 border border-journal-border font-serif text-center text-ink-muted" />
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                const parts = starterRatio.split(':').map(Number);
                                if (parts.length === 3) {
                                    await saveStarterLog({
                                        id: crypto.randomUUID(),
                                        createdAt: Date.now(),
                                        feedRatio: starterRatio,
                                        starterAmountG: starterAmount,
                                        flourFedG: starterAmount * parts[1],
                                        waterFedG: starterAmount * parts[2],
                                        notes: ''
                                    });
                                    if (navigator.vibrate) navigator.vibrate(20);
                                    addToast('Starter feeding logged successfully.', 'success');
                                } else {
                                    addToast('Invalid ratio format. Use format like 1:1:1', 'error');
                                }
                            }}
                            className="w-full py-3 rounded-xl bg-ink-main text-journal-bg font-serif font-bold tracking-wide hover:bg-crust transition-colors shadow-sm"
                        >
                            Log Feeding
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-journal-border/50">
                    <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs">Data Management</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={async () => {
                                try {
                                    const json = await exportDatabase();
                                    const blob = new Blob([json], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `sourdough-journal-export-${new Date().toISOString().split('T')[0]}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                    addToast('Archive exported successfully.', 'success');
                                } catch (e) {
                                    console.error(e);
                                    addToast("Failed to export data.", 'error');
                                }
                            }}
                            className="flex-1 py-4 px-6 rounded-2xl border-2 border-journal-border bg-white dark:bg-journal-card text-ink-main dark:text-[#E8E6E1] hover:border-sage hover:text-sage-dark transition-all flex items-center justify-center gap-2 font-serif font-bold shadow-sm"
                        >
                            <Download className="w-5 h-5" />
                            Export Archives (JSON)
                        </button>

                        <div className="flex-1 relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    try {
                                        const text = await file.text();
                                        await importDatabase(text);
                                        addToast('Import successful! Reloading...', 'success');
                                        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
                                        setTimeout(() => window.location.reload(), 1500);
                                    } catch (err: any) {
                                        console.error(err);
                                        addToast(err.message || 'Failed to import data', 'error');
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="h-full py-4 px-6 rounded-2xl border-2 border-journal-border bg-white dark:bg-journal-card text-ink-main dark:text-[#E8E6E1] hover:border-crust hover:text-crust transition-all flex items-center justify-center gap-2 font-serif font-bold shadow-sm pointer-events-none">
                                <Upload className="w-5 h-5" />
                                Import Archives
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
                            Cloud Sync
                        </label>
                        {!isCloudSyncConfigured() ? (
                            <div className="bg-journal-bg/50 dark:bg-journal-card border border-journal-border p-5 rounded-2xl text-center">
                                <p className="text-sm font-sans text-ink-muted mb-3">Supabase credentials are not configured.</p>
                                <p className="text-xs text-ink-faint">Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local</p>
                            </div>
                        ) : !session ? (
                            <div className="bg-journal-bg/50 dark:bg-journal-card border border-journal-border p-5 rounded-2xl text-center text-ink-muted text-sm font-sans block">
                                Authentication lost. Please refresh the page to sign in again.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-sage/5 border border-sage/20 rounded-2xl">
                                    <p className="text-sm font-sans text-sage-dark dark:text-sage flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
                                        Authenticated as <b>{session.user.email}</b>
                                    </p>
                                    <button
                                        onClick={async () => {
                                            await signOut();
                                            addToast("Signed out from the cloud.", "success");
                                        }}
                                        className="text-xs font-bold uppercase tracking-wider text-sage-dark hover:text-ink-main transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                                <button
                                    onClick={async () => {
                                        setIsSyncing(true);
                                        try {
                                            const [cloudLoaves, cloudLogs] = await Promise.all([
                                                fetchAllCloudLoaves(),
                                                fetchAllCloudStarterLogs()
                                            ]);
                                            for (const l of cloudLoaves) await saveLoaf(l);
                                            for (const sl of cloudLogs) await saveStarterLog(sl);

                                            const { useJournalStore } = await import('../store/useJournalStore');
                                            await useJournalStore.getState().loadLoaves();

                                            addToast(`Synced ${cloudLoaves.length} loaves from cloud.`, 'success');
                                        } catch (err: any) {
                                            console.error(err);
                                            addToast(err.message || 'Sync failed', 'error');
                                        } finally {
                                            setIsSyncing(false);
                                        }
                                    }}
                                    disabled={isSyncing}
                                    className="w-full py-4 rounded-2xl border-2 border-sage text-sage-dark dark:text-sage-light hover:bg-sage/10 transition-all font-serif font-bold tracking-wide shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSyncing ? "Syncing..." : "Sync from Cloud"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-journal-border/50">
                    <label className="block text-sm font-bold text-red-900/40 dark:text-red-400/40 mb-4 uppercase tracking-wider text-xs">Danger Zone</label>
                    <button
                        onClick={async () => {
                            addConfirm("Are you sure you want to wipe all your journal entries?", async () => {
                                const { useJournalStore } = await import('../store/useJournalStore');
                                await useJournalStore.getState().clearAllLoaves();
                                window.location.href = '/';
                            });
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
