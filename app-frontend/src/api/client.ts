const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type QueryValue = string | number | boolean | null | undefined;

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, QueryValue>;
};

async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, params } = options;

  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    }

    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, QueryValue>) =>
    apiClient<T>(endpoint, { params }),

  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    apiClient<T>(endpoint, { method: "POST", body, headers }),

  put: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: "DELETE" }),
};
