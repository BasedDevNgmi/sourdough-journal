import { useState } from 'react';
import { Star, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LoafRecord } from '../types';

interface LoafCardProps {
    loaf: LoafRecord;
}

export const LoafCard = ({ loaf }: LoafCardProps) => {
    const rating = loaf.ratings?.overall || 0;
    const hasImage = loaf.images && loaf.images.length > 0;
    const [imgError, setImgError] = useState(false);

    return (
        <Link to={`/loaf/${loaf.id}`} className="block focus:outline-none">
            <motion.div
                layoutId={`card-${loaf.id}`}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="glass-card bg-white dark:bg-journal-card rounded-[2rem] p-6 transition-all duration-300 hover:shadow-float relative overflow-hidden group cursor-pointer"
            >
                <div className="flex gap-6 items-center">
                    {/* Thumbnail */}
                    <motion.div layoutId={`image-container-${loaf.id}`} className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-journal-bg border border-journal-border flex items-center justify-center relative">
                        {hasImage && !imgError ? (
                            <img src={loaf.images[0]} alt={loaf.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                        ) : (
                            <div className="text-ink-faint flex flex-col items-center">
                                <ImageIcon className="w-8 h-8 opacity-20" strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </motion.div>

                    {/* Glanceable Info */}
                    <div className="flex-1 min-w-0">
                        <motion.span layoutId={`date-${loaf.id}`} className="block text-xs font-sans font-medium tracking-widest uppercase text-sage-dark mb-2">
                            {loaf.date}
                        </motion.span>
                        <motion.h3 layoutId={`title-${loaf.id}`} className="text-2xl sm:text-3xl font-serif font-bold text-ink-main group-hover:text-crust transition-colors leading-tight mb-3 truncate">
                            {loaf.name}
                        </motion.h3>
                        <motion.div layoutId={`rating-${loaf.id}`} className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? 'text-crust fill-crust drop-shadow-sm' : 'text-journal-border'}`} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
