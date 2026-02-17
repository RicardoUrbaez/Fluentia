import { Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import type { Lesson, Topic, User } from "../types";

type NavState = {
  lesson?: Lesson;
  topic?: Topic;
  user?: User;
};

export const LessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lessonId } = useParams();
  const state = location.state as NavState | null;

  const [lesson, setLesson] = useState<Lesson | null>(state?.lesson || null);
  const [loading, setLoading] = useState(!state?.lesson);
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C">>({});
  const [error, setError] = useState<string | null>(null);

  const currentUser = useMemo(() => {
    if (state?.user) return state.user;
    const raw = localStorage.getItem("fluentia_user");
    return raw ? (JSON.parse(raw) as User) : null;
  }, [state?.user]);

  useEffect(() => {
    if (state?.lesson || !lessonId) {
      return;
    }

    setLoading(true);
    api
      .getLessons()
      .then((items) => {
        const found = items.find((item) => item.id === Number(lessonId)) || null;
        setLesson(found);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lessonId, state?.lesson]);

  const pronounce = () => {
    if (!lesson) return;
    const utterance = new SpeechSynthesisUtterance(lesson.listeningText);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  const startPractice = async () => {
    if (!lesson || !currentUser) {
      setError("Please finish onboarding first.");
      return;
    }

    const session = await api.startSession({
      userId: currentUser.id,
      topicId: lesson.topicId,
      lessonId: lesson.id
    });

    navigate(`/practice/${session.id}`, {
      state: { lesson, session, user: currentUser }
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-56 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (!lesson) {
    return <div className="p-8 text-red-600">Lesson not found.</div>;
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
      <p className="mt-2 text-slate-600">{lesson.skillFocus}</p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Reading Passage</h2>
        <p className="mt-3 text-slate-700">{lesson.readingPassage}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Listening</h2>
        <p className="mt-3 text-slate-700">{lesson.listeningText}</p>
        <button
          type="button"
          onClick={pronounce}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
        >
          <Volume2 size={16} /> Play pronunciation
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Vocabulary</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lesson.vocabItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-3">
              <img src={item.imageUrl} alt={item.word} className="h-24 w-full rounded-lg object-cover" />
              <p className="mt-2 font-medium text-slate-800">{item.word}</p>
              <p className="text-sm text-slate-500">{item.english}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Quick Practice</h2>
        <div className="mt-3 space-y-4">
          {lesson.questions.map((question, index) => (
            <div key={question.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-700">
                {index + 1}. {question.question}
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {(["A", "B", "C"] as const).map((optionKey) => {
                  const text =
                    optionKey === "A" ? question.optionA : optionKey === "B" ? question.optionB : question.optionC;
                  const selected = answers[question.id] === optionKey;
                  return (
                    <button
                      key={optionKey}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: optionKey }))}
                      className={`rounded-lg border px-2 py-2 text-sm transition ${
                        selected ? "border-indigo-400 bg-indigo-50" : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {optionKey}. {text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={startPractice}
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Practice with AI
      </button>
    </div>
  );
};
