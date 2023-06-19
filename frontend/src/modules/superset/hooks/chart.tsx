import { ColumnsType } from "antd/es/table";
import { IDashboard } from "../interface";

interface props {
	view: (id: number, dashboard_title: string) => void;
}

export const useCharts = () => {
	
	const columns: ColumnsType<IDashboard> = [
		{
			// fixed: "left",
			title: "Chart",
			key: "slice_name",
			dataIndex: "slice_name",
			ellipsis: true
		},
		{
			title: "Visualization Type",
			key: "viz_type",
			dataIndex: "viz_type",
			ellipsis: true
		},
		{
			title: "Dataset",
			key: "datasource_name_text",
			dataIndex: "datasource_name_text",
			ellipsis: true,
		},
		{
			title: "Modified By",
			key: "changed_by_name",
			dataIndex: "changed_by_name",
			ellipsis: true
		},
		{
			title: "Last Modified",
			key: "changed_on_delta_humanized",
			dataIndex: "changed_on_delta_humanized",
			ellipsis: true,
		},
		{
			title: "Created By",
			key: "created_by",
			dataIndex: "created_by",
			ellipsis: true,
			render: (data) => {
				return <p>{`${data.first_name} ${data.last_name}`}</p>
			}
		},
	];

	return { columns, loading: false };
};
