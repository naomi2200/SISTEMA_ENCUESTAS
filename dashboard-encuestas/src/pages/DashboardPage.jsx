import { useMemo } from "react";
import {
  ClipboardList,
  Frown,
  Meh,
  Smile,
  TrendingUp
} from "lucide-react";

import DashboardHeader from "../components/DashboardHeader";
import StatCard from "../components/StatCard";
import SurveyChart from "../components/SurveyChart";
import SatisfactionChart from "../components/SatisfactionChart";
import RecentVotes from "../components/RecentVotes";
import SummaryCards from "../components/SummaryCards";

const responseTypes = [
  {
    key: "BUENO",
    label: "Bueno",
    tone: "emerald",
    icon: Smile
  },
  {
    key: "REGULAR",
    label: "Regular",
    tone: "amber",
    icon: Meh
  },
  {
    key: "MALO",
    label: "Malo",
    tone: "rose",
    icon: Frown
  }
];

function buildMetrics(votes) {
  return responseTypes.map((type) => {
    const count = votes.filter((item) => item.respuesta === type.key).length;
    const percentage = votes.length ? Math.round((count / votes.length) * 100) : 0;

    return {
      ...type,
      count,
      percentage,
      description: `${percentage}% del total`
    };
  });
}

function buildDailyVotes(votes) {
  const grouped = votes.reduce((acc, item) => {
    if (!item.fecha) return acc;
    const date = new Date(item.fecha);
    if (Number.isNaN(date.getTime())) return acc;

    const key = new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short"
    }).format(date);

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(grouped).map(([date, cantidad]) => ({
    date,
    cantidad
  }));

  return entries.slice(-7);
}

function buildSummary(votes, metrics) {
  const total = votes.length;
  const bueno = metrics.find((metric) => metric.key === "BUENO")?.count || 0;
  const regular = metrics.find((metric) => metric.key === "REGULAR")?.count || 0;
  const malo = metrics.find((metric) => metric.key === "MALO")?.count || 0;
  const score = total ? ((bueno * 5 + regular * 3 + malo) / total).toFixed(1) : "0.0";

  const hours = votes.reduce((acc, item) => {
    if (!item.fecha) return acc;
    const date = new Date(item.fecha);
    if (Number.isNaN(date.getTime())) return acc;

    const hour = date.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const peakHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    total,
    score,
    peak: peakHour ? `${peakHour}:00 - ${Number(peakHour) + 1}:00` : "Sin datos",
    satisfaction: total ? Math.round((bueno / total) * 100) : 0
  };
}

function DashboardPage({ votes, loading, lastUpdated, backendStatus, onRefresh, theme, onToggleTheme }) {
  const metrics = useMemo(() => buildMetrics(votes), [votes]);
  const total = votes.length;
  const initialLoading = loading && total === 0;
  const dailyVotes = useMemo(() => buildDailyVotes(votes), [votes]);
  const summary = useMemo(() => buildSummary(votes, metrics), [votes, metrics]);
  const dashboardMetrics = [
    ...metrics,
    {
      key: "TOTAL",
      label: "Total Votos",
      tone: "violet",
      icon: ClipboardList,
      count: total,
      percentage: 100,
      description: "Total acumulado"
    }
  ];

  return (
    <div className="flex flex-col gap-5">
      <DashboardHeader
        total={total}
        lastUpdated={lastUpdated}
        loading={loading}
        backendStatus={backendStatus}
        onRefresh={onRefresh}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <StatCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        <SurveyChart data={dailyVotes} loading={initialLoading} />
        <SatisfactionChart metrics={metrics} satisfaction={summary.satisfaction} />
        <RecentVotes votes={votes} loading={initialLoading} />
      </section>

      <SummaryCards
        total={summary.total}
        score={summary.score}
        peak={summary.peak}
        satisfaction={summary.satisfaction}
      />

      <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <TrendingUp className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">Estado del sistema</h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              {backendStatus === "connected"
                ? "Dashboard conectado al backend local y actualizandose cada 2 segundos."
                : "No se pudo conectar con el backend local."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
