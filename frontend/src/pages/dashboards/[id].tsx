import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { api_url, getGuestToken } from "@/common/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";

export default function SupersetDashboard() {
	let ref = useRef<HTMLDivElement>(null);
	const [uuid, setUuid] = useState('')
	const router = useRouter()

	// const viewDash = async(id: string) => {
	// 	const response = await axios.get(
	// 		`${api_url}/api/superset/dashboard/embed/${router.query?.id}`, {
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			}
	// 		}
	// 	)
	// 	if (response.status === 404) {
	// 		await axios.post(
	// 			`${api_url}/api/superset/dashboard/enable-embed`, {
	// 				uid: router.query?.id
	// 			}, {
	// 				headers: {
	// 					'Content-Type': 'application/json'
	// 				}
	// 			}
	// 		).then((res) => {
	// 			const dashboardUUID = res?.data?.result?.uuid;
	// 			setUuid(dashboardUUID)
				
	// 		})
	// 	} else {
	// 		setUuid(response.data?.result?.uuid)
	// 	}
	// };

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
