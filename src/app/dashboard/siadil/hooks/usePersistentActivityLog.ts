import { useState, useEffect, useCallback } from "react";
import { ActivityLog } from "../types";

const SIADIL_ACTIVITY_LOG_KEY = "siadil_activity_log_storage";

export function usePersistentActivityLog(): [
  ActivityLog[],
  (logEntry: Omit<ActivityLog, "id" | "timestamp">) => void
] {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(SIADIL_ACTIVITY_LOG_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Gagal mengambil data log dari localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIADIL_ACTIVITY_LOG_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Gagal menyimpan data log ke localStorage", error);
    }
  }, [logs]);

  const logActivity = useCallback(
    (logEntry: Omit<ActivityLog, "id" | "timestamp">) => {
      const newLog: ActivityLog = {
        ...logEntry,
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
      };
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    },
    []
  );

  return [logs, logActivity];
}
