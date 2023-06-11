import DashboardFrame from "@/src/components/Dashboard/DashboardFrame";
import { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useRouter } from "next/router";

interface RouterQuery {
  dashboardUUID?: string;
  dashboardTitle?: string;
}

export default function SupersetDashboard() {
  const router = useRouter();

  const { dashboardUUID, dashboardTitle } = router.query as RouterQuery;

  const getGuestToken = async () => {
    const queryParams = new URLSearchParams({
      dashboardUUID: String(dashboardUUID),
    });
    const response = await fetch(`/api/get-guest-token/?${queryParams}`);
    const token = await response.json();
    return token?.guestToken;
  };

  useEffect(() => {
    const embed = async () => {
      const mountPoint = document.getElementById("igad-covid-dashboard");
      if (mountPoint) {
        await embedDashboard({
          id: `${dashboardUUID}`,
          supersetDomain: `${process.env.NEXT_PUBLIC_SUPERSET_URL}`,
          mountPoint,
          fetchGuestToken: () => getGuestToken(),
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: true,
            hideTab: true,
          },
        });
      }
    };
    if (document.getElementById("igad-covid-dashboard")) {
      embed();
    }
  }, []);
  return (
    <DashboardFrame title={dashboardTitle || ""}>
      <div id="igad-covid-dashboard" />
    </DashboardFrame>
  );
}
