import { useDashboards } from "../hooks";
import { useRouter } from "next/router";
import { IGADTable } from "@/common/components/common/table";
import { useGetDashboardsQuery } from "../superset";
 
export const DashboardList = () => {
	const { data, isFetching, isError } = useGetDashboardsQuery()
	const router = useRouter();

	const embedDashboard = (id: string) => {
		router.push(`/dashboards/${id}`);
	};

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
						loading={isFetching}
						rows={data?.result || []}
						columns={columns}
						onRow={(record: any) => ({
							onClick: () => embedDashboard(record.id),
						})}
					/>
					{isError && <p className="mt-3 text-sm text-gray-400">Unable to fetch data</p>}
				</div>
			</section>
		</div>
	);
};
