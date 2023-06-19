import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";

export default function SupersetDashboard() {
	let ref = useRef<HTMLDivElement>(null);

	const embedDash = async () => {
		if (ref.current) {
			await embedDashboard({
				id: "f02c414f-93c1-4dad-9b21-fe383700b02c", // given by the Superset embedding UI
				supersetDomain: "http://superset:8088/",
				mountPoint: ref.current, // html element in which iframe render
				fetchGuestToken: () =>
					getGuestToken(`f02c414f-93c1-4dad-9b21-fe383700b02c`),
				dashboardUiConfig: {
					hideTitle: true,
					hideTab: true,
					filters: {
						expanded: false,
						visible: false,
					},
				},
			});
		}
	};

	useEffect(() => {
		embedDash();
	}, []);

	return (
		<DashboardFrame title={"Dashboard"}>
			<div ref={ref} className="h-screen embed-iframe-container" />
		</DashboardFrame>
	);
}
