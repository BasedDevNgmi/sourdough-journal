import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import RitualButton from './RitualButton';
import BakersMath from './BakersMath';
import type { BakersMathData } from './BakersMath';
import ImageUploader from './ImageUploader';
import { TimelineSection } from './form/TimelineSection';
import { RatingsSection } from './form/RatingsSection';
import { useJournalStore } from '../store/useJournalStore';
import { useToastStore } from '../store/useToastStore';
import type { LoafRecord, FlourBlend, FermentationTimeline, LoafRatings } from '../types';

interface LoafFormProps {
    onComplete: () => void;
    initialData?: Partial<LoafRecord>;
    editId?: string;
}

export const LoafForm = ({ onComplete, initialData, editId }: LoafFormProps) => {
    const { addLoaf, updateLoaf } = useJournalStore();
    const { addToast } = useToastStore();

    // Form State
    const [name, setName] = useState(initialData?.name || '');
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [mathData, setMathData] = useState<BakersMathData>(initialData?.math || {
        flour: 500,
        waterHydration: 75,
        saltPercentage: 2,
        starterPercentage: 20
    });

    const [flours] = useState<FlourBlend[]>(initialData?.flours || [
        { name: 'Bread Flour', percentage: 100 }
    ]);

    const [timeline, setTimeline] = useState<FermentationTimeline>(initialData?.timeline || {
        autolyseDurationMins: 60,
        roomTempC: 22,
        bulkFermentationHours: 4,
        bulkDoughTempC: 24,
        coldRetardHours: 12,
        bakeCoveredMins: 20,
        bakeUncoveredMins: 20,
        bakeTempC: 250
    });

    // Starter state is now hardcoded in handleSave as per instruction
    // const [starter] = useState<StarterHealth>({
    //     peakStatus: 'Peak',
    //     feedingRatio: '1:2:2'
    // });

    const [ratings, setRatings] = useState<LoafRatings>(initialData?.ratings || {
        crumb: 0,
        crust: 0,
        ovenSpring: 0,
        flavor: 0,
        overall: 0
    });
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSave = async () => {
        if (!name.trim()) {
            addToast('Please provide a name for this loaf.', 'error');
            return;
        }

        const loafData: Partial<LoafRecord> = {
            name,
            math: mathData, // Use mathData here
            flours,
            timeline,
            starter: { peakStatus: 'Peak', feedingRatio: '1:1:1' }, // Hardcoded as per instruction
            ratings,
            notes,
            images
        };

        try {
            if (editId) {
                await updateLoaf(editId, loafData);
            } else {
                const newLoaf: LoafRecord = {
                    id: crypto.randomUUID(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    createdAt: Date.now(),
                    ...loafData
                } as LoafRecord;
                await addLoaf(newLoaf);
            }
            onComplete();
            addToast(editId ? 'Journal entry updated.' : 'Loaf committed to journal.', 'success');
        } catch (e) {
            console.error(e);
            addToast("Failed to save loaf. Check console.", 'error');
        }
    };

    const updateTimeline = (field: keyof FermentationTimeline, val: number) => {
        setTimeline(prev => ({ ...prev, [field]: val }));
    };

    const updateRating = (field: keyof LoafRatings, val: number) => {
        if (navigator.vibrate) navigator.vibrate(20);
        setRatings(prev => {
            const next = { ...prev, [field]: val };
            // Auto-calculate overall as average
            next.overall = Math.round((next.crumb + next.crust + next.ovenSpring + next.flavor) / 4);
            return next;
        });
    };

    return (
        <div className="space-y-16 max-w-5xl mx-auto">
            <BakersMath data={mathData} onChange={setMathData} />

            <div className="glass-card p-10 sm:p-16 rounded-[2.5rem] relative overflow-hidden">
                <h3 className="text-3xl font-serif font-bold text-ink-main mb-10 relative z-10 flex items-center gap-3">
                    <BookOpen className="w-7 h-7 text-crust" />
                    Journal Entry
                </h3>

                <div className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Left Column: Basic Info & Image */}
                        <div className="space-y-10">
                            <div>
                                <label className="block text-sm font-bold text-ink-muted mb-3 uppercase tracking-wider text-xs">Loaf Name</label>
                                <motion.input
                                    whileFocus={{ scale: 1.02, y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Rainy Day Rye"
                                    className="w-full bg-journal-bg/50 border-2 border-transparent border-b-journal-border rounded-t-2xl px-5 py-5 text-ink-main text-xl focus:outline-none focus:bg-white dark:focus:bg-journal-card focus:border-b-crust focus:border-2 transition-all placeholder:text-ink-faint font-serif shadow-sm"
                                />
                            </div>

                            <ImageUploader images={images} onChange={setImages} maxUploads={4} />

                            <RatingsSection ratings={ratings} updateRating={updateRating} />
                        </div>

                        {/* Right Column: Timeline, Ratings, Notes */}
                        <div className="space-y-10 h-full flex flex-col">
                            {/* Timeline & Temperature section */}
                            <TimelineSection timeline={timeline} updateTimeline={updateTimeline} />

                            <div className="flex-grow flex flex-col">
                                <label className="block text-sm font-bold text-ink-muted mb-3 uppercase tracking-wider text-xs">Tasting Notes & Observations</label>
                                <motion.textarea
                                    whileFocus={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Describe the crumb, crust, scoring, and flavor profile..."
                                    className="w-full flex-grow min-h-[150px] bg-journal-bg/50 border border-journal-border rounded-3xl px-6 py-5 text-ink-main focus:outline-none focus:bg-white dark:focus:bg-journal-card focus:ring-4 focus:ring-crust/10 focus:border-crust transition-all resize-none shadow-inner text-lg leading-relaxed font-serif"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-ink-main/10 flex justify-between items-center">
                        <button type="button" onClick={onComplete} className="text-ink-muted hover:text-ink-main font-sans text-sm tracking-widest uppercase transition-colors">Cancel</button>
                        <RitualButton onClick={handleSave} label={editId ? 'Save Changes' : 'Commit to Journal'} />
                    </div>
                </div>
            </div>
        </div>
    );
};
