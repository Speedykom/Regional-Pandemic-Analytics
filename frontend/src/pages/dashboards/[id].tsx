import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { getGuestToken } from "@/common/utils/auth";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";
import getConfig from 'next/config'
 
const { publicRuntimeConfig } = getConfig()

export default function SupersetDashboard() {
	let ref = useRef(null);
	const [uuid, setUUID] = useState("");

	const tokens: any = secureLocalStorage.getItem("tokens");
	const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 
	const viewDash = async () => {
		const dashId = location.href.substring(location.href.lastIndexOf('/') + 1);
			await axios
				.post(
					`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/superset/dashboard/enable-embed`,
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
		
	};

	const embedDash = async () => {
		if (ref.current) {
			await embedDashboard({
				id: uuid, // given by the Superset embedding UI
				supersetDomain: `${publicRuntimeConfig.NEXT_PUBLIC_SUPERSET_URL}`,
				mountPoint: ref.current, // html element in which iframe render
				fetchGuestToken: () => getGuestToken(uuid),
				dashboardUiConfig: {
					hideTitle: true,
					hideTab: true,
					filters: {
						expanded: true,
						visible: true,
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
