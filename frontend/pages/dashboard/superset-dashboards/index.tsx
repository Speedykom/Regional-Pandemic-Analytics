import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { useEffect, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import ListDashboards, {
	IListDashboardsProps,
} from "@/components/Superset/ListDashboards";
import { getData } from "@/utils";
import axios from "axios";
import { api_url } from "@/utils/auth";

export default function SupersetDashboard() {
	const [data, setData] = useState<IListDashboardsProps["data"]>({
		count: 0,
		result: [],
	});

	const fetchDashboards = async () => {
		try {
			const url = `${api_url}/api/superset`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			setData(response?.data?.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchDashboards();
	}, []);

	return (
		<DashboardFrame title="List(s) of Dashboards">
			<div className="mb-4">
				<ListDashboards data={data} />
			</div>
		</DashboardFrame>
	);
}
