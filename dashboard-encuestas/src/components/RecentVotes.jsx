import { Frown, Meh, Smile } from "lucide-react";

const voteStyles = {
  BUENO: {
    icon: Smile,
    label: "Bueno",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
  },
  REGULAR: {
    icon: Meh,
    label: "Regular",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
  },
  MALO: {
    icon: Frown,
    label: "Malo",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
  }
};

function formatTime(value) {
  if (!value) return "--:--";

  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function RecentVotes({ votes, loading }) {
  const recentVotes = votes.slice().reverse().slice(0, 5);

  return (
    <section className="min-h-[360px] rounded-3xl bg-white shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
      <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">
          Ultimos votos
        </h2>
        <p className="mt-1 text-base font-medium text-slate-500 dark:text-slate-400">
          Cargados desde el backend local
        </p>
      </div>

      {loading ? (
        <div className="m-6 rounded-2xl bg-slate-50 px-4 py-8 text-center text-base font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Cargando votos...
        </div>
      ) : recentVotes.length === 0 ? (
        <div className="m-6 rounded-2xl bg-slate-50 px-4 py-8 text-center text-base font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          Aun no hay votos registrados.
        </div>
      ) : (
        <div className="px-6">
          {recentVotes.map((vote, index) => {
            const style = voteStyles[vote.respuesta] || voteStyles.REGULAR;
            const Icon = style.icon;

            return (
              <article
                key={`${vote.fecha || "sin-fecha"}-${index}`}
                className="flex h-14 items-center justify-between border-b border-slate-100 last:border-b-0 dark:border-slate-800"
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${style.badge}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">{style.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{formatTime(vote.fecha)}</span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default RecentVotes;
