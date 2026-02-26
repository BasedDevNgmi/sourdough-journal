import { Thermometer, Clock, Target } from 'lucide-react';
import type { FermentationTimeline } from '../../types';

interface TimelineSectionProps {
    timeline: FermentationTimeline;
    updateTimeline: (field: keyof FermentationTimeline, val: number) => void;
}

export const TimelineSection = ({ timeline, updateTimeline }: TimelineSectionProps) => {
    return (
        <div className="bg-journal-bg/30 p-6 rounded-2xl border border-journal-border">
            <h4 className="font-serif font-bold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage-dark" />
                Timeline & Temperature
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase text-ink-muted mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3 text-sage-dark" /> Room Temp (°C)</label>
                    <input type="number" step="0.5" value={timeline.roomTempC} onChange={e => updateTimeline('roomTempC', Number(e.target.value))} className="w-full p-2 rounded-lg bg-white dark:bg-journal-card border border-journal-border" />
                </div>
                <div>
                    <label className="block text-xs uppercase text-ink-muted mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3 text-crust" /> Dough Temp (°C)</label>
                    <input type="number" step="0.5" value={timeline.bulkDoughTempC} onChange={e => updateTimeline('bulkDoughTempC', Number(e.target.value))} className="w-full p-2 rounded-lg bg-white dark:bg-journal-card border border-journal-border" />
                </div>
                <div>
                    <label className="block text-xs uppercase text-ink-muted mb-1">Bulk Duration (hrs)</label>
                    <input type="number" step="0.5" value={timeline.bulkFermentationHours} onChange={e => updateTimeline('bulkFermentationHours', Number(e.target.value))} className="w-full p-2 rounded-lg bg-white dark:bg-journal-card border border-journal-border" />
                </div>
                <div>
                    <label className="block text-xs uppercase text-ink-muted mb-1">Cold Retard (hrs)</label>
                    <input type="number" value={timeline.coldRetardHours} onChange={e => updateTimeline('coldRetardHours', Number(e.target.value))} className="w-full p-2 rounded-lg bg-white dark:bg-journal-card border border-journal-border" />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs uppercase text-ink-muted mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Bake Temp (°C)</label>
                    <input type="number" value={timeline.bakeTempC} onChange={e => updateTimeline('bakeTempC', Number(e.target.value))} className="w-full p-2 rounded-lg bg-white dark:bg-journal-card border border-journal-border" />
                </div>
            </div>
        </div>
    );
};
