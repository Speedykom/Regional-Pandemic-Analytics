import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";
import axios from "axios";
import { BASE_URL, SUPERSET_URL } from "@/common/config";
import secureLocalStorage from "react-secure-storage";

export default function SupersetDashboard() {
	let ref = useRef(null);
	const [uuid, setUUID] = useState("");

	const viewDash = async () => {
		const tokens: any = secureLocalStorage.getItem("tokens");
		const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 
		const dashId = location.href.substring(location.href.lastIndexOf('/') + 1);
		const response = await axios.get(
			`${BASE_URL}/api/superset/dashboard/embed/${dashId}`,
			{
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${accessToken}`
				},
			}
		);
		if (response.status !== 200) {
			await axios
				.post(
					`${BASE_URL}/api/superset/dashboard/enable-embed`,
					{
						uid: dashId,
					},
					{
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
							'Authorization': `Bearer ${accessToken}`
						},
					}
				)
				.then((res) => {
					const dashboardUUID = res?.data?.result?.uuid;
					setUUID(dashboardUUID);
				});
		} else {
			setUUID(response.data?.result?.uuid);
		}
	};

	const embedDash = async () => {
		if (ref.current) {
			await embedDashboard({
				id: uuid, // given by the Superset embedding UI
				supersetDomain: `${SUPERSET_URL}`,
				mountPoint: ref.current, // html element in which iframe render
				fetchGuestToken: () => getGuestToken(uuid),
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
		viewDash();
		embedDash();
	});

	return (
		<DashboardFrame title={"Dashboard"}>
			<div ref={ref} className="h-screen embed-iframe-container" />
		</DashboardFrame>
	);
}
