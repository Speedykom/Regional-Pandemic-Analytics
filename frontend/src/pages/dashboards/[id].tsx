import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";

export default function SupersetDashboard() {
	let ref = useRef(null);

	const embedDash = async () => {
		if (ref.current) {
			await embedDashboard({
				id: '381943fb-48c1-42ba-a85f-78b49bd14519', // given by the Superset embedding UI
				supersetDomain: `http://localhost:8088/`,
				mountPoint: ref.current, // html element in which iframe render
				fetchGuestToken: () =>
					getGuestToken('381943fb-48c1-42ba-a85f-78b49bd14519'),
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
