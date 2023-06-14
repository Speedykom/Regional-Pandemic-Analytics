import { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { useRouter } from "next/router";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";

interface RouterQuery {
  id?: string;
  dashboardTitle?: string;
}

export default function SupersetDashboard() {
  const router = useRouter();

  const { id, dashboardTitle } = router.query as RouterQuery;

  const getGuestToken = async () => {
    const queryParams = new URLSearchParams({
      dashboardUUID: String(id),
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
          id: `${id}`,
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
