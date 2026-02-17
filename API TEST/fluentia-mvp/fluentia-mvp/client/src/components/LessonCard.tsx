import type { Lesson } from "../types";

type LessonCardProps = {
  lesson: Lesson;
  selected: boolean;
  onSelect: (lesson: Lesson) => void;
};

export const LessonCard = ({ lesson, selected, onSelect }: LessonCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(lesson)}
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-800">{lesson.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{lesson.skillFocus}</p>
      <p className="mt-2 text-xs text-slate-500">{lesson.questions.length} quick checks · {lesson.vocabItems.length} vocab words</p>
    </button>
  );
};
