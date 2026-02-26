import { create } from 'zustand';
import { supabase } from '../utils/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isInitialized: false,

    initialize: async () => {
        if (!supabase) {
            set({ isInitialized: true });
            return;
        }

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user || null, isInitialized: true });

        // Listen for changes
        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user || null });
        });
    },

    signOut: async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        set({ session: null, user: null });
    }
}));
