import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { ProgressCharts } from "../components/ProgressCharts";
import type { DashboardResponse, User } from "../types";

export const DashboardPage = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useMemo(() => {
    const raw = localStorage.getItem("fluentia_user");
    return raw ? (JSON.parse(raw) as User) : null;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    api
      .getDashboard(user.id)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-slate-700">No user found. Complete onboarding first.</p>
        <Link to="/onboarding" className="mt-4 inline-block text-indigo-600 hover:underline">
          Go to onboarding
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Track completion, CEFR trend, and recurring mistakes.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!data && !error && <p className="mt-4 text-sm text-slate-500">Loading progress...</p>}

      {data && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(data.topicCompletion).map(([topic, count]) => (
              <div key={topic} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-500">{topic}</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500">sessions completed</p>
              </div>
            ))}
          </div>

          <ProgressCharts cefrTrend={data.cefrTrend.map((item) => ({ date: item.date, score: item.score }))} />

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800">Common mistakes</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {data.commonMistakes.slice(0, 8).map((item, index) => (
                  <li key={`${item.word}-${index}`} className="rounded-lg bg-slate-50 p-2">
                    <span className="font-medium">{item.word}</span> → {item.correction}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-slate-800">Word bank to review</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.wordBank.map((word) => (
                  <span key={word} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
