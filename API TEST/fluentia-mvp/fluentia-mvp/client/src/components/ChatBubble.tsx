import { Volume2 } from "lucide-react";
import type { ChatMessage } from "../types";

type ChatBubbleProps = {
  message: ChatMessage;
  helpMode: boolean;
};

const translationHints: Record<string, string> = {
  "¿de dónde eres?": "Where are you from?",
  "¿estás perdido?": "Are you lost?",
  "¿cómo estás?": "How are you?"
};

export const ChatBubble = ({ message, helpMode }: ChatBubbleProps) => {
  const isUser = message.role === "USER";

  const pronounce = () => {
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  const lower = message.content.toLowerCase();
  const hintTranslation = Object.entries(translationHints).find(([key]) => lower.includes(key))?.[1];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser ? "bg-indigo-500 text-white" : "bg-white text-slate-800"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        {!isUser && (
          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={pronounce}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100"
            >
              <Volume2 size={14} /> Pronounce
            </button>
            {helpMode && (
              <span className="text-xs text-slate-500">
                Hint: {hintTranslation || "Reply in short Spanish sentences using the lesson focus."}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
