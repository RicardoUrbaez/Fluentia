import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { LessonCard } from "../components/LessonCard";
import { TopicCard } from "../components/TopicCard";
import type { Lesson, Topic } from "../types";

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getTopics().then(setTopics).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!selectedTopic) {
      return;
    }

    api
      .getLessons(selectedTopic.id)
      .then((data) => {
        setLessons(data);
        setSelectedLesson(data[0] || null);
      })
      .catch((err) => setError(err.message));
  }, [selectedTopic]);

  const submit = async () => {
    if (!name.trim() || !selectedTopic || !selectedLesson) {
      setError("Please complete all selections.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const user = await api.createUser(name.trim(), "Spanish");
      localStorage.setItem("fluentia_user", JSON.stringify(user));
      navigate(`/lesson/${selectedLesson.id}`, {
        state: { topic: selectedTopic, lesson: selectedLesson, user }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Onboarding</h1>
      <p className="mt-2 text-slate-600">Choose Spanish + one topic and lesson to begin practice.</p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="text-sm font-medium text-slate-700">Username</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your username"
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-200 transition focus:ring"
        />
        <p className="mt-2 text-sm text-slate-500">Language for MVP: Spanish</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            selected={selectedTopic?.id === topic.id}
            onSelect={setSelectedTopic}
          />
        ))}
      </div>

      {selectedTopic && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold text-slate-800">Choose a lesson in {selectedTopic.name}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                selected={selectedLesson?.id === lesson.id}
                onSelect={setSelectedLesson}
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={submit}
        className="mt-8 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {saving ? "Creating..." : "Continue to Lesson"}
      </button>
    </div>
  );
};
