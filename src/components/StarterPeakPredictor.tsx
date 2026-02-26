import { useLiveQuery } from 'dexie-react-hooks';
import { motion } from 'framer-motion';
import { FlaskConical, Clock, AlertCircle } from 'lucide-react';
import { getStarterLogs } from '../utils/db';

export const StarterPeakPredictor = () => {
    const logs = useLiveQuery(() => getStarterLogs());

    if (!logs || logs.length === 0) return null;

    const latestLog = logs[0]; // ordered by createdAt descending
    const ratioParts = latestLog.feedRatio.split(':').map(Number);
    const flourPart = ratioParts.length === 3 ? ratioParts[1] : 1;

    // Heuristic: 1:1:1 usually peaks in 4h, 1:2:2 in 8h, 1:5:5 in 14h
    let peakHours = 6;
    if (flourPart === 1) peakHours = 4;
    else if (flourPart === 2) peakHours = 8;
    else if (flourPart === 3) peakHours = 10;
    else if (flourPart === 4) peakHours = 12;
    else if (flourPart >= 5) peakHours = 14;

    const peakTimeMs = latestLog.createdAt + (peakHours * 60 * 60 * 1000);
    const nowMs = Date.now();

    const isPastPeak = nowMs > peakTimeMs;
    const hoursSincePeak = (nowMs - peakTimeMs) / (1000 * 60 * 60);

    let statusText = "";
    let statusColor = "";
    let Icon = FlaskConical;

    if (!isPastPeak) {
        // Growing
        const hoursLeft = ((peakTimeMs - nowMs) / (1000 * 60 * 60)).toFixed(1);
        statusText = `Estimated Peak in ${hoursLeft} hrs`;
        statusColor = "text-sage-dark dark:text-sage-light bg-sage-light/20 border-sage-light dark:border-sage-dark/50";
        Icon = Clock;
    } else if (hoursSincePeak <= 4) {
        // At Peak Window
        statusText = "Starter is at Peak! Ready to bake.";
        statusColor = "text-crust bg-crust/10 border-crust/30";
        Icon = FlaskConical;
    } else {
        // Hungry
        statusText = "Starter is hungry (past peak).";
        statusColor = "text-red-800/60 dark:text-red-400/80 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20";
        Icon = AlertCircle;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${statusColor} shadow-sm backdrop-blur-sm mt-4 sm:mt-0 max-w-sm`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
                <span className="font-serif font-bold text-sm">{statusText}</span>
                <span className="font-sans text-[10px] tracking-widest uppercase opacity-70">
                    Last fed: {new Date(latestLog.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({latestLog.feedRatio})
                </span>
            </div>
        </motion.div>
    );
};
