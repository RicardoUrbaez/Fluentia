import confetti from "canvas-confetti";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { api } from "../api";
import { ChatBubble } from "../components/ChatBubble";
import { FeedbackPanel } from "../components/FeedbackPanel";
import type { ChatMessage, EvaluationJSON, Lesson, Session } from "../types";

type NavState = {
  lesson?: Lesson;
  session?: Session;
};

export const PracticePage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const state = location.state as NavState | null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpMode, setHelpMode] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationJSON | null>(null);
  const [error, setError] = useState<string | null>(null);

  const id = useMemo(() => Number(sessionId || state?.session?.id), [sessionId, state?.session?.id]);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      return;
    }

    api
      .getSessionMessages(id)
      .then(setMessages)
      .catch((err) => setError(err.message));
  }, [id]);

  const send = async () => {
    if (!input.trim() || !id) return;

    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      role: "USER",
      content: input.trim()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await api.sendChat({
        sessionId: id,
        message: optimisticMessage.content
      });

      setMessages((prev) => [...prev, response.assistantMessage]);
      setEvaluation(response.evaluationJSON);

      const total =
        response.evaluationJSON.grammar +
        response.evaluationJSON.vocabulary +
        response.evaluationJSON.fluency +
        response.evaluationJSON.taskCompletion;

      if (total >= 16) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Practice with AI</h1>
            <p className="text-sm text-slate-500">Stay on topic and respond in Spanish.</p>
          </div>
          <button
            type="button"
            onClick={() => setHelpMode((prev) => !prev)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              helpMode ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Help {helpMode ? "On" : "Off"}
          </button>
        </div>

        <div className="h-[58vh] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">Send a first message to begin the roleplay conversation.</p>
          )}
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} helpMode={helpMode} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
              <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
              AI is typing...
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void send();
              }
            }}
            placeholder="Write your Spanish response..."
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 transition focus:ring"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void send()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </section>

      <FeedbackPanel evaluation={evaluation} />
    </div>
  );
};
