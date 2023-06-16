import { useEffect, useRef } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";

export default function SupersetDashboard() {
	// let mountPoint: any;
	const ref = useRef(null)
	// if (typeof window !== "undefined") {
	// 	mountPoint = document.getElementById("igad-covid-dashboard");
	// // }
	
	useEffect(() => {
		if (ref.current) {
			embedDashboard({
				id: "f3325063-a85f-46d1-88de-03f78c92d533", // given by the Superset embedding UI
				supersetDomain: "http://localhost:8088",
				mountPoint: ref.current, // html element in which iframe render
				fetchGuestToken: () =>
					getGuestToken(`f3325063-a85f-46d1-88de-03f78c92d533`),
				dashboardUiConfig: { hideTitle: true },
			});
		}
		
	}, [])

	return (
		<DashboardFrame title={"Dashboard"}>
			<div ref={ref} id="igad-covid-dashboard" />
		</DashboardFrame>
	);
}
