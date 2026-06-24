import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useRef, useState } from "react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-200/40 ring-1 ring-slate-100 dark:bg-slate-900 dark:shadow-none dark:ring-slate-700">
      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
        {payload[0].value} votos
      </p>
    </div>
  );
}

function SurveyChart({ data, loading }) {
  const chartRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!chartRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setChartSize({
        width: Math.floor(width),
        height: Math.floor(height)
      });
    });

    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-w-0 min-h-[360px] rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
            Encuestas por dia
          </h2>
          <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
            Votos recibidos durante los ultimos registros
          </p>
        </div>
        <span className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
          7 dias
        </span>
      </div>

      <div ref={chartRef} className="h-[300px] min-w-0 xl:h-[320px]">
        {loading || chartSize.width <= 0 || chartSize.height <= 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-base font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Cargando grafico...
          </div>
        ) : (
          <BarChart
            width={chartSize.width}
            height={chartSize.height}
            data={data}
            margin={{ top: 16, right: 12, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF5" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar dataKey="cantidad" fill="#8B5CF6" radius={[10, 10, 4, 4]} barSize={40} />
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 5, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }}
            />
          </BarChart>
        )}
      </div>
    </section>
  );
}

export default SurveyChart;
