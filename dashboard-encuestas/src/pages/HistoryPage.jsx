import { useMemo, useState } from "react";
import { ClipboardList, Clock3, Frown, Meh, Smile, Trophy } from "lucide-react";

const filters = ["Hoy", "Semana", "Mes", "Todos"];

const voteStyles = {
  BUENO: {
    label: "Bueno",
    icon: Smile,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20"
  },
  REGULAR: {
    label: "Regular",
    icon: Meh,
    badge: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20"
  },
  MALO: {
    label: "Malo",
    icon: Frown,
    badge: "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20"
  }
};

function parseVoteDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseVoteDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function formatTime(value) {
  const date = parseVoteDate(value);
  if (!date) return "-";

  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatDateTime(value) {
  const date = parseVoteDate(value);
  if (!date) return "Sin registro";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function filterVotes(votes, activeFilter) {
  if (activeFilter === "Todos") return votes;

  const now = new Date();
  return votes.filter((vote) => {
    const date = parseVoteDate(vote.fecha);
    if (!date) return false;

    if (activeFilter === "Hoy") return sameDay(date, now);
    if (activeFilter === "Semana") {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      return date >= sevenDaysAgo && date <= now;
    }
    if (activeFilter === "Mes") {
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    }

    return true;
  });
}

function getMostFrequentVote(votes) {
  const counts = votes.reduce((acc, vote) => {
    if (!vote.respuesta) return acc;
    acc[vote.respuesta] = (acc[vote.respuesta] || 0) + 1;
    return acc;
  }, {});

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return top ? voteStyles[top]?.label || top : "Sin datos";
}

function getLatestVoteDate(votes) {
  return votes
    .map((vote) => vote.fecha)
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];
}

function HistoryPage({ votes, loading }) {
  const [activeFilter, setActiveFilter] = useState("Hoy");
  const initialLoading = loading && votes.length === 0;
  const filteredVotes = useMemo(() => filterVotes(votes, activeFilter), [votes, activeFilter]);
  const latestVoteDate = useMemo(() => getLatestVoteDate(votes), [votes]);
  const mostFrequentVote = useMemo(() => getMostFrequentVote(votes), [votes]);

  const stats = [
    { label: "Total de votos", value: votes.length, icon: ClipboardList, tone: "text-[#6C63FF] bg-violet-50 dark:bg-violet-500/10 dark:text-violet-300" },
    { label: "Ultimo voto recibido", value: formatDateTime(latestVoteDate), icon: Clock3, tone: "text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-300" },
    { label: "Voto mas frecuente", value: mostFrequentVote, icon: Trophy, tone: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-300" }
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <p className="text-base font-bold text-[#6C63FF] dark:text-violet-300">Historial</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
          Votos registrados
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500 dark:text-slate-400">
          Consulta la hora, fecha y tipo de voto recibido desde el backend local.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
              <div className="flex items-center gap-3">
                <span className={`rounded-2xl p-3 ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-1 truncate text-2xl font-black text-slate-950 dark:text-slate-100">{stat.value}</p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-slate-100">Tabla de votos</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {filteredVotes.length} registros en este periodo
            </p>
          </div>
          <div className="flex rounded-2xl bg-slate-50 p-1 dark:bg-slate-800">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "bg-white text-[#6C63FF] shadow-lg shadow-slate-200/40 dark:bg-slate-900 dark:text-violet-300 dark:shadow-none"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800">
          <div className="grid grid-cols-[1fr_1fr_1.4fr_1fr] bg-slate-50 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <span>Hora</span>
            <span>Fecha</span>
            <span>Voto</span>
            <span>Origen</span>
          </div>

          {initialLoading ? (
            <div className="px-5 py-10 text-center text-base font-semibold text-slate-500 dark:text-slate-400">
              Cargando historial...
            </div>
          ) : filteredVotes.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-lg font-black text-slate-950 dark:text-slate-100">
                No hay votos registrados en este periodo.
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Cambia el filtro para revisar otros registros disponibles.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVotes.slice().reverse().map((vote, index) => {
                const style = voteStyles[vote.respuesta] || voteStyles.REGULAR;
                const Icon = style.icon;

                return (
                  <article
                    key={`${vote.fecha || "sin-fecha"}-${index}`}
                    className="grid min-h-14 grid-cols-[1fr_1fr_1.4fr_1fr] items-center gap-3 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 md:text-base"
                  >
                    <span>{formatTime(vote.fecha)}</span>
                    <span>{formatDate(vote.fecha)}</span>
                    <span>
                      <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-sm font-black ring-1 ${style.badge}`}>
                        <Icon className="h-4 w-4" />
                        {style.label}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Backend local</span>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HistoryPage;
