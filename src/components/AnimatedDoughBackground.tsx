import { motion } from 'framer-motion';

export const AnimatedDoughBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-journal-bg dark:bg-[#1C1B19]">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-journal-bg via-sage/5 to-amber-900/10 dark:from-[#1C1B19] dark:via-sage-dark/10 dark:to-orange-900/20" />

            {/* Glowing orb 1 (Warm Dough) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 0.9, 1],
                    x: [0, 50, -20, 0],
                    y: [0, -30, 40, 0],
                    rotate: [0, 90, 180, 360],
                    borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "50% 50% 40% 60%", "40% 60% 70% 30%"]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-amber-200/40 dark:bg-amber-700/20 mix-blend-multiply dark:mix-blend-screen blur-[80px]"
            />

            {/* Glowing orb 2 (Starter Bubbles) */}
            <motion.div
                animate={{
                    scale: [1, 1.5, 0.8, 1],
                    x: [0, -60, 30, 0],
                    y: [0, 50, -20, 0],
                    rotate: [360, 180, 90, 0],
                    borderRadius: ["60% 40% 30% 70%", "40% 60% 70% 30%", "50% 50% 60% 40%", "60% 40% 30% 70%"]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-[10%] -right-[10%] w-[70%] h-[70%] bg-orange-200/30 dark:bg-orange-800/20 mix-blend-multiply dark:mix-blend-screen blur-[100px]"
            />

            {/* Glowing orb 3 (Sage / Flour dusting) */}
            <motion.div
                animate={{
                    scale: [0.8, 1.2, 1, 0.8],
                    x: [0, 20, -40, 0],
                    y: [0, -40, 20, 0],
                    rotate: [0, -90, -180, -360],
                    borderRadius: ["50% 50% 40% 60%", "30% 70% 60% 40%", "60% 40% 50% 50%", "50% 50% 40% 60%"]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                }}
                className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] bg-sage-light/40 dark:bg-sage-dark/20 mix-blend-multiply dark:mix-blend-screen blur-[120px]"
            />

            {/* Noise texture overlay for that floury feel */}
            <div className="absolute inset-0 texture-overlay opacity-50 mix-blend-overlay" />
        </div>
    );
};
