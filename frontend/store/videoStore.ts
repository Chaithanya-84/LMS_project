import { create } from "zustand";

interface VideoState {
  currentVideoId: string | null;
  subjectId: string | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isCompleted: boolean;
  nextVideoId: string | null;
  prevVideoId: string | null;
  setCurrentVideo: (videoId: string, subjectId: string, nextId: string | null, prevId: string | null) => void;
  setProgress: (currentTime: number, duration: number) => void;
  setPlaying: (playing: boolean) => void;
  setCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,
  setCurrentVideo: (videoId, subjectId, nextId, prevId) =>
    set({
      currentVideoId: videoId,
      subjectId,
      nextVideoId: nextId,
      prevVideoId: prevId,
      isCompleted: false,
    }),
  setProgress: (currentTime, duration) => set({ currentTime, duration }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCompleted: (isCompleted) => set({ isCompleted }),
  reset: () =>
    set({
      currentVideoId: null,
      subjectId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
    }),
}));
