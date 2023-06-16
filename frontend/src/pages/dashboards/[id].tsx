import { useEffect } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";

export default function SupersetDashboard() {
	let mountPoint: any;
	if (typeof window !== "undefined") {
		mountPoint = document.getElementById("igad-covid-dashboard");
	}
	embedDashboard({
		id: "f3325063-a85f-46d1-88de-03f78c92d533", // given by the Superset embedding UI
		supersetDomain: "https://localhost:8088",
		mountPoint: mountPoint, // html element in which iframe render
		fetchGuestToken: () =>
			getGuestToken(`f3325063-a85f-46d1-88de-03f78c92d533`),
		dashboardUiConfig: { hideTitle: true },
	});

	// useEffect(() => {
	//   const embed = () => {
	//     const mountPoint = document.getElementById("igad-covid-dashboard");
	//     if (mountPoint) {
	//       embedDashboard({
	//         id: `f3325063-a85f-46d1-88de-03f78c92d533`,
	//         supersetDomain: `http://localhost:8088`,
	//         mountPoint,
	//         fetchGuestToken: () => getGuestToken(`f3325063-a85f-46d1-88de-03f78c92d533`),
	//         dashboardUiConfig: {
	//           hideTitle: true,
	//         },
	//       });
	//     }
	//   };
	//   if (document.getElementById("igad-covid-dashboard")) {
	//     embed();
	//   }
	// }, []);
	return (
		<DashboardFrame title={"Dashboard"}>
			<div id="igad-covid-dashboard" />
		</DashboardFrame>
	);
}
