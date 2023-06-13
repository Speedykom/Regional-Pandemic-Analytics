import { ColumnsType } from "antd/es/table";
import { IDashboard, IUser } from "./interface";
import { Popconfirm, Tag } from "antd";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/components/common/action";
import axios from "axios";
import { OpenNotification } from "@/utils/notify";

interface props {
	view: (id: number) => void;
}

export const useDashboards = ({ view }: props) => {
	const action = (id: number) => {
		return (
			<Action>
				<ul>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault;
								view(id);
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
			width: 250,
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
			width: 200,
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
			width: 200,
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
			title: "Managed Externally",
			key: "is_managed_externally",
			dataIndex: "is_managed_externally",
			render: (is_managed_externally, record) => (
				<div className="flex">
					{record.is_managed_externally ? (
						<Tag
							className="flex items-center"
							icon={<CheckCircleOutlined />}
							color="processing"
						>
							True
						</Tag>
					) : (
						<Tag
							className="flex items-center"
							icon={<ClockCircleOutlined />}
							color="default"
						>
							False
						</Tag>
					)}{" "}
				</div>
			),
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
		{
			align: "right",
			width: 100,
			key: "action",
			render: (id, record) => action(record.id),
		},
	];

	return { columns, loading: false };
};
