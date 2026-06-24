import {
  Activity,
  ClipboardList,
  Clock3,
  TrendingUp
} from "lucide-react";

function SummaryCards({ total, score, peak, satisfaction }) {
  const items = [
    {
      label: "Total votos",
      value: total,
      icon: ClipboardList,
      tone: "bg-[#EEE9FF] text-[#6C63FF] dark:bg-violet-500/15 dark:text-violet-300"
    },
    {
      label: "Promedio general",
      value: `${score} / 5`,
      icon: Activity,
      tone: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
    },
    {
      label: "Hora pico",
      value: peak,
      icon: Clock3,
      tone: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300"
    },
    {
      label: "Satisfaccion",
      value: `${satisfaction}%`,
      icon: TrendingUp,
      tone: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
    }
  ];

  return (
    <section className="grid grid-cols-1 gap-5 rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800 md:grid-cols-2 2xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article key={item.label} className="flex min-h-[96px] items-center gap-4 rounded-2xl bg-slate-50/70 px-4 dark:bg-slate-800/60">
            <span className={`rounded-2xl p-3 ${item.tone}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100 2xl:text-3xl">{item.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default SummaryCards;
