import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-lg md:p-12">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">Fluentia MVP</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">Practice Spanish with focused AI conversation</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Learn with short, pre-made micro-lessons and then practice with a local Ollama tutor that stays in your selected topic.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            to="/onboarding"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Start Learning
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
