import {
	Card,
	Title,
	Text,
	Flex,
	Table,
	TableRow,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableBody,
	Badge,
	Button,
	Color,
} from "@tremor/react";
import axios from "axios";
import { useRouter } from "next/router";
import { api_url } from "@/utils/auth";

interface IDashboardItem {
	id: string;
	dashboard_title: string;
	changed_by_name: string;
	status: string;
	changed_on_delta_humanized: string;
	created_by: {
		first_name: string;
		last_name: string;
	};
}

export interface IListDashboardsProps {
	data: {
		count: number;
		result: IDashboardItem[];
	};
}

const colors: { [key: string]: Color } = {
	draft: "gray",
	published: "emerald",
};

export default function ListDashboards({ data }: IListDashboardsProps) {
	const router = useRouter();

	const btnViewClick = async (
		e: React.MouseEvent<HTMLButtonElement>,
		id: string,
		dashboardTitle: string
	) => {
		e.preventDefault();
		try {
			const response = await axios.get(
				`${api_url}/api/v1/dashboard/${id}/embedded`
			);
			const dashboardUUID = response?.data?.result?.uuid;
			router.push({
				pathname: `/dashboard/superset-dashboards/${dashboardUUID}/`,
				query: { dashboardTitle },
			});
		} catch (error) {
			console.error("Error fetching item:", error);
		}
	};

	return (
		<Card>
			<Flex justifyContent="start" className="space-x-2">
				<Title>Total Dashboard(s)</Title>
				<Badge color="gray">{data?.count}</Badge>
			</Flex>
			<Text className="mt-2">Created on Apache Superset</Text>

			<Table className="mt-6">
				<TableHead>
					<TableRow>
						<TableHeaderCell>Title</TableHeaderCell>
						<TableHeaderCell>Modified By</TableHeaderCell>
						<TableHeaderCell>Status</TableHeaderCell>
						<TableHeaderCell>Modified</TableHeaderCell>
						<TableHeaderCell>Created By</TableHeaderCell>
						<TableHeaderCell>Link</TableHeaderCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{data?.result?.map((item, index: number) => (
						<TableRow key={index}>
							<TableCell>{item?.dashboard_title}</TableCell>
							<TableCell>{item?.changed_by_name}</TableCell>
							<TableCell>
								<Badge color={colors[item.status]} size="xs">
									{item?.status}
								</Badge>
							</TableCell>
							<TableCell>{item?.changed_on_delta_humanized}</TableCell>
							<TableCell>
								{item?.created_by?.first_name} {item?.created_by?.last_name}
							</TableCell>
							<TableCell>
								{item.status == "published" && (
									<Button
										size="xs"
										variant="secondary"
										color="gray"
										onClick={(e) =>
											btnViewClick(e, `${item?.id}`, `${item?.dashboard_title}`)
										}
									>
										View
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
	);
}
