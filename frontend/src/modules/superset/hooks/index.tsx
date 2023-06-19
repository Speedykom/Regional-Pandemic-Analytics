import { ColumnsType } from "antd/es/table";
import { IDashboard } from "../interface";
import { Tag } from "antd";
import { FiEye } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/common/components/common/action";

interface props {
	view: (id: number, dashboard_title: string) => void;
}

export const useDashboards = ({ view }: props) => {
	const action = (id: number, dashboard_title: string) => {
		return (
			<Action>
				<ul>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault;
								view(id, dashboard_title);
							}}
							className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEye className="mt-1" /> <span>Preview</span>
						</button>
					</li>
				</ul>
			</Action>
		);
	};

	const columns: ColumnsType<IDashboard> = [
		{
			// fixed: "left",
			title: "Title",
			key: "dashboard_title",
			dataIndex: "dashboard_title",
			render: (dashboard_title) => (
				<div className="flex items-center pr-1">
					<p className="font-sans">{dashboard_title}</p>
				</div>
			),
			className: "text-gray-700",
			ellipsis: true,
			width: 350,
		},
		{
			title: "Created By",
			key: "created_by",
			dataIndex: "created_by",
			render: (created_by, record) => (
				<div className="pr-1">
					<p className="font-sans">
						{record.created_by.first_name} {record.created_by.last_name}
					</p>
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
			width: 250,
		},
		{
			title: "Created",
			key: "created_on_delta_humanized",
			dataIndex: "created_on_delta_humanized",
			render: (created_on_delta_humanized, record) =>
				record.created_on_delta_humanized,
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Modified By",
			key: "changed_by",
			dataIndex: "changed_by",
			render: (changed_by, record) => (
				<div className="pr-1">
					<p className="font-sans">
						{record.changed_by.first_name} {record.changed_by.last_name}
					</p>
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
			width: 250,
		},
		{
			title: "Modified",
			key: "changed_on_delta_humanized",
			dataIndex: "changed_on_delta_humanized",
			render: (changed_on_delta_humanized, record) =>
				record.changed_on_delta_humanized,
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Status",
			key: "status",
			dataIndex: "status",
			render: (status, record) => (
				<div className="flex">
					{record.status == 'published' ? (
						<Tag
							className="flex items-center"
							icon={<CheckCircleOutlined />}
							color="success"
						>
							{record.status}
						</Tag>
					) : (
						<Tag
							className="flex items-center"
							icon={<ClockCircleOutlined />}
							color="default"
						>
							{record.status}
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		// {
		// 	align: "right",
		// 	width: 100,
		// 	key: "action",
		// 	render: (id, record) => action(record.id, record.dashboard_title),
		// },
	];

	return { columns, loading: false };
};
