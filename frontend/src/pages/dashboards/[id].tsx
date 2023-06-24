/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import { getGuestToken } from "@/common/utils/auth";
import axios from "axios";
import { useRouter } from "next/router";
import { BASE_URL, SUPERSET_URL } from "@/common/config";
import Layout from "@/common/components/layout";
import { Breadcrumb } from "antd";
import Link from "next/link";

export default function SupersetDashboard() {
	let ref = useRef(null);
	const [uuid, setUUID] = useState("");

	const viewDash = async () => {
		const dashId = location.href.substring(location.href.lastIndexOf('/') + 1);
		const response = await axios.get(
			`${BASE_URL}/api/superset/dashboard/embed/${dashId}`,
			{
				headers: {
					"Content-Type": "application/json",
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
    <Layout title="View Dashboard">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl mb-2">View Dashboard</h2>
          <Breadcrumb                                                                                          
            items={[
              {
                title: <Link href="/">Home</Link>,
              },
              {
                title: <Link href="/dashboards">Dashboard</Link>,
              },
              {
                title: "View Dashboard",
              },
            ]}
          />
        </div>
      </div>
      <div ref={ref} className="h-screen embed-iframe-container mb-8" />
    </Layout>
  );
}
