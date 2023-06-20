import { useDashboards } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { api_url } from "@/common/utils/auth";
import { IGADTable } from "@/common/components/common/table";
import { IUser } from "@/modules/user/interface";

export const DashboardList = () => {
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();

	const token = async () => {
		return await axios
			.post(
				`http://localhost:8088/api/v1/security/login`,
				{
					username: "admin",
					password: "admin",
					provider: "db",
					refresh: true,
				},
				{
					headers: {
						Accept: "application/json",
					},
				}
			)
			.then((res) => {
				return res?.data?.access_token;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const fetchDashboards = async () => {
		// const myToken = await token();
		setLoading(true);
		const url = `http://localhost:3000/api/superset/get-list`;
		const data = await fetch(url)
		if (data.status == 200) {
			console.log(data)
			data.json().then((d) => {
				setLoading(false)
				setData(d?.result)
			})
		} else {
			console.log({error: data})
		}
		// await axios
		// 	.get(url, {
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			Authorization: `Bearer ${myToken}`,
		// 		},
		// 	})
		// 	.then((res) => {
		// 	console.log({res})
		// 		setLoading(false);
		// 		setData(res?.data?.result);
		// 	});
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
