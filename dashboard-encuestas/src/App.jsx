import { useCallback, useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { getVotes } from "./services/surveyService";

const pages = {
  dashboard: DashboardPage,
  history: HistoryPage,
  reports: ReportsPage,
  settings: SettingsPage
};

function getLatestVoteDate(votes) {
  return votes
    .map((vote) => vote.fecha)
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a)[0] || null;
}

function getEsp32Status(latestVoteDate) {
  if (!latestVoteDate) return "unverified";

  const secondsSinceLastVote = (Date.now() - latestVoteDate.getTime()) / 1000;
  return secondsSinceLastVote <= 30 ? "connected" : "stale";
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const CurrentPage = pages[activePage] || DashboardPage;
  const latestVoteDate = getLatestVoteDate(votes);
  const esp32Status = getEsp32Status(latestVoteDate);

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const loadVotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVotes();
      setVotes(Array.isArray(response.data) ? response.data : []);
      setLastUpdated(new Date());
      setBackendStatus("connected");
    } catch (error) {
      console.error(error);
      setBackendStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = setTimeout(loadVotes, 0);
    const interval = setInterval(loadVotes, 2000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, [loadVotes]);

  return (
    <main className="flex min-h-screen bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-gradient-to-br dark:from-slate-950 dark:to-indigo-950 dark:text-slate-100">
      <div className="hidden shrink-0 p-4 lg:block">
        <Sidebar activePage={activePage} onNavigate={setActivePage} backendStatus={backendStatus} />
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5">
          <div className="flex gap-2 overflow-x-auto rounded-3xl bg-white p-2 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800 lg:hidden">
            {[
              ["dashboard", "Dashboard"],
              ["history", "Historial"],
              ["reports", "Reportes"],
              ["settings", "Configuracion"]
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActivePage(id)}
                className={`h-10 shrink-0 rounded-2xl px-4 text-sm font-semibold ${
                  activePage === id
                    ? "bg-[#6C63FF] text-white"
                    : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <CurrentPage
            votes={votes}
            loading={loading}
            lastUpdated={lastUpdated}
            latestVoteDate={latestVoteDate}
            backendStatus={backendStatus}
            esp32Status={esp32Status}
            onRefresh={loadVotes}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
