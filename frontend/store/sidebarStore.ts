import { create } from "zustand";

export interface TreeVideo {
  id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  locked: boolean;
}

export interface TreeSection {
  id: string;
  title: string;
  order_index: number;
  videos: TreeVideo[];
}

export interface SubjectTree {
  id: string;
  title: string;
  sections: TreeSection[];
}

interface SidebarState {
  tree: SubjectTree | null;
  loading: boolean;
  error: string | null;
  setTree: (tree: SubjectTree | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markVideoCompleted: (videoId: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  tree: null,
  loading: false,
  error: null,
  setTree: (tree) => set({ tree, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  markVideoCompleted: (videoId) =>
    set((state) => {
      if (!state.tree) return state;
      const newSections = state.tree.sections.map((section) => ({
        ...section,
        videos: section.videos.map((v) =>
          v.id === videoId ? { ...v, is_completed: true } : v
        ),
      }));
      return { tree: { ...state.tree, sections: newSections } };
    }),
}));
