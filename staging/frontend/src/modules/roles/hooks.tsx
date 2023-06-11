import { ColumnsType } from "antd/es/table";
import { IRoles } from "./interface";
import { Popconfirm, Tag } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/components/common/action";
import axios from "axios";
import { OpenNotification } from "@/utils/notify";

interface props {
	edit: (id: string, name: string, description: string) => void;
	del: () => void;
	refetch: () => void;
}

export const useRoles = ({ edit, del, refetch }: props) => {
	const action = (id: string, name: string, description: string) => {
		const deleteRole = async () => {
			await axios
				.delete(
					`${process.env.NEXT_PUBLIC_BASE_URL}/api/role/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					OpenNotification(res?.data?.message, "topRight", "success");
					refetch();
				})
				.catch((err) => {
					OpenNotification(
						err.response?.data?.errorMessage,
						"topRight",
						"error"
					);
				});
		};
		return (
			<Action>
				<ul>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault();
								edit(id, name, description);
							}}
							className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEdit className="mt-1" /> <span>Edit</span>
						</button>
					</li>
					<li>
						<Popconfirm
							placement="left"
							title={"Delete Role"}
							description={"Are you sure you want to delete this role"}
							onConfirm={deleteRole}
							okText="Yes"
							cancelText="No"
							okType="link"
							okButtonProps={{
								style: { backgroundColor: "#3f96ff", color: "white" },
							}}
						>
							<button className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white">
								<FiTrash className="mt-1" /> <span>Delete</span>
							</button>
						</Popconfirm>
					</li>
				</ul>
			</Action>
		);
	};

	const columns: ColumnsType<IRoles> = [
		{
			// fixed: "left",
			title: "Role Name",
			key: "name",
			dataIndex: "name",
			render: (name) => name,
			className: "text-gray-700",
			ellipsis: true,
		},
		{
			title: "Description",
			key: "description",
			dataIndex: "description",
			render: (description) => description,
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Composite",
			key: "composite",
			dataIndex: "composite",
			render: (composite) => (
				<div>
					{composite ? (
						<Tag
							className="flex items-center text-lg"
							icon={<CheckCircleOutlined />}
							color="processing"
						>
							True
						</Tag>
					) : (
						<Tag
							className="flex items-center text-lg"
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
			title: "Client Role",
			key: "clientRole",
			dataIndex: "clientRole",
			render: (clientRole) => (
				<div>
					{clientRole ? (
						<Tag
							className="flex items-center text-lg"
							icon={<CheckCircleOutlined />}
							color="warning"
						>
							True
						</Tag>
					) : (
						<Tag
							className="flex items-center text-lg"
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
			align: "right",
			width: 100,
			key: "action",
			render: (id, record) => action(id.id, record.name, record.description),
		},
	];

	return { columns, loading: false };
};

export const fetchRoles = async () => {
	const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/roles`;
	return await axios.get(url).then((res) => {
		return res.data;
	}).catch((err) => {
		console.log(err?.response)
	});
};
