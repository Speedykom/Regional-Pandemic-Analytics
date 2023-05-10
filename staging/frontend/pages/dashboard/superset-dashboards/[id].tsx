import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import {useEffect} from "react";
import {embedDashboard} from "@superset-ui/embedded-sdk";


export default function SupersetDashboard(){
    const getGuestToken = async () => {
        const response = await fetch("/api/get-guest-token/")
        const token = await response.json()
        return token?.guestToken
    }

    useEffect(() => {
        const embed = async () => {
            await embedDashboard({
                id: '5e676cb1-7330-4eed-9e1a-d432de97da5e',
                supersetDomain: 'http://localhost:8080',
                mountPoint: document.getElementById('igad-covid-dashboard') || document.createElement("div"),
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
        <DashboardFrame title="List(s) of Dashboards">
            <div id="igad-covid-dashboard" style={{ width: '100%'}}/>
        </DashboardFrame>
    )
}

