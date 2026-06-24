import { CalendarDays, Moon, RefreshCw, Sun, UserRound } from "lucide-react";

function formatTime(date) {
  if (!date) return "Esperando datos";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function DashboardHeader({ total, lastUpdated, loading, backendStatus, onRefresh, theme, onToggleTheme }) {
  const isDark = theme === "dark";
  const backendConnected = backendStatus === "connected";

  return (
    <header className="flex h-auto min-h-[110px] flex-col items-start justify-between gap-5 rounded-3xl bg-gradient-to-br from-white via-white to-emerald-50 px-7 py-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-colors duration-300 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 dark:shadow-none dark:ring-slate-800 2xl:flex-row 2xl:items-center">
      <div>
        <h1 className="whitespace-nowrap text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
          COMEDOR TECSUP
        </h1>
        <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-300 md:text-lg">
          Sistema inteligente de satisfaccion
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold ring-1 ${
          backendConnected
            ? "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20"
            : "bg-rose-50 text-rose-700 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20"
        }`}>
          <span className={`h-2.5 w-2.5 rounded-xl ${backendConnected ? "bg-emerald-500" : "bg-rose-500"}`} />
          {backendConnected ? "Backend conectado" : "Backend desconectado"}
        </span>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          <span className="rounded-2xl bg-slate-50 p-2.5 text-slate-500 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Actualizacion</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100">
              {backendConnected ? formatTime(lastUpdated) : "Sin conexion"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex h-10 w-[76px] items-center rounded-2xl bg-slate-100 p-1 ring-1 ring-slate-200 transition-colors dark:bg-slate-800 dark:ring-slate-700"
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-xl bg-white text-amber-500 shadow-lg shadow-slate-200/40 transition-transform dark:bg-indigo-500 dark:text-white dark:shadow-none ${
              isDark ? "translate-x-9" : "translate-x-0"
            }`}
          >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          <span className="rounded-2xl bg-[#6C63FF] p-2.5 text-white">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">Administrador</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{total} votos registrados</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-100 transition hover:text-[#6C63FF] dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
          aria-label="Actualizar votos"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;
