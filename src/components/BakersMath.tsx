import { Scale, Droplets, Wheat, Beaker } from 'lucide-react';

export interface BakersMathData {
    flour: number;
    waterHydration: number;
    saltPercentage: number;
    starterPercentage: number;
}

interface BakersMathProps {
    data: BakersMathData;
    onChange: (data: BakersMathData) => void;
}

const BakersMath = ({ data, onChange }: BakersMathProps) => {
    const { flour, waterHydration, saltPercentage, starterPercentage } = data;

    const waterStr = (flour * (waterHydration / 100)).toFixed(0);
    const saltStr = (flour * (saltPercentage / 100)).toFixed(1);
    const starterStr = (flour * (starterPercentage / 100)).toFixed(0);

    const updateField = (field: keyof BakersMathData, value: number) => {
        onChange({ ...data, [field]: value });
    };

    const inputClasses = "bg-transparent text-right font-serif text-xl text-ink-main w-20 outline-none focus:text-crust transition-colors p-0 border-b border-dashed border-transparent focus:border-crust focus:pb-1";

    return (
        <div className="bg-white p-8 rounded-3xl border border-journal-border shadow-subtle w-full mx-auto relative overflow-hidden">
            <h3 className="text-xl font-serif font-bold text-ink-main mb-6 flex items-center gap-2">
                <Scale className="w-5 h-5 text-ink-muted" />
                Baker's Formula
            </h3>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-journal-bg pb-3 group transition-colors">
                    <label className="flex items-center gap-2 text-ink-muted font-medium uppercase tracking-wider text-xs">
                        <Wheat className="w-4 h-4 text-ink-faint hidden sm:block" /> Total Flour
                    </label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            value={flour}
                            onChange={(e) => updateField('flour', Number(e.target.value))}
                            className={inputClasses}
                        />
                        <span className="text-ink-faint font-serif text-sm">g</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-journal-bg dark:border-journal-border/20 pb-4 group transition-colors gap-2 sm:gap-0">
                    <label className="flex items-center gap-2 text-ink-muted font-medium uppercase tracking-wider text-xs">
                        <Droplets className="w-4 h-4 text-ink-faint hidden sm:block" /> Hydration
                    </label>
                    <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                        {/* Bi-directional Grams Input */}
                        <div className="flex items-center gap-1 bg-white dark:bg-journal-border/20 px-3 py-1.5 rounded-xl border border-journal-border shadow-sm focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={waterStr}
                                onChange={(e) => updateField('waterHydration', (Number(e.target.value) / flour) * 100)}
                                className="bg-transparent text-right font-serif text-lg text-ink-main w-14 outline-none placeholder:text-ink-faint"
                            />
                            <span className="text-sm text-ink-muted font-serif">g</span>
                        </div>
                        {/* Percentage Input */}
                        <div className="flex items-center gap-1 bg-sage-light/30 dark:bg-sage-dark/20 px-3 py-1.5 rounded-xl border border-sage-light dark:border-sage-dark focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={waterHydration}
                                onChange={(e) => updateField('waterHydration', Number(e.target.value))}
                                className="bg-transparent text-right font-serif text-lg text-sage-dark dark:text-sage-light w-12 outline-none transition-colors"
                            />
                            <span className="text-sage-dark dark:text-sage-light font-serif">%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-journal-bg dark:border-journal-border/20 pb-4 group transition-colors gap-2 sm:gap-0">
                    <label className="flex items-center gap-2 text-ink-muted font-medium uppercase tracking-wider text-xs">
                        <Beaker className="w-4 h-4 text-ink-faint hidden sm:block" /> Starter
                    </label>
                    <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                        <div className="flex items-center gap-1 bg-white dark:bg-journal-border/20 px-3 py-1.5 rounded-xl border border-journal-border shadow-sm focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={starterStr}
                                onChange={(e) => updateField('starterPercentage', (Number(e.target.value) / flour) * 100)}
                                className="bg-transparent text-right font-serif text-lg text-ink-main w-14 outline-none placeholder:text-ink-faint"
                            />
                            <span className="text-sm text-ink-muted font-serif">g</span>
                        </div>
                        <div className="flex items-center gap-1 bg-sage-light/30 dark:bg-sage-dark/20 px-3 py-1.5 rounded-xl border border-sage-light dark:border-sage-dark focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={starterPercentage}
                                onChange={(e) => updateField('starterPercentage', Number(e.target.value))}
                                className="bg-transparent text-right font-serif text-lg text-sage-dark dark:text-sage-light w-12 outline-none transition-colors"
                            />
                            <span className="text-sage-dark dark:text-sage-light font-serif">%</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-journal-bg dark:border-journal-border/20 pb-4 group transition-colors gap-2 sm:gap-0">
                    <label className="flex items-center gap-2 text-ink-muted font-medium uppercase tracking-wider text-xs opacity-80">
                        Salt
                    </label>
                    <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
                        <div className="flex items-center gap-1 bg-white dark:bg-journal-border/20 px-3 py-1.5 rounded-xl border border-journal-border shadow-sm focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={saltStr}
                                step="0.5"
                                onChange={(e) => updateField('saltPercentage', (Number(e.target.value) / flour) * 100)}
                                className="bg-transparent text-right font-serif text-lg text-ink-main w-14 outline-none placeholder:text-ink-faint"
                            />
                            <span className="text-sm text-ink-muted font-serif">g</span>
                        </div>
                        <div className="flex items-center gap-1 bg-sage-light/30 dark:bg-sage-dark/20 px-3 py-1.5 rounded-xl border border-sage-light dark:border-sage-dark focus-within:border-crust focus-within:ring-1 focus-within:ring-crust transition-all">
                            <input
                                type="number"
                                value={saltPercentage}
                                step="0.1"
                                onChange={(e) => updateField('saltPercentage', Number(e.target.value))}
                                className="bg-transparent text-right font-serif text-lg text-sage-dark dark:text-sage-light w-12 outline-none transition-colors"
                            />
                            <span className="text-sage-dark dark:text-sage-light font-serif">%</span>
                        </div>
                    </div>
                </div>

                <div className="pt-3 flex justify-between items-end bg-journal-bg/50 p-5 rounded-2xl border border-journal-border/50">
                    <span className="text-xs uppercase tracking-widest text-ink-main/70 font-semibold mb-1">Total Dough Weight</span>
                    <span className="font-serif text-3xl text-ink-main font-bold">
                        {(flour + Number(waterStr) + Number(saltStr) + Number(starterStr)).toFixed(0)} <span className="text-base text-ink-faint font-normal">g</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BakersMath;
