import { describe, it, expect, beforeEach } from 'vitest';
import { SourdoughDatabase, saveLoaf, getLoaves, saveStarterLog, getStarterLogs } from '../db';
import type { LoafRecord } from '../../types';

describe('Dexie Database Utils', () => {
    beforeEach(async () => {
        const db = new SourdoughDatabase();
        await db.loaves.clear();
        await db.starterLogs.clear();
    });

    it('can save and retrieve a loaf', async () => {
        const mockLoaf: LoafRecord = {
            id: 'test-1',
            name: 'Test Loaf',
            createdAt: Date.now(),
            date: 'Today',
            math: { flour: 500, waterHydration: 75, saltPercentage: 2, starterPercentage: 20 },
            flours: [],
            timeline: { autolyseDurationMins: 0, bulkFermentationHours: 0, roomTempC: 0, bulkDoughTempC: 0, coldRetardHours: 0, bakeCoveredMins: 0, bakeUncoveredMins: 0, bakeTempC: 0 },
            starter: { peakStatus: 'Peak', feedingRatio: '1:1:1' },
            ratings: { crumb: 0, crust: 0, flavor: 0, ovenSpring: 0, overall: 0 },
            notes: '',
            images: []
        };

        await saveLoaf(mockLoaf);
        const loaves = await getLoaves();

        expect(loaves.length).toBe(1);
        expect(loaves[0].name).toBe('Test Loaf');
    });

    it('can save starter logs', async () => {
        await saveStarterLog({
            id: 's-1',
            createdAt: 1234,
            feedRatio: '1:2:2',
            starterAmountG: 25,
            flourFedG: 50,
            waterFedG: 50,
            notes: ''
        });

        const logs = await getStarterLogs();
        expect(logs.length).toBe(1);
        expect(logs[0].feedRatio).toBe('1:2:2');
    });
});
