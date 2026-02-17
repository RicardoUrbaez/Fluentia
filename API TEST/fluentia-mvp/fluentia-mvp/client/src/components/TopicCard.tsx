import type { Topic } from "../types";

type TopicCardProps = {
  topic: Topic;
  selected: boolean;
  onSelect: (topic: Topic) => void;
};

export const TopicCard = ({ topic, selected, onSelect }: TopicCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic)}
      className={`w-full rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        selected ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold text-slate-800">{topic.name}</h3>
      <p className="mt-2 text-sm text-slate-500">Spanish foundations in {topic.name.toLowerCase()} scenarios.</p>
    </button>
  );
};
