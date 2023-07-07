import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IGADTable } from "@/common/components/common/table";
import { IUser } from "@/modules/user/interface";
import { BASE_URL } from "@/common/config";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

export const DashboardList = () => {
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState("")
	const router = useRouter();

	const fetchDashboards = async () => {
		const tokens: any = secureLocalStorage.getItem("tokens");
		const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 
		setLoading(true);
		const url = `${BASE_URL}/api/superset/list`;
		await axios
			.get(url, {
				headers: {
					"Content-Type": "application/json",
					'Accept': "application/json",
					'Authorization': `Bearer ${accessToken}`
				},
			})
			.then((res) => {
				setLoading(false);
				setData(res?.data?.result || null);
			}).catch((err) => {
				setLoading(false);
				setData([]);
				setError("error fetching dashboards found")
			});
	};

	const embedDashboard = (id: string) => {
		router.push(`/dashboards/${id}`);
	};

	useEffect(() => {
		fetchDashboards();
	}, []);

	const { columns } = useDashboards();
	return (
		<div className="">
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">Superset Dashboards</h2>
						<p className="mt-2 text-gray-600">
							Dashboard list created on Apache Superset.
						</p>
					</div>
				</div>
			</nav>
			<section className="mt-2">
				<div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						rows={data}
						columns={columns}
						onRow={(record: any) => ({
							onClick: () => embedDashboard(record.id),
						})}
					/>
					{error && <p className="mt-3 text-sm text-gray-400">error fetching data, {error}</p>}
				</div>
			</section>
		</div>
	);
};
