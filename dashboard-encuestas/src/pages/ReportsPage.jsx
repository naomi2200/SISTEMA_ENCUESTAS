import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Award,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Frown,
  Meh,
  Smile
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

function buildTotals(votes) {
  const bueno = votes.filter((vote) => vote.respuesta === "BUENO").length;
  const regular = votes.filter((vote) => vote.respuesta === "REGULAR").length;
  const malo = votes.filter((vote) => vote.respuesta === "MALO").length;
  const total = votes.length;

  return {
    total,
    bueno,
    regular,
    malo,
    satisfaction: total ? Math.round((bueno / total) * 100) : 0
  };
}

function buildChart(votes) {
  const grouped = votes.reduce((acc, vote) => {
    if (!vote.fecha) return acc;
    const date = new Date(vote.fecha);
    if (Number.isNaN(date.getTime())) return acc;

    const key = new Intl.DateTimeFormat("es-PE", {
      weekday: "short"
    }).format(date);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, total]) => ({ name, total })).slice(-7);
}

function getSatisfactionStatus(value) {
  if (value >= 60) return { label: "Satisfaccion alta", className: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20" };
  if (value >= 35) return { label: "Satisfaccion media", className: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20" };
  return { label: "Satisfaccion baja", className: "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20" };
}

function ReportsPage({ votes }) {
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

  const totals = useMemo(() => buildTotals(votes), [votes]);
  const chart = useMemo(() => buildChart(votes), [votes]);
  const topDay = chart.slice().sort((a, b) => b.total - a.total)[0]?.name || "Sin datos";
  const status = getSatisfactionStatus(totals.satisfaction);

  const cards = [
    {
      label: "Bueno",
      value: totals.bueno,
      icon: Smile,
      className: "from-white to-emerald-50 text-emerald-600 dark:from-slate-900 dark:to-emerald-950/30 dark:text-emerald-300"
    },
    {
      label: "Regular",
      value: totals.regular,
      icon: Meh,
      className: "from-white to-amber-50 text-amber-500 dark:from-slate-900 dark:to-amber-950/30 dark:text-amber-300"
    },
    {
      label: "Malo",
      value: totals.malo,
      icon: Frown,
      className: "from-white to-rose-50 text-rose-500 dark:from-slate-900 dark:to-rose-950/30 dark:text-rose-300"
    },
    {
      label: "Total acumulado",
      value: totals.total,
      icon: ClipboardList,
      className: "from-white to-violet-50 text-[#6C63FF] dark:from-slate-900 dark:to-violet-950/40 dark:text-violet-300"
    }
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <p className="text-base font-bold text-[#6C63FF] dark:text-violet-300">Reportes</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
          Analitica de satisfaccion
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500 dark:text-slate-400">
          Reporte generado con los votos disponibles en backend local.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className={`min-h-[110px] rounded-3xl bg-gradient-to-br p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:shadow-none dark:ring-slate-800 ${card.className}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
                    {card.value}
                  </p>
                </div>
                <span className="rounded-2xl bg-white/80 p-3 ring-1 ring-white/70 dark:bg-slate-800/70 dark:ring-slate-700">
                  <Icon className="h-7 w-7" />
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <article className="min-w-0 rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Comparativa semanal</h2>
              <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
                Actividad acumulada por dia con registros fechados.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-2xl bg-violet-50 px-3 py-2 text-sm font-bold text-[#6C63FF] ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20">
                Total acumulado
              </span>
              <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                Dia top: {topDay}
              </span>
            </div>
          </div>

          <div ref={chartRef} className="h-[360px] min-w-0">
            {chartSize.width > 0 && chartSize.height > 0 && (
              <BarChart
                width={chartSize.width}
                height={chartSize.height}
                data={chart}
                margin={{ top: 10, right: 18, left: -18, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontWeight: 700 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="total" fill="#6C63FF" radius={[12, 12, 4, 4]} barSize={48} />
              </BarChart>
            )}
          </div>
        </article>

        <article className="rounded-3xl bg-gradient-to-br from-white to-violet-50 p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:from-slate-900 dark:to-indigo-950 dark:shadow-none dark:ring-slate-800">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-[#EEE9FF] p-3 text-[#6C63FF] dark:bg-violet-500/15 dark:text-violet-300">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Resumen de interpretacion</h2>
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                Reporte generado con los votos disponibles en backend local.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <span className={`inline-flex rounded-2xl px-3 py-2 text-sm font-bold ring-1 ${status.className}`}>
              {status.label}
            </span>
            <div className="grid gap-3">
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100 dark:bg-slate-800/70 dark:ring-slate-700">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Satisfaccion positiva</p>
                </div>
                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-100">{totals.satisfaction}%</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100 dark:bg-slate-800/70 dark:ring-slate-700">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-[#6C63FF]" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Mayor actividad</p>
                </div>
                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-100">{topDay}</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-slate-100 dark:bg-slate-800/70 dark:ring-slate-700">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total acumulado</p>
                </div>
                <p className="mt-2 text-3xl font-black text-slate-950 dark:text-slate-100">{totals.total}</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ReportsPage;
