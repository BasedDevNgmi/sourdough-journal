import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { LoafRecord } from '../types';

interface SourdoughDB extends DBSchema {
    loaves: {
        key: string;
        value: LoafRecord;
        indexes: { 'by-date': number };
    };
}

const DB_NAME = 'WildYeast_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<SourdoughDB>> | null = null;

export const initDB = async () => {
    if (!dbPromise) {
        dbPromise = openDB<SourdoughDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                const store = db.createObjectStore('loaves', { keyPath: 'id' });
                store.createIndex('by-date', 'createdAt');
            },
        });
    }
    return dbPromise;
};

export const saveLoaf = async (loaf: LoafRecord) => {
    const db = await initDB();
    await db.put('loaves', loaf);
};

export const getLoaves = async (): Promise<LoafRecord[]> => {
    const db = await initDB();
    // Get all loaves and sort by createdAt descending
    const allLoaves = await db.getAllFromIndex('loaves', 'by-date');
    return allLoaves.sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteLoaf = async (id: string) => {
    const db = await initDB();
    await db.delete('loaves', id);
};

export const clearDatabase = async () => {
    const db = await initDB();
    await db.clear('loaves');
};
