import { createClient } from '@supabase/supabase-js';
import type { LoafRecord, StarterLogRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export const isCloudSyncConfigured = () => !!supabase;

// Helper to sanitize undefined to null for JSONB
const sanitizeForJsonb = <T extends object>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj, (_key, value) => value === undefined ? null : value));
};

export async function syncLoafToCloud(loaf: LoafRecord) {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Convert to DB snake_case format
    const dbRecord = {
        id: loaf.id,
        name: loaf.name,
        date: loaf.date,
        created_at: loaf.createdAt,
        math: sanitizeForJsonb(loaf.math),
        flours: sanitizeForJsonb(loaf.flours),
        timeline: sanitizeForJsonb(loaf.timeline),
        starter: sanitizeForJsonb(loaf.starter),
        ratings: sanitizeForJsonb(loaf.ratings),
        notes: loaf.notes || null,
        images: loaf.images || []
    };

    const { error } = await supabase.from('loaves').upsert(dbRecord);
    if (error) {
        console.error('Failed to sync loaf to cloud:', error);
        throw error;
    }
}

export async function deleteLoafFromCloud(id: string) {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from('loaves').delete().eq('id', id);
    if (error) {
        console.error('Failed to delete loaf from cloud:', error);
        throw error;
    }
}

export async function syncStarterLogToCloud(log: StarterLogRecord) {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const dbRecord = {
        id: log.id,
        created_at: log.createdAt,
        feed_ratio: log.feedRatio,
        starter_amount_g: log.starterAmountG,
        flour_fed_g: log.flourFedG,
        water_fed_g: log.waterFedG,
        notes: log.notes || null
    };

    const { error } = await supabase.from('starter_logs').upsert(dbRecord);
    if (error) {
        console.error('Failed to sync starter log to cloud:', error);
        throw error;
    }
}

export async function fetchAllCloudLoaves(): Promise<LoafRecord[]> {
    if (!supabase) return [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Authentication required to fetch from cloud.");

    const { data, error } = await supabase.from('loaves').select('*');
    if (error) throw error;
    if (!data) return [];

    return data.map(dbRecord => ({
        id: dbRecord.id,
        name: dbRecord.name,
        date: dbRecord.date,
        createdAt: dbRecord.created_at,
        math: dbRecord.math,
        flours: dbRecord.flours,
        timeline: dbRecord.timeline,
        starter: dbRecord.starter,
        ratings: dbRecord.ratings,
        notes: dbRecord.notes || '',
        images: dbRecord.images || []
    }));
}

export async function fetchAllCloudStarterLogs(): Promise<StarterLogRecord[]> {
    if (!supabase) return [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Authentication required to fetch from cloud.");

    const { data, error } = await supabase.from('starter_logs').select('*');
    if (error) throw error;
    if (!data) return [];

    return data.map(dbRecord => ({
        id: dbRecord.id,
        createdAt: dbRecord.created_at,
        feedRatio: dbRecord.feed_ratio,
        starterAmountG: dbRecord.starter_amount_g,
        flourFedG: dbRecord.flour_fed_g,
        waterFedG: dbRecord.water_fed_g,
        notes: dbRecord.notes || ''
    }));
}
