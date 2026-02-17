import type { EvaluationJSON } from "../types";

type FeedbackPanelProps = {
  evaluation: EvaluationJSON | null;
};

const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs text-slate-600">
      <span>{label}</span>
      <span>{value}/5</span>
    </div>
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${(value / 5) * 100}%` }} />
    </div>
  </div>
);

export const FeedbackPanel = ({ evaluation }: FeedbackPanelProps) => {
  if (!evaluation) {
    return (
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold text-slate-800">Feedback</h3>
        <p className="mt-2 text-sm text-slate-500">Send a message to receive CEFR and rubric feedback.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800">Feedback · CEFR {evaluation.cefr}</h3>
      <div className="mt-3 space-y-3">
        <ScoreBar label="Grammar" value={evaluation.grammar} />
        <ScoreBar label="Vocabulary" value={evaluation.vocabulary} />
        <ScoreBar label="Fluency" value={evaluation.fluency} />
        <ScoreBar label="Task Completion" value={evaluation.taskCompletion} />
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {evaluation.feedbackBullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-slate-700">
        <span className="font-medium">Next exercise:</span> {evaluation.nextExercise}
      </p>
    </aside>
  );
};
