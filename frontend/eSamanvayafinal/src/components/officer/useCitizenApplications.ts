import { useCallback, useEffect, useState } from "react";
import {
  getOfficerVisibleApplications,
  mapToMonitoredApp,
  type OfficerMonitoredApp,
} from "./citizenApplications";

export function useCitizenApplications(): {
  apps: OfficerMonitoredApp[];
  refresh: () => void;
} {
  const [apps, setApps] = useState<OfficerMonitoredApp[]>(() =>
    getOfficerVisibleApplications().map(mapToMonitoredApp),
  );

  const refresh = useCallback(() => {
    setApps(getOfficerVisibleApplications().map(mapToMonitoredApp));
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "esamanvay_applications") refresh();
    };
    window.addEventListener("storage", onStorage);
    const interval = setInterval(refresh, 3000);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return { apps, refresh };
}
