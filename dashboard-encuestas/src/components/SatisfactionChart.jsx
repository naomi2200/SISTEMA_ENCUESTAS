import {
  Cell,
  Pie,
  PieChart,
  Tooltip
} from "recharts";
import { useEffect, useRef, useState } from "react";

const colors = {
  BUENO: "#22C55E",
  REGULAR: "#FACC15",
  MALO: "#EF4444"
};

const legendColors = {
  BUENO: "bg-[#22C55E]",
  REGULAR: "bg-[#FACC15]",
  MALO: "bg-[#EF4444]"
};

function SatisfactionChart({ metrics, satisfaction }) {
  const chartRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const data = metrics.map((metric) => ({
    name: metric.label,
    value: metric.count,
    key: metric.key,
    percentage: metric.percentage
  }));

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
      <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
        Distribucion
      </h2>
      <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
        Satisfaccion general
      </p>

      <div ref={chartRef} className="relative mt-4 h-[260px] min-w-0">
        {chartSize.width > 0 && chartSize.height > 0 && (
          <PieChart width={chartSize.width} height={chartSize.height}>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={108}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={colors[entry.key]} />
              ))}
            </Pie>
          </PieChart>
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-black text-slate-950 dark:text-slate-100">{satisfaction}%</p>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">Bueno</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-base">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-xl ${legendColors[item.key]}`} />
              <span className="font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SatisfactionChart;
