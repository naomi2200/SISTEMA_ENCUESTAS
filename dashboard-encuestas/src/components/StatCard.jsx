const toneStyles = {
  emerald: {
    card: "from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/30",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    text: "text-emerald-600"
  },
  amber: {
    card: "from-white to-amber-50 dark:from-slate-900 dark:to-amber-950/30",
    icon: "bg-amber-100 text-amber-500 dark:bg-amber-500/15 dark:text-amber-300",
    text: "text-amber-500"
  },
  rose: {
    card: "from-white to-rose-50 dark:from-slate-900 dark:to-rose-950/30",
    icon: "bg-rose-100 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300",
    text: "text-rose-500"
  },
  violet: {
    card: "from-white to-violet-50 ring-violet-100 dark:from-slate-900 dark:to-violet-950/40 dark:ring-violet-500/30",
    icon: "bg-[#EEE9FF] text-[#6C63FF] dark:bg-violet-500/15 dark:text-violet-300",
    text: "text-[#6C63FF]"
  }
};

function StatCard({ metric }) {
  const Icon = metric.icon;
  const styles = toneStyles[metric.tone];

  return (
    <article className={`relative min-h-[150px] overflow-hidden rounded-3xl bg-gradient-to-br p-5 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-colors dark:shadow-none dark:ring-slate-800 ${styles.card}`}>
      <span className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-3xl bg-white/40 blur-2xl dark:bg-violet-400/10" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`rounded-2xl p-2.5 ${styles.icon}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className={`truncate text-lg font-bold ${styles.text}`}>{metric.label}</p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">{metric.description}</p>
          </div>
        </div>
        <span className={`text-base font-bold ${styles.text}`}>{metric.percentage}%</span>
      </div>

      <p className="mt-5 text-4xl font-black leading-none tracking-tight text-slate-950 dark:text-slate-100 2xl:text-5xl">
        {metric.count}
      </p>
    </article>
  );
}

export default StatCard;
