import {
  BarChart3,
  Clock3,
  Home,
  Settings,
  Utensils,
  Wifi
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "history", label: "Historial", icon: Clock3 },
  { id: "reports", label: "Reportes", icon: BarChart3 },
  { id: "settings", label: "Configuracion", icon: Settings }
];

function Sidebar({ activePage, onNavigate, backendStatus }) {
  const backendConnected = backendStatus === "connected";
  const backendChecking = backendStatus === "checking";

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-32px)] w-[260px] min-w-[260px] shrink-0 flex-col rounded-3xl bg-gradient-to-b from-white to-violet-50/40 p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 transition-colors dark:from-slate-900 dark:to-indigo-950 dark:shadow-none dark:ring-slate-800">
      <div className="rounded-3xl bg-white/80 p-3 ring-1 ring-violet-100 dark:bg-slate-900/70 dark:ring-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEE9FF] text-[#6C63FF] dark:bg-violet-500/15 dark:text-violet-300">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-black leading-5 text-slate-950 dark:text-slate-100">COMEDOR</p>
            <p className="text-2xl font-black leading-7 text-[#6C63FF] dark:text-violet-300">TECSUP</p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          Panel de control
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex h-12 w-full items-center gap-4 rounded-2xl px-4 text-left text-base font-semibold transition ${
                active
                  ? "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white shadow-lg shadow-violet-200/40 dark:shadow-none"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="rounded-3xl bg-white/80 p-4 ring-1 ring-slate-100 dark:bg-slate-900/70 dark:ring-slate-800">
          <div className="flex items-center gap-2">
            <span className={`rounded-2xl p-2 ${
              backendConnected
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                : backendChecking
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
                  : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
            }`}>
              <Wifi className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Estado backend</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-xl ${backendConnected ? "bg-emerald-500" : backendChecking ? "bg-amber-500" : "bg-rose-500"}`} />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {backendConnected ? "Conectado" : backendChecking ? "Verificando" : "Desconectado"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
