import { motion } from 'framer-motion';

export const AnimatedDoughBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-journal-bg dark:bg-[#1C1B19] flex items-center justify-center will-change-transform">
            {/* Base static background */}
            <div className="absolute inset-0 bg-gradient-to-br from-journal-bg via-sage/10 to-amber-900/10 dark:from-[#1C1B19] dark:via-sage-dark/10 dark:to-orange-900/20" />

            {/* Glowing orb 1 (Warm Dough) */}
            {/* We replaced mix-blend modes and huge CSS blurs with native CSS radial gradients which render instantly on GPU */}
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
                className="absolute w-[60vw] h-[60vw] sm:w-[50vw] sm:h-[50vw] -top-[10%] -left-[10%] opacity-40 dark:opacity-20 will-change-transform"
                style={{ background: 'radial-gradient(circle, rgba(253,230,138,1) 0%, rgba(253,230,138,0) 70%)' }}
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
                className="absolute w-[70vw] h-[70vw] sm:w-[60vw] sm:h-[60vw] top-[5%] -right-[15%] opacity-30 dark:opacity-20 will-change-transform"
                style={{ background: 'radial-gradient(circle, rgba(254,215,170,1) 0%, rgba(254,215,170,0) 70%)' }}
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
                className="absolute w-[80vw] h-[80vw] sm:w-[70vw] sm:h-[70vw] -bottom-[10%] right-[10%] opacity-40 dark:opacity-20 will-change-transform"
                style={{ background: 'radial-gradient(circle, rgba(167,184,168,1) 0%, rgba(167,184,168,0) 70%)' }}
            />

            {/* Noise texture overlay for that floury feel */}
            <div className="absolute inset-0 texture-overlay opacity-[0.15] dark:opacity-30 mix-blend-overlay pointer-events-none" />
        </div>
    );
};
