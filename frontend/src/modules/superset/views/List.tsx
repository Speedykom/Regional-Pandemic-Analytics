import { useDashboards } from "../hooks";
import { useRouter } from "next/router";
import { useGetDashboardsQuery } from "../superset";
import {
	Badge,
	Button,
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text
} from "@tremor/react";
import MediaQuery from "react-responsive";
import {
	CheckIcon,
	ExclamationCircleIcon,
	EyeIcon
} from "@heroicons/react/24/outline";

export const DashboardList = () => {
	const { data, isFetching, isError } = useGetDashboardsQuery();
	const router = useRouter();

	const embedDashboard = (id: string) => {
		router.push(`/dashboards/${id}`);
	};

	const { columns } = useDashboards();
	return (
		<div className="">
			<nav className="mb-5">
				<div>
					<h2 className="text-3xl">Superset Dashboards</h2>
					<p className="mt-2 text-gray-600">
						Dashboard list created on Apache Superset.
					</p>
				</div>
			</nav>
			<div>
				<Card className="bg-white">
					<Table>
						<TableHead>
							<TableRow>
								<TableHeaderCell>Title</TableHeaderCell>
								<MediaQuery minWidth={768}>
									<TableHeaderCell className="">Created By</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1090}>
									<TableHeaderCell className="">Created</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1220}>
									<TableHeaderCell className="">Modified By</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1350}>
									<TableHeaderCell className="">Modified</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1624}>
									<TableHeaderCell className="">Status</TableHeaderCell>
								</MediaQuery>
								<TableHeaderCell></TableHeaderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(data?.result || []).map((item, index) => (
								<TableRow key={index}>
									<TableCell>
										<Text className="font-sans">{item.dashboard_title}</Text>
									</TableCell>
									<MediaQuery minWidth={768}>
										<TableCell className="">
											<Text>
												{item.created_by.first_name} {item.created_by.last_name}
											</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1090}>
										<TableCell className="">
											<Text>{item.created_on_delta_humanized}</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1220}>
										<TableCell className="">
											<Text>
												{item.changed_by.first_name} {item.changed_by.last_name}
											</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1350}>
										<TableCell className="">
											<Text> {item.changed_on_delta_humanized}</Text>
										</TableCell>
										<TableCell className="">
											{item.status == "published" ? (
												<Badge
													className="flex items-center space-x-1"
													icon={CheckIcon}
													color="indigo"
												>
													{item.status}
												</Badge>
											) : (
												<Badge icon={ExclamationCircleIcon} color="red">
													{item.status}
												</Badge>
											)}{" "}
										</TableCell>
									</MediaQuery>
									<TableCell>
										<div className="flex space-x-2 justify-end">
											<Button
												icon={EyeIcon}
												title="View Details"
												variant="primary"
												className="text-white shadow-md bg-prim"
												onClick={() => embedDashboard(String(item?.id))}
											>
												Preview
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
		</div>
	);
};
