import { create } from 'zustand';
import type { LoafRecord } from '../types';
import { getLoaves, saveLoaf, deleteLoaf as dbDelete, clearDatabase } from '../utils/db';

interface JournalState {
    loaves: LoafRecord[];
    isLoaded: boolean;
    loadLoaves: () => Promise<void>;
    addLoaf: (loaf: LoafRecord) => Promise<void>;
    updateLoaf: (id: string, loaf: Partial<LoafRecord>) => Promise<void>;
    removeLoaf: (id: string) => Promise<void>;
    clearAllLoaves: () => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
    loaves: [],
    isLoaded: false,

    loadLoaves: async () => {
        try {
            let data = await getLoaves();

            // Seed some premium mock data if empty OR if the old mock data is present without images
            if (data.length === 0 || (data.length > 0 && data[0].id.startsWith('seed-') && (!data[0].images || data[0].images.length === 0))) {

                // If it's the old mock data, clear the DB first to prevent duplicates, then `clearAllLoaves` will call `loadLoaves` again.
                if (data.length > 0) {
                    await get().clearAllLoaves();
                    return;
                }

                const mockLoaves: LoafRecord[] = [
                    {
                        id: 'seed-1',
                        name: 'Einkorn & Spelt Country Loaf',
                        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        createdAt: Date.now() - 86400000 * 2,
                        math: { flour: 1000, waterHydration: 85, saltPercentage: 2.2, starterPercentage: 20 },
                        flours: [{ name: 'Bread Flour', percentage: 80 }, { name: 'Spelt', percentage: 10 }, { name: 'Einkorn', percentage: 10 }],
                        timeline: { autolyseDurationMins: 120, bulkFermentationHours: 5.5, bulkDoughTempC: 25.5, coldRetardHours: 18, bakeCoveredMins: 20, bakeUncoveredMins: 25, bakeTempC: 260 },
                        starter: { peakStatus: 'Peak', feedingRatio: '1:4:4' },
                        ratings: { crumb: 5, crust: 5, ovenSpring: 4, flavor: 5, overall: 5 },
                        notes: 'An absolute revelation. The extended autolyse yielded a deeply extensible dough. The blisters on the crust are profound, and the flavor profile is wildly complex—deep caramel notes with a sharp lactic tang.',
                        images: ['https://images.unsplash.com/photo-1589367920969-ab8e050bf0ef?q=80&w=800&auto=format&fit=crop']
                    },
                    {
                        id: 'seed-2',
                        name: 'Toasted Walnut Rye',
                        date: new Date(Date.now() - 86400000 * 7).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        createdAt: Date.now() - 86400000 * 7,
                        math: { flour: 800, waterHydration: 78, saltPercentage: 2.0, starterPercentage: 15 },
                        flours: [{ name: 'Type 85', percentage: 70 }, { name: 'Dark Rye', percentage: 30 }],
                        timeline: { autolyseDurationMins: 60, roomTempC: 21, bulkFermentationHours: 6, bulkDoughTempC: 24, coldRetardHours: 14, bakeCoveredMins: 20, bakeUncoveredMins: 20, bakeTempC: 250 },
                        starter: { peakStatus: 'Falling', feedingRatio: '1:1:1' },
                        ratings: { crumb: 4, crust: 4, ovenSpring: 3, flavor: 5, overall: 4 },
                        notes: 'Laminated toasted walnuts during the second fold. The dough structure suffered slightly from the heavy inclusions, resulting in a tighter crumb, but the rustic flavor is incredible. Deep purple hue from the walnuts.',
                        images: ['https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop']
                    }
                ];
                for (const mock of mockLoaves) {
                    await saveLoaf(mock);
                }
                data = await getLoaves();
            }

            // Patch any existing broken mock data URLs in the user's IndexedDB
            let needsSave = false;
            const patchedData = data.map(loaf => {
                if (loaf.id === 'seed-1' && loaf.images?.[0] === '/mock-country.png') {
                    needsSave = true;
                    return { ...loaf, images: ['https://images.unsplash.com/photo-1589367920969-ab8e050bf0ef?q=80&w=800&auto=format&fit=crop'] };
                }
                if (loaf.id === 'seed-2' && loaf.images?.[0] === '/mock-rye.png') {
                    needsSave = true;
                    return { ...loaf, images: ['https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop'] };
                }
                return loaf;
            });

            if (needsSave) {
                for (const loaf of patchedData) {
                    await saveLoaf(loaf);
                }
                data = patchedData;
            }

            set({ loaves: data, isLoaded: true });
        } catch (error) {
            console.error("Failed to load loaves from IndexedDB", error);
            set({ isLoaded: true });
        }
    },

    addLoaf: async (loaf: LoafRecord) => {
        try {
            await saveLoaf(loaf);
            // Re-fetch to ensure order is maintained by DB, or prepend locally
            set((state) => ({ loaves: [loaf, ...state.loaves].sort((a, b) => b.createdAt - a.createdAt) }));
        } catch (error) {
            console.error("Failed to save loaf", error);
            throw error;
        }
    },

    updateLoaf: async (id: string, updates: Partial<LoafRecord>) => {
        try {
            const currentLoaves = get().loaves;
            const targetLoaf = currentLoaves.find(l => l.id === id);
            if (!targetLoaf) throw new Error("Loaf not found to update");

            const updatedLoaf = { ...targetLoaf, ...updates };
            await saveLoaf(updatedLoaf);

            set((state) => ({
                loaves: state.loaves.map((l: LoafRecord) => l.id === id ? updatedLoaf as LoafRecord : l)
            }));
        } catch (error) {
            console.error("Failed to update loaf", error);
            throw error;
        }
    },

    removeLoaf: async (id: string) => {
        try {
            await dbDelete(id);
            set((state) => ({ loaves: state.loaves.filter(l => l.id !== id) }));
        } catch (error) {
            console.error("Failed to delete loaf", error);
            throw error;
        }
    },

    clearAllLoaves: async () => {
        try {
            await clearDatabase();
            set({ loaves: [] });
            // Immediately reload to trigger the mock data seeding
            await get().loadLoaves();
        } catch (error) {
            console.error("Failed to clear database", error);
            throw error;
        }
    }
}));
