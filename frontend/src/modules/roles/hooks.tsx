import { ColumnsType } from "antd/es/table";
import { Role } from "./interface";
import { Popconfirm, Tag } from "antd";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/common/components/common/action";
import axios from "axios";
import { OpenNotification } from "@/common/utils/notify";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
interface props {
	edit: (id: string, name: string, description: string) => void;
	del: () => void;
	view: (id: string) => void;
	refetch: () => void;
}

export const useRoles = ({ edit, view, del, refetch }: props) => {
	const action = (id: string, name: string, description: string) => {
		const deleteUser = async () => {
			await axios
				.delete(
					`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/roles/${id}/delete`,
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					refetch();
					OpenNotification(res.data?.message, "topRight", "success");
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
								view(id);
							}}
							className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEye className="mt-1" /> <span>View</span>
						</button>
					</li>
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
							title={"Delete User"}
							description={"Are you sure you want to delete this user"}
							onConfirm={deleteUser}
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

	const columns: ColumnsType<Role> = [
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
						<Tag icon={<CheckCircleOutlined />} color="processing">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
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
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
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
	const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/roles`;
	return await axios
		.get(url)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err?.response);
		});
};

export const useAttributes = () => {
	const columns: ColumnsType<any> = [
		{
			title: "Permissions",
			key: "key",
			dataIndex: "key",
			className: "text-gray-700 font-sans",
			ellipsis: true,
			width: 250,
		},
		{
			title: "Create",
			key: "create",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.create ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Read",
			key: "read",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.read ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Update",
			key: "update",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.update ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Delete",
			key: "delete",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.delete ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
	];

	return { columns };
};

export const useAttributeForEdit = () => {
	const columns: ColumnsType<any> = [
		{
			title: "Permissions",
			key: "key",
			dataIndex: "key",
			className: "text-gray-700 font-sans",
			ellipsis: true,
			width: 250,
		},
		{
			title: "Create",
			key: "create",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.create ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Read",
			key: "read",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.read ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Update",
			key: "update",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.update ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Delete",
			key: "delete",
			dataIndex: "value",
			render: (value) => (
				<div>
					{value.delete ? (
						<Tag icon={<CheckCircleOutlined />} color="warning">
							True
						</Tag>
					) : (
						<Tag icon={<ClockCircleOutlined />} color="default">
							False
						</Tag>
					)}{" "}
				</div>
			),
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
	];

	return { columns };
};
