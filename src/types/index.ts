import type { BakersMathData } from '../components/BakersMath';

export interface FlourBlend {
    name: string;
    percentage: number;
}

export interface LoafRatings {
    crumb: number;
    crust: number;
    ovenSpring: number;
    flavor: number;
    overall: number; // Derived or manual
}

export interface StarterHealth {
    peakStatus: 'Rising' | 'Peak' | 'Falling' | 'Unfed';
    feedingRatio: string; // e.g., '1:2:2'
}

export interface FermentationTimeline {
    autolyseDurationMins?: number;
    roomTempC?: number; // Ambient temperature is crucial for wild yeast
    bulkFermentationHours?: number;
    bulkDoughTempC?: number; // Default to Celsius for precision, format can be handled in UI
    coldRetardHours?: number;
    bakeCoveredMins: number;
    bakeUncoveredMins: number;
    bakeTempC: number;
}

export interface LoafRecord {
    id: string;
    name: string;
    date: string; // ISO String is better for sorting, but we'll stick to string for compatibility or use Date
    createdAt: number; // Timestamp for sorting
    math: BakersMathData;
    flours: FlourBlend[]; // Replaces generic 'flour' note
    timeline: FermentationTimeline;
    starter: StarterHealth;
    ratings: LoafRatings;
    notes: string;
    images: string[]; // Base64 or Blob URLs depending on storage resolution
}
