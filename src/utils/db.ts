import Dexie, { type Table } from 'dexie';
import type { LoafRecord, StarterLogRecord } from '../types';
import { isCloudSyncConfigured, syncLoafToCloud, deleteLoafFromCloud, syncStarterLogToCloud } from './supabase';

export class SourdoughDatabase extends Dexie {
    loaves!: Table<LoafRecord, string>;
    starterLogs!: Table<StarterLogRecord, string>;

    constructor() {
        super('WildYeast_DB');
        // We must preserve existing stores and bump version if adding new tables
        this.version(2).stores({
            loaves: 'id, createdAt',
            starterLogs: 'id, createdAt'
        });
    }
}

const db = new SourdoughDatabase();

export const initDB = async () => db;

export const saveLoaf = async (loaf: LoafRecord) => {
    await db.loaves.put(loaf);
    if (isCloudSyncConfigured()) {
        syncLoafToCloud(loaf).catch(e => console.warn('Background sync failed:', e));
    }
};

export const getLoaves = async (): Promise<LoafRecord[]> => {
    const allLoaves = await db.loaves.orderBy('createdAt').reverse().toArray();
    return allLoaves;
};

export const deleteLoaf = async (id: string) => {
    await db.loaves.delete(id);
    if (isCloudSyncConfigured()) {
        deleteLoafFromCloud(id).catch(e => console.warn('Background delete failed:', e));
    }
};

export const clearDatabase = async () => {
    await db.loaves.clear();
    await db.starterLogs.clear();
};

export const saveStarterLog = async (log: StarterLogRecord) => {
    await db.starterLogs.put(log);
    if (isCloudSyncConfigured()) {
        // Type conversion to ensure compatibility with Supabase helper
        const baseLog = {
            id: log.id,
            createdAt: log.createdAt,
            feedRatio: log.feedRatio,
            starterAmountG: log.starterAmountG,
            flourFedG: log.flourFedG,
            waterFedG: log.waterFedG,
            notes: log.notes
        };
        syncStarterLogToCloud(baseLog).catch(e => console.warn('Background sync failed:', e));
    }
};

export const getStarterLogs = async (): Promise<StarterLogRecord[]> => {
    return await db.starterLogs.orderBy('createdAt').reverse().toArray();
};

export const exportDatabase = async (): Promise<string> => {
    const loaves = await db.loaves.toArray();
    const starterLogs = await db.starterLogs.toArray();
    const data = { loaves, starterLogs, exportDate: new Date().toISOString() };
    return JSON.stringify(data);
};

export const importDatabase = async (jsonString: string): Promise<void> => {
    const data = JSON.parse(jsonString);
    if (!data.loaves) throw new Error("Invalid export format");

    await db.transaction('rw', db.loaves, db.starterLogs, async () => {
        if (data.loaves && Array.isArray(data.loaves)) {
            await db.loaves.bulkPut(data.loaves);
        }
        if (data.starterLogs && Array.isArray(data.starterLogs)) {
            await db.starterLogs.bulkPut(data.starterLogs);
        }
    });
};
