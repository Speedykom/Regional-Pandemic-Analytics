import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IGADTable } from "@/common/components/common/table";
import { IUser } from "@/modules/user/interface";
import { BASE_URL } from "@/common/config";
import axios from "axios";

export const DashboardList = () => {
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

	const fetchDashboards = async () => {
		setLoading(true);
		const url = `${BASE_URL}/api/superset/list`;
		await axios
			.get(url, {
				headers: {
					"Content-Type": "application/json",
					'Accept': "application/json",
				},
			})
			.then((res) => {
				setLoading(false);
				setData(res?.data?.result);
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
				</div>
			</section>
		</div>
	);
};
