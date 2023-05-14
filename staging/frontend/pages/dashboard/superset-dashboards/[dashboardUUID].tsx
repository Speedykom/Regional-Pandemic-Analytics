import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import {useEffect} from "react";
import {embedDashboard} from "@superset-ui/embedded-sdk";
import {useRouter} from "next/router";

export default function SupersetDashboard(){
    const router = useRouter()

    const {dashboardUUID, dashboardTitle} = router.query

    const getGuestToken = async () => {
        const queryParams = new URLSearchParams({dashboardUUID})
        const response = await fetch(`/api/get-guest-token/?${queryParams}`)
        const token = await response.json()
        return token?.guestToken
    }

    useEffect(() => {
        const embed = async () => {
            await embedDashboard({
                id: `${dashboardUUID}`,
                supersetDomain: `${process.env.NEXT_PUBLIC_SUPERSET_URL}`,
                mountPoint: document.getElementById('igad-covid-dashboard'),
                fetchGuestToken: () => getGuestToken(),
                dashboardUiConfig: {
                    hideTitle: true,
                    hideChartControls: true,
                    hideTab: true,
                },
            });
        };
        if (document.getElementById('igad-covid-dashboard')) {
            embed();
        }
    }, []);
    return(
        <DashboardFrame title={dashboardTitle}>
            <div id="igad-covid-dashboard" />
        </DashboardFrame>
    )
}

