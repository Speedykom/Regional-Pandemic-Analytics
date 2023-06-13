import { IGADTable } from "@/components/common/table";
import { useDashboards } from "../hooks";
import { IUser } from "../interface";
import { useEffect, useState } from "react";
import axios from "axios";
import { api_url } from "@/utils/auth";

export const DashboardList = () => {
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const viewDash = (id: number) => {
		console.log({dashboardId: id});
	};

	const fetchDashboards = async () => {
		try {
			setLoading(true);
			const url = `${api_url}/api/superset`;
			await axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					setLoading(false);
					setData(res?.data?.data?.result);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchDashboards();
	}, [])

	const { columns } = useDashboards({ view: viewDash });
	return (
		<div className="">
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">App Accounts</h2>
						<p className="mt-2 text-gray-600">
							View and manage settings related to app users.
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
					/>
				</div>
			</section>
		</div>
	);
};
