import {
  Building2,
  Cpu,
  Database,
  Download,
  FileJson,
  MapPin,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldCheck,
  UserRound
} from "lucide-react";

import { VOTES_ENDPOINT } from "../services/surveyService";

function formatDateTime(value) {
  if (!value) return "Sin registro";

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value instanceof Date ? value : new Date(value));
}

function getBackendLabel(status) {
  if (status === "connected") return "Conectado";
  if (status === "checking") return "Verificando";
  return "Desconectado";
}

function getEsp32Label(status) {
  if (status === "connected") return "Conectado";
  if (status === "stale") return "Sin señal reciente";
  return "No verificado";
}

function getStatusTone(kind, status) {
  if (kind === "backend") {
    if (status === "connected") return "bg-emerald-500";
    if (status === "checking") return "bg-amber-500";
    return "bg-rose-500";
  }

  if (status === "connected") return "bg-emerald-500";
  return "bg-amber-500";
}

function SettingsPage({ votes, loading, backendStatus, esp32Status, latestVoteDate }) {
  const sections = [
    {
      title: "Identidad del sistema",
      items: [
        { label: "Nombre del comedor", value: "COMEDOR TECSUP", icon: Building2 },
        { label: "Ubicacion", value: "Comedor principal", icon: MapPin },
        { label: "Responsable", value: "Administrador", icon: UserRound }
      ]
    },
    {
      title: "Conexiones",
      items: [
        { label: "Estado backend", value: getBackendLabel(backendStatus), icon: Server, status: getStatusTone("backend", backendStatus) },
        { label: "Estado ESP32", value: getEsp32Label(esp32Status), icon: Cpu, status: getStatusTone("esp32", esp32Status) },
        { label: "Ultimo voto recibido", value: formatDateTime(latestVoteDate), icon: RefreshCw },
        { label: "Endpoint actual", value: VOTES_ENDPOINT, icon: Database },
        { label: "Fuente de datos", value: "respuestas.json / backend local", icon: FileJson },
        { label: "Total de votos cargados", value: votes.length, icon: ShieldCheck }
      ]
    },
    {
      title: "Actualizacion de datos",
      items: [
        { label: "Intervalo de actualizacion", value: "Cada 2 segundos", icon: RefreshCw },
        { label: "Estado del polling", value: loading ? "Actualizando" : "Activo", icon: Cpu, status: loading ? "bg-amber-500" : "bg-emerald-500" }
      ]
    }
  ];

  const actions = [
    { label: "Reiniciar votos del dia", icon: RotateCcw, tone: "text-rose-600 bg-rose-50 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20" },
    { label: "Exportar datos", icon: Download, tone: "text-[#6C63FF] bg-violet-50 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20" },
    { label: "Ver respaldo JSON", icon: FileJson, tone: "text-emerald-600 bg-emerald-50 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20" }
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <p className="text-base font-bold text-[#6C63FF] dark:text-violet-300">Configuracion</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-slate-100 md:text-4xl">
          Ajustes del sistema
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-500 dark:text-slate-400">
          Estados operativos basados en la respuesta real del backend local.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800"
          >
            <h2 className="text-xl font-black text-slate-950 dark:text-slate-100">{section.title}</h2>
            <div className="mt-5 grid gap-3">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="flex min-h-[86px] items-center justify-between gap-4 rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-100 dark:bg-slate-800/60 dark:ring-slate-700"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="rounded-2xl bg-white p-2.5 text-[#6C63FF] ring-1 ring-slate-100 dark:bg-slate-900 dark:text-violet-300 dark:ring-slate-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.label}</p>
                        <p className="mt-1 truncate text-xl font-black text-slate-950 dark:text-slate-100 md:text-2xl">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    {item.status && <span className={`h-3 w-3 shrink-0 rounded-xl ${item.status}`} />}
                  </div>
                );
              })}
            </div>
          </article>
        ))}

        <article className="rounded-3xl bg-gradient-to-br from-white to-violet-50 p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200 dark:from-slate-900 dark:to-indigo-950 dark:shadow-none dark:ring-slate-800">
          <h2 className="text-xl font-black text-slate-950 dark:text-slate-100">Acciones del sistema</h2>
          <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
            Acciones visuales. No ejecutan operaciones destructivas sin soporte del backend.
          </p>

          <div className="mt-5 grid gap-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  className={`flex h-14 items-center justify-between rounded-2xl px-4 text-left text-base font-bold ring-1 transition hover:-translate-y-0.5 ${action.tone}`}
                >
                  <span>{action.label}</span>
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}

export default SettingsPage;
