import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IGADTable } from "@/common/components/common/table";
import { IUser } from "@/modules/user/interface";
import { BASE_URL } from "@/common/config";

export const DashboardList = () => {
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

	const fetchDashboards = async () => {
		// const myToken = await token();
		setLoading(true);
		const url = `${BASE_URL}/api/superset/list`;
		const data = await fetch(url)
		if (data.status == 200) {
			data.json().then((d) => {
				setLoading(false)
				setData(d?.result)
			})
		} else {
			console.log({error: data})
		}
	};

	const rowAction = (id: string) => {
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
							onClick: () => rowAction(record.id),
						})}
					/>
				</div>
			</section>
		</div>
	);
};
