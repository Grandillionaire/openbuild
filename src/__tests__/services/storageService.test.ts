import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { storageService, type Project } from '@/services/storageService';
import { useEditorStore } from '@/stores/editor';

/** Reach the private autoSave the 30s timer calls. */
function autoSave(): Promise<void> {
  return (storageService as unknown as { autoSave(): Promise<void> }).autoSave();
}

describe('StorageService auto-save', () => {
  let table: { get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    setActivePinia(createPinia());
    // happy-dom leaves `localStorage` as a bare object without the Storage API.
    Object.defineProperty(globalThis, 'localStorage', {
      value: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      configurable: true,
    });
    table = { get: vi.fn(), put: vi.fn() };
    (storageService as unknown as { projects: unknown }).projects = table;
    const store = useEditorStore();
    store.addComponent('heading');
  });

  it('preserves createdAt and increments the version instead of resetting them', async () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    table.get.mockResolvedValue({ id: 'p', name: 'p', components: [], createdAt, version: 7 });

    await autoSave();

    const saved = table.put.mock.calls[0][0] as Project;
    expect(saved.createdAt).toBe(createdAt);
    expect(saved.version).toBe(8);
  });

  it('does not reject when the underlying save fails', async () => {
    table.get.mockResolvedValue(undefined);
    table.put.mockRejectedValue(new DOMException('quota', 'QuotaExceededError'));

    await expect(autoSave()).resolves.toBeUndefined();
  });
});
