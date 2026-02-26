import { Star } from 'lucide-react';
import type { LoafRatings } from '../../types';

interface RatingsSectionProps {
    ratings: LoafRatings;
    updateRating: (field: keyof LoafRatings, val: number) => void;
}

export const RatingsSection = ({ ratings, updateRating }: RatingsSectionProps) => {
    return (
        <div>
            <label className="block text-sm font-bold text-ink-muted mb-4 uppercase tracking-wider text-xs">Sensory Evolution</label>
            <div className="space-y-3 bg-journal-bg/50 p-6 rounded-2xl border border-journal-border/50">
                {(['crumb', 'crust', 'ovenSpring', 'flavor'] as const).map(feature => (
                    <div key={feature} className="flex items-center justify-between">
                        <span className="capitalize font-serif text-ink-main">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => updateRating(feature, star)}
                                    className="focus:outline-none"
                                >
                                    <Star className={`w-5 h-5 ${ratings[feature] >= star ? 'text-crust fill-crust' : 'text-journal-border'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
