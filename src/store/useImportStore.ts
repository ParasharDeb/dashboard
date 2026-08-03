import { create } from 'zustand';
import { IImportPreview } from '../types';
import { importService } from '../services/importService';

interface ImportState {
  preview: IImportPreview | null;
  selectedIds: Set<string>;
  parsing: boolean;
  committing: boolean;
  error: string | null;
  successSummary: any | null;

  setPreview: (preview: IImportPreview) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  parseSpreadsheet: (fileUri: string, fileName: string, fileType: string) => Promise<void>;
  parseBase64: (base64: string) => Promise<void>;
  commitSelected: () => Promise<void>;
  resetImport: () => void;
}

export const useImportStore = create<ImportState>((set, get) => ({
  preview: null,
  selectedIds: new Set<string>(),
  parsing: false,
  committing: false,
  error: null,
  successSummary: null,

  setPreview: (preview) => {
    // Select all valid record IDs by default
    const allValidIds = new Set<string>();
    Object.values(preview).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((record: any) => {
          if (record.isValid) allValidIds.add(record.id);
        });
      }
    });

    set({ preview, selectedIds: allValidIds, error: null, successSummary: null });
  },

  toggleSelection: (id) => {
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    });
  },

  selectAll: () => {
    const preview = get().preview;
    if (!preview) return;
    const allIds = new Set<string>();
    Object.values(preview).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((record: any) => allIds.add(record.id));
      }
    });
    set({ selectedIds: allIds });
  },

  deselectAll: () => {
    set({ selectedIds: new Set<string>() });
  },

  parseSpreadsheet: async (fileUri, fileName, fileType) => {
    set({ parsing: true, error: null, successSummary: null });
    try {
      const preview = await importService.parseSpreadsheetFile(fileUri, fileName, fileType);
      get().setPreview(preview);
      set({ parsing: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to parse spreadsheet', parsing: false });
    }
  },

  parseBase64: async (base64) => {
    set({ parsing: true, error: null, successSummary: null });
    try {
      const preview = await importService.parseBase64(base64);
      get().setPreview(preview);
      set({ parsing: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to parse spreadsheet', parsing: false });
    }
  },

  commitSelected: async () => {
    const { preview, selectedIds } = get();
    if (!preview) return;

    set({ committing: true, error: null });

    try {
      const payload: any = {
        todos: [],
        routines: [],
        nutrition: [],
        weight: [],
        birthdays: [],
      };

      preview.todos.filter((r) => selectedIds.has(r.id)).forEach((r) => payload.todos.push(r.data));
      preview.routines.filter((r) => selectedIds.has(r.id)).forEach((r) => payload.routines.push(r.data));
      preview.nutrition.filter((r) => selectedIds.has(r.id)).forEach((r) => payload.nutrition.push(r.data));
      preview.weight.filter((r) => selectedIds.has(r.id)).forEach((r) => payload.weight.push(r.data));
      preview.birthdays.filter((r) => selectedIds.has(r.id)).forEach((r) => payload.birthdays.push(r.data));

      const res = await importService.commitImport(payload);
      set({
        committing: false,
        successSummary: res.summary,
        preview: null,
        selectedIds: new Set<string>(),
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to commit imported data', committing: false });
    }
  },

  resetImport: () => {
    set({
      preview: null,
      selectedIds: new Set<string>(),
      parsing: false,
      committing: false,
      error: null,
      successSummary: null,
    });
  },
}));
