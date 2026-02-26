import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Thermometer, Target, Droplets, Wheat, Beaker } from 'lucide-react';
import { useJournalStore } from '../store/useJournalStore';

const pageTransition = {
    initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, filter: 'blur(10px)' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
};

export const LoafDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const loaves = useJournalStore(state => state.loaves);
    const currentLoaf = loaves.find(l => l.id === id);

    // Cache the loaf so that the Framer Motion exit animation doesn't crash 
    // when the loaf is abruptly removed from the global store before animating out
    const loafRef = useRef(currentLoaf);
    if (currentLoaf) loafRef.current = currentLoaf;

    const loaf = currentLoaf || loafRef.current;

    if (!loaf) {
        return <div className="text-center py-20 font-serif text-ink-muted">Loaf not found in the archives.</div>;
    }

    const hasImage = loaf.images && loaf.images.length > 0;
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            {...pageTransition}
            className="w-full"
        >
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-ink-muted hover:text-ink-main font-sans text-xs uppercase tracking-widest mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Archives
            </button>

            <motion.div layoutId={`card-${loaf.id}`} className="bg-white dark:bg-journal-card rounded-[3rem] overflow-hidden shadow-float relative border border-journal-border">

                {/* Hero Header Area */}
                {hasImage && !imgError ? (
                    <div className="w-full h-[50vh] sm:h-[60vh] relative flex flex-col justify-end p-8 sm:p-16 pb-12">
                        <motion.div layoutId={`image-container-${loaf.id}`} className="absolute inset-0">
                            <img src={loaf.images[0]} alt={loaf.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                            <div className="absolute inset-0 bg-gradient-to-t from-journal-bg via-journal-bg/60 dark:from-journal-card dark:via-journal-card/80 to-transparent/20" />
                        </motion.div>

                        <div className="relative z-10 w-full flex flex-col group">
                            <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity -mt-16 sm:-mt-20">
                                <button onClick={() => navigate('/log', { state: { editId: loaf.id, initialData: loaf } })} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-ink-main hover:bg-white dark:hover:bg-journal-bg/80 transition-colors" title="Edit Entry">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                </button>
                                <button onClick={() => navigate('/log', { state: { iterateId: loaf.id, initialData: loaf } })} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-ink-main hover:bg-white dark:hover:bg-journal-bg/80 transition-colors" title="Iterate Recipe">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M8 3H3v5"></path><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path><path d="m15 9 6-6"></path></svg>
                                </button>
                                <button onClick={async () => {
                                    if (window.confirm("Are you sure you want to remove this loaf from the archives?")) {
                                        await useJournalStore.getState().removeLoaf(loaf.id);
                                        navigate('/');
                                    }
                                }} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Delete Entry">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>

                            <motion.span layoutId={`date-${loaf.id}`} className="block text-sm font-sans font-semibold tracking-widest uppercase mb-4 text-ink-main/80 dark:text-white/80">
                                {loaf.date}
                            </motion.span>
                            <motion.h1 layoutId={`title-${loaf.id}`} className="text-5xl sm:text-7xl font-serif font-bold tracking-tighter leading-none mb-6 text-ink-main dark:text-white drop-shadow-md">
                                {loaf.name}
                            </motion.h1>

                            <div className="flex bg-journal-bg/80 backdrop-blur-sm self-start inline-flex p-3 rounded-2xl border border-journal-border shadow-sm">
                                <motion.div layoutId={`rating-${loaf.id}`} className="flex gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-6 h-6 ${i < (loaf.ratings?.overall || 0) ? 'text-crust fill-crust drop-shadow-sm' : 'text-ink-main/10'}`} />
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 sm:p-16 pb-12 dark:bg-journal-card relative group border-b border-ink-main/10">
                        <div className="absolute top-8 right-8 sm:top-16 sm:right-16 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => navigate('/log', { state: { editId: loaf.id, initialData: loaf } })} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-ink-main hover:bg-white dark:hover:bg-journal-bg/80 transition-colors" title="Edit Entry">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </button>
                            <button onClick={() => navigate('/log', { state: { iterateId: loaf.id, initialData: loaf } })} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-ink-main hover:bg-white dark:hover:bg-journal-bg/80 transition-colors" title="Iterate Recipe">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M8 3H3v5"></path><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path><path d="m15 9 6-6"></path></svg>
                            </button>
                            <button onClick={async () => {
                                if (window.confirm("Are you sure you want to remove this loaf from the archives?")) {
                                    await useJournalStore.getState().removeLoaf(loaf.id);
                                    navigate('/');
                                }
                            }} className="p-2 bg-journal-bg dark:bg-journal-card border border-journal-border rounded-lg text-ink-muted hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors" title="Delete Entry">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                        </div>
                        <motion.span layoutId={`date-${loaf.id}`} className="block text-sm font-sans font-semibold tracking-widest uppercase mb-4 text-sage-dark">
                            {loaf.date}
                        </motion.span>
                        <motion.h1 layoutId={`title-${loaf.id}`} className="text-5xl sm:text-7xl font-serif font-bold tracking-tighter leading-none mb-6 text-ink-main">
                            {loaf.name}
                        </motion.h1>

                        <div className="flex bg-journal-bg/80 backdrop-blur-sm self-start inline-flex p-3 rounded-2xl border border-journal-border shadow-sm">
                            <motion.div layoutId={`rating-${loaf.id}`} className="flex gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-6 h-6 ${i < (loaf.ratings?.overall || 0) ? 'text-crust fill-crust drop-shadow-sm' : 'text-ink-main/10'}`} />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}

                <div className="p-8 sm:p-16 pt-8 sm:pt-12">
                    {/* Baker's Formula Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
                        <div className="p-5 bg-journal-bg rounded-2xl border border-journal-border text-center">
                            <Wheat className="w-5 h-5 text-crust mx-auto mb-2" />
                            <div className="font-serif text-3xl text-ink-main mb-1">{loaf.math.flour}g</div>
                            <div className="text-xs uppercase tracking-widest text-ink-muted">Total Flour</div>
                        </div>
                        <div className="p-5 bg-journal-bg rounded-2xl border border-journal-border text-center">
                            <Droplets className="w-5 h-5 text-sage-dark mx-auto mb-2" />
                            <div className="font-serif text-3xl text-ink-main mb-1">{loaf.math.waterHydration}%</div>
                            <div className="text-xs uppercase tracking-widest text-ink-muted">Hydration</div>
                        </div>
                        <div className="p-5 bg-journal-bg rounded-2xl border border-journal-border text-center">
                            <Beaker className="w-5 h-5 text-ink-main/60 mx-auto mb-2" />
                            <div className="font-serif text-3xl text-ink-main mb-1">{loaf.math.starterPercentage}%</div>
                            <div className="text-xs uppercase tracking-widest text-ink-muted">Starter</div>
                        </div>
                        <div className="p-5 bg-journal-bg rounded-2xl border border-journal-border text-center">
                            <Thermometer className="w-5 h-5 text-crust mx-auto mb-2" />
                            <div className="font-serif text-3xl text-ink-main mb-1">{loaf.timeline.roomTempC || '--'}°</div>
                            <div className="text-xs uppercase tracking-widest text-ink-muted">Room Temp</div>
                        </div>
                    </div>

                    {/* Detailed Timeline & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2 border-b border-ink-main/10 pb-4">
                                <Clock className="w-5 h-5 text-sage-dark" /> The Method
                            </h3>
                            <ul className="space-y-4 font-sans text-sm">
                                <li className="flex justify-between border-b border-ink-faint/10 pb-2">
                                    <span className="text-ink-muted uppercase tracking-wider">Autolyse</span>
                                    <span className="font-serif text-lg font-medium">{loaf.timeline.autolyseDurationMins} mins</span>
                                </li>
                                <li className="flex justify-between border-b border-ink-faint/10 pb-2">
                                    <span className="text-ink-muted uppercase tracking-wider">Bulk Fermentation</span>
                                    <span className="font-serif text-lg font-medium">{loaf.timeline.bulkFermentationHours} hrs at {loaf.timeline.bulkDoughTempC}°C</span>
                                </li>
                                <li className="flex justify-between border-b border-ink-faint/10 pb-2">
                                    <span className="text-ink-muted uppercase tracking-wider">Cold Retard</span>
                                    <span className="font-serif text-lg font-medium">{loaf.timeline.coldRetardHours} hrs</span>
                                </li>
                                <li className="flex justify-between border-b border-ink-faint/10 pb-2">
                                    <span className="text-ink-muted uppercase tracking-wider">Bake Temp</span>
                                    <span className="font-serif text-lg font-medium">{loaf.timeline.bakeTempC}°C</span>
                                </li>
                                <li className="flex justify-between border-b border-ink-faint/10 pb-2">
                                    <span className="text-ink-muted uppercase tracking-wider">Bake Time (Cov/Uncov)</span>
                                    <span className="font-serif text-lg font-medium">{loaf.timeline.bakeCoveredMins} / {loaf.timeline.bakeUncoveredMins} mins</span>
                                </li>
                            </ul>

                            <h3 className="text-2xl font-serif font-bold mt-12 mb-6 flex items-center gap-2 border-b border-ink-main/10 pb-4">
                                <Target className="w-5 h-5 text-crust" /> Sensory Matrix
                            </h3>
                            <div className="space-y-4">
                                {(['crumb', 'crust', 'ovenSpring', 'flavor'] as const).map(trait => (
                                    <div key={trait} className="flex justify-between items-center text-sm">
                                        <span className="text-ink-muted uppercase tracking-wider capitalize">{trait.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <div className="flex gap-1 bg-journal-bg px-2 py-1 rounded-full">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < (loaf.ratings?.[trait] || 0) ? 'text-crust fill-crust' : 'text-journal-border'}`} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-serif font-bold mb-6 border-b border-ink-main/10 pb-4">
                                Baker's Notes
                            </h3>
                            <p className="text-ink-main text-lg leading-relaxed font-serif italic border-l-4 border-sage-light pl-6 relative">
                                "{loaf.notes}"
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
