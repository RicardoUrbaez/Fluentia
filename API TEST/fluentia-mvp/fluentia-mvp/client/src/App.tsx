import { Link, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LessonPage } from "./pages/LessonPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { PracticePage } from "./pages/PracticePage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link to="/" className="text-lg font-bold text-indigo-600">
            Fluentia
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link className="transition hover:text-slate-900" to="/onboarding">
              Onboarding
            </Link>
            <Link className="transition hover:text-slate-900" to="/dashboard">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/practice/:sessionId" element={<PracticePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
