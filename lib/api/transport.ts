export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: unknown,
    public readonly requestId?: string,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

export async function request<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 15_000);
  try {
    const response = await fetch(`/api/${endpoint.replace(/^\//, "")}`, {
      ...options, headers, credentials: "include", signal: controller.signal, cache: "no-store",
    });
    const retryHeader = response.headers.get("Retry-After");
    const retryAfter = retryHeader === null ? undefined : /^\d+$/.test(retryHeader)
      ? Number(retryHeader) : Math.max(0, Math.ceil((Date.parse(retryHeader) - Date.now()) / 1000));
    const payload: unknown = response.status === 204 ? undefined : await response.json().catch(() => undefined);
    const data = record(payload);
    if (!response.ok) {
      throw new ApiError(
        typeof data.message === "string" ? data.message : "The request could not be completed.",
        response.status,
        typeof data.code === "string" ? data.code : undefined,
        data.errors,
        response.headers.get("X-Request-ID") ?? (typeof data.requestId === "string" ? data.requestId : undefined),
        Number.isFinite(retryAfter) ? retryAfter : undefined,
      );
    }
    if (payload === undefined && response.status !== 204) {
      throw new ApiError("The server returned an unreadable response.", response.status, "INVALID_RESPONSE");
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) {
      throw new ApiError(options.signal?.aborted ? "Request cancelled." : "The request timed out. Please try again.", 0,
        options.signal?.aborted ? "ABORTED" : "TIMEOUT");
    }
    throw new ApiError("Unable to reach the server. Please check your connection.", 0, "NETWORK_ERROR");
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}
