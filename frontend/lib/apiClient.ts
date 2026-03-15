import { API_BASE_URL } from "./config";
import { useAuthStore } from "@/store/authStore";

async function getAccessToken(): Promise<string | null> {
  return useAuthStore.getState().accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    useAuthStore.getState().logout();
    return null;
  }

  const data = await res.json();
  useAuthStore.getState().setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  let token = await getAccessToken();

  const doFetch = (t: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
        ...options.headers,
      },
      credentials: "include",
    });

  let res = await doFetch(token);

  if (res.status === 401 && token) {
    token = await refreshAccessToken();
    if (token) {
      res = await doFetch(token);
    }
  }

  return res;
}
