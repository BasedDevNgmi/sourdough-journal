import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeColor = 'original' | 'matcha' | 'lavender' | 'honey' | 'rose';
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
    bakerName: string;
    themeColor: ThemeColor;
    themeMode: ThemeMode;
    setBakerName: (name: string) => void;
    setThemeColor: (color: ThemeColor) => void;
    setThemeMode: (mode: ThemeMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            bakerName: '',
            themeColor: 'original',
            themeMode: 'system',
            setBakerName: (name) => set({ bakerName: name }),
            setThemeColor: (themeColor) => set({ themeColor }),
            setThemeMode: (themeMode) => set({ themeMode }),
        }),
        {
            name: 'proof-settings', // unique name for localStorage
        }
    )
);
