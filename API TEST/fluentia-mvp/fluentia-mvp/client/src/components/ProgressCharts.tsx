import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ProgressChartsProps = {
  cefrTrend: Array<{ date: string; score: number }>;
};

export const ProgressCharts = ({ cefrTrend }: ProgressChartsProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-800">CEFR Trend (score / 20)</h3>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={cefrTrend}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
