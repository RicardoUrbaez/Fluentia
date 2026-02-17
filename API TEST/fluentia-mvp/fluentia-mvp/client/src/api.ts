import type {
  ChatMessage,
  DashboardResponse,
  EvaluationJSON,
  Lesson,
  Session,
  Topic,
  User
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body.error || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  createUser: (name: string, language = "Spanish") =>
    request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify({ name, language })
    }),
  getTopics: () => request<Topic[]>("/api/topics"),
  getLessons: (topicId?: number) =>
    request<Lesson[]>(`/api/lessons${topicId ? `?topicId=${topicId}` : ""}`),
  startSession: (payload: { userId: number; topicId: number; lessonId: number }) =>
    request<Session>("/api/session/start", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  sendChat: (payload: { sessionId: number; message: string }) =>
    request<{ assistantMessage: ChatMessage; evaluationJSON: EvaluationJSON }>("/api/chat/send", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getSessionMessages: (sessionId: number) => request<ChatMessage[]>(`/api/session/${sessionId}/messages`),
  getDashboard: (userId: number) => request<DashboardResponse>(`/api/dashboard/${userId}`)
};
