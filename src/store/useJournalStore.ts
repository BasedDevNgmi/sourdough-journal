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
            const data = await getLoaves();
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
            await get().loadLoaves();
        } catch (error) {
            console.error("Failed to clear database", error);
            throw error;
        }
    }
}));
