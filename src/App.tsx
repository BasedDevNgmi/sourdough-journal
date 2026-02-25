import { useState, useEffect } from 'react';
import { Plus, BookOpen, Wheat, Star, Check, Droplets, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BakersMath from './components/BakersMath';
import type { BakersMathData } from './components/BakersMath';
import ImageUploader from './components/ImageUploader';

interface LoafRecord {
    id: string;
    name: string;
    date: string;
    math: BakersMathData;
    notes: string;
    rating: number; // 1 to 5
    images: string[];
}

// Initial mock data provided only if local storage is empty
const defaultLoaves: LoafRecord[] = [
    {
        id: '1',
        name: 'Weekend Boule',
        date: 'Oct 12, 2023',
        math: { flour: 500, waterHydration: 75, saltPercentage: 2, starterPercentage: 20 },
        notes: 'Great oven spring. Used 10% whole wheat. Cold proofed for 18 hours.',
        rating: 5,
        images: []
    },
    {
        id: '2',
        name: 'Rustic Batard',
        date: 'Oct 05, 2023',
        math: { flour: 800, waterHydration: 80, saltPercentage: 2, starterPercentage: 20 },
        notes: 'A bit flat, might have overproofed. Still delicious.',
        rating: 3,
        images: []
    }
];

function App() {
    const [isLogging, setIsLogging] = useState(false);

    // Persisted state
    const [loaves, setLoaves] = useState<LoafRecord[]>(() => {
        const saved = localStorage.getItem('wildyeast_loaves');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return defaultLoaves;
            }
        }
        return defaultLoaves;
    });

    useEffect(() => {
        localStorage.setItem('wildyeast_loaves', JSON.stringify(loaves));
    }, [loaves]);

    // Form State
    const [newName, setNewName] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [newRating, setNewRating] = useState(4);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [mathData, setMathData] = useState<BakersMathData>({
        flour: 500,
        waterHydration: 75,
        saltPercentage: 2,
        starterPercentage: 20
    });

    // UI State
    const [toast, setToast] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    const handleSave = () => {
        if (!newName.trim()) {
            alert("Every masterpiece needs a title.");
            return;
        }

        const newLoaf: LoafRecord = {
            id: Date.now().toString(),
            name: newName,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            math: { ...mathData },
            notes: newNotes,
            rating: newRating,
            images: [...newImages]
        };

        setLoaves([newLoaf, ...loaves]);

        // Reset Form
        setNewName('');
        setNewNotes('');
        setNewRating(4);
        setNewImages([]);

        // Show Toast
        setToast({ show: true, message: 'Loaf officially documented.' });
        setTimeout(() => {
            setToast({ show: false, message: '' });
            setIsLogging(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-journal-bg text-ink-main font-sans selection:bg-crust selection:text-white pb-32 relative overflow-hidden">

            {/* Animated Premium Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sage-light/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-crust-light/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-ink-faint/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-blob" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Toast Notification */}
            <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="glass-card text-ink-main px-6 py-4 rounded-2xl shadow-toast flex items-center gap-3 border border-white/60">
                    <div className="bg-sage rounded-full p-1.5 text-white shadow-sm">
                        <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                    <span className="font-serif font-medium text-lg tracking-wide">{toast.message}</span>
                </div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-journal-bg/80 backdrop-blur-md border-b border-journal-border/50">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsLogging(false)}>
                        <div className="bg-ink-main p-2 rounded-xl text-journal-bg group-hover:bg-crust transition-colors">
                            <Wheat className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold tracking-tight text-ink-main group-hover:text-ink-muted transition-colors">
                            WildYeast
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 relative z-10 min-h-[80vh]">
                <AnimatePresence mode="wait">
                    {!isLogging ? (
                        <motion.div
                            key="journal"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-12"
                        >
                            <div className="flex items-end justify-between border-b-2 border-ink-main/10 pb-6 mb-8">
                                <div>
                                    <h2 className="text-5xl font-serif font-bold text-ink-main tracking-tight">Your Rituals</h2>
                                    <p className="text-ink-muted mt-3 text-lg font-serif italic">A chronicle of your sourdough journey.</p>
                                </div>
                            </div>

                            {loaves.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-24 glass-card rounded-3xl border border-dashed border-journal-border/80"
                                >
                                    <Wheat className="w-16 h-16 text-ink-faint mx-auto mb-6 opacity-40" />
                                    <h3 className="text-2xl font-serif font-medium text-ink-main mb-3">The canvas is blank</h3>
                                    <p className="text-ink-muted mb-8 text-lg">Every great baker starts with a single loaf.</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 gap-12">
                                    <AnimatePresence>
                                        {loaves.map((loaf, index) => (
                                            <motion.div
                                                key={loaf.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                                                className="glass-card rounded-[2rem] p-8 sm:p-10 transition-all duration-500 hover:shadow-float relative overflow-hidden group"
                                            >

                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                                                    <div>
                                                        <h3 className="text-3xl font-serif font-bold text-ink-main group-hover:text-crust transition-colors leading-tight mb-2">{loaf.name}</h3>
                                                        <span className="text-sm font-medium tracking-widest uppercase text-sage-dark">{loaf.date}</span>
                                                    </div>
                                                    <div className="flex gap-1 bg-journal-bg/50 p-2 rounded-full border border-journal-border/50">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-5 h-5 ${i < loaf.rating ? 'text-crust fill-crust drop-shadow-sm' : 'text-journal-border'}`} />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Image Gallery inline if they exist */}
                                                {loaf.images && loaf.images.length > 0 && (
                                                    <div className="flex gap-4 mb-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                                        {loaf.images.map((img, idx) => (
                                                            <div key={idx} className="min-w-[200px] w-64 aspect-square rounded-2xl overflow-hidden snap-center flex-shrink-0 border border-journal-border shadow-sm">
                                                                <img src={img} alt="Crumb shot" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-4 mb-8">
                                                    <div className="flex items-center gap-2 bg-white/80 text-ink-main px-4 py-2.5 rounded-xl text-sm font-medium border border-journal-border shadow-sm">
                                                        <Wheat className="w-4 h-4 text-crust" />
                                                        {loaf.math.flour}g
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/80 text-ink-main px-4 py-2.5 rounded-xl text-sm font-medium border border-journal-border shadow-sm">
                                                        <Droplets className="w-4 h-4 text-sage-dark" />
                                                        {loaf.math.waterHydration}%
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/80 text-ink-main px-4 py-2.5 rounded-xl text-sm font-medium border border-journal-border shadow-sm">
                                                        <Beaker className="w-4 h-4 text-ink-muted" />
                                                        {loaf.math.starterPercentage}% Starter
                                                    </div>
                                                </div>

                                                <p className="text-ink-main/90 text-lg leading-relaxed border-l-4 border-sage-light pl-6 group-hover:border-crust transition-colors font-serif italic">
                                                    "{loaf.notes}"
                                                </p>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="log"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="space-y-12 max-w-2xl mx-auto"
                        >
                            <div className="border-b-2 border-ink-main/10 pb-6 mb-8 flex justify-between items-end">
                                <div>
                                    <h2 className="text-5xl font-serif font-bold text-ink-main tracking-tight">Log New Loaf</h2>
                                    <p className="text-ink-muted mt-3 text-lg font-serif italic">The alchemy of flour, water, and time.</p>
                                </div>
                                <button
                                    onClick={() => setIsLogging(false)}
                                    className="text-ink-muted hover:text-ink-main font-medium uppercase tracking-widest text-sm transition-colors border-b border-transparent hover:border-ink-main pb-1"
                                >
                                    Cancel
                                </button>
                            </div>

                            <BakersMath data={mathData} onChange={setMathData} />

                            <div className="glass-card p-8 sm:p-12 rounded-[2.5rem] mt-8 relative overflow-hidden">

                                <h3 className="text-3xl font-serif font-bold text-ink-main mb-10 relative z-10 flex items-center gap-3">
                                    <BookOpen className="w-7 h-7 text-crust" />
                                    Journal Entry
                                </h3>

                                <div className="space-y-10 relative z-10">
                                    <div>
                                        <label className="block text-sm font-bold text-ink-muted mb-3 uppercase tracking-wider text-xs">Loaf Name</label>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="e.g. Rainy Day Rye"
                                            className="w-full bg-journal-bg/50 border-2 border-transparent border-b-journal-border rounded-t-2xl px-5 py-5 text-ink-main text-xl focus:outline-none focus:bg-white focus:border-b-crust focus:border-2 transition-all placeholder:text-ink-faint font-serif"
                                        />
                                    </div>

                                    <ImageUploader
                                        images={newImages}
                                        onChange={setNewImages}
                                        maxUploads={4}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs flex justify-between items-center">
                                            <span>Overall Rating</span>
                                            <span className="text-crust bg-crust/10 px-3 py-1 rounded-full font-serif text-sm">{newRating} / 5</span>
                                        </label>
                                        <div className="flex gap-3 justify-center bg-journal-bg/50 py-4 rounded-2xl border border-journal-border/50">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setNewRating(star)}
                                                    className="p-2 hover:scale-110 transition-transform focus:outline-none"
                                                >
                                                    <Star className={`w-10 h-10 ${newRating >= star ? 'text-crust fill-crust drop-shadow-md' : 'text-journal-border'}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-ink-muted mb-3 uppercase tracking-wider text-xs">Tasting Notes & Observations</label>
                                        <textarea
                                            rows={6}
                                            value={newNotes}
                                            onChange={(e) => setNewNotes(e.target.value)}
                                            placeholder="Describe the crumb, crust, scoring, and flavor profile..."
                                            className="w-full bg-journal-bg/50 border border-journal-border rounded-3xl px-6 py-5 text-ink-main focus:outline-none focus:bg-white focus:ring-4 focus:ring-crust/10 focus:border-crust transition-all resize-none shadow-inner text-lg leading-relaxed"
                                        ></textarea>
                                    </div>

                                    <div className="pt-8 border-t border-journal-border/80">
                                        <button
                                            onClick={handleSave}
                                            className="w-full bg-ink-main text-white font-serif italic text-xl py-6 rounded-full hover:bg-crust transition-colors shadow-subtle flex items-center justify-center gap-3 active:scale-[0.98] group"
                                        >
                                            Commit to Journal
                                            <BookOpen className="w-5 h-5 group-hover:block hidden" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Floating Action Button (FAB) */}
            <AnimatePresence>
                {!isLogging && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        onClick={() => setIsLogging(true)}
                        className="fixed bottom-10 right-8 sm:right-12 z-50 bg-crust text-white p-5 rounded-full shadow-fab hover:bg-crust-hover transition-colors duration-300 flex items-center justify-center group"
                        aria-label="Log new bread"
                    >
                        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2.5} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
