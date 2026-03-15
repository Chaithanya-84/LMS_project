import { apiFetch } from "./apiClient";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 5000;

export function sendProgressDebounced(
  videoId: string,
  lastPositionSeconds: number,
  isCompleted?: boolean,
  durationSeconds?: number
): void {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    debounceTimer = null;
    try {
      await apiFetch(`/api/progress/videos/${videoId}`, {
        method: "POST",
        body: JSON.stringify({
          last_position_seconds: lastPositionSeconds,
          is_completed: isCompleted,
          duration_seconds: durationSeconds,
        }),
      });
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, DEBOUNCE_MS);
}

export async function sendProgressImmediate(
  videoId: string,
  lastPositionSeconds: number,
  isCompleted: boolean,
  durationSeconds?: number
): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  try {
    await apiFetch(`/api/progress/videos/${videoId}`, {
      method: "POST",
      body: JSON.stringify({
        last_position_seconds: lastPositionSeconds,
        is_completed: isCompleted,
        duration_seconds: durationSeconds,
      }),
    });
  } catch (e) {
    console.error("Failed to save progress", e);
  }
}
