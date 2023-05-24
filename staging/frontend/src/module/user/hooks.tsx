import { ColumnsType } from "antd/es/table";
import { IUser } from "./interface";
import { DummyUsers } from "./dommy";
import { Popconfirm, Tag } from "antd";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/components/common/action";
import { PreviewUser } from "./views/Preview";
import { useState } from "react";
import axios from "axios";
import { OpenNotification } from "@/utils/notify";

interface props {
	edit: () => void;
	del: () => void;
	viewPro: (id: string) => void;
	refetch: () => void;
}

export const useUsers = ({ edit, del, viewPro, refetch }: props) => {
	const action = (id: string) => {
		const deleteUser = async () => {
			await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user/${id}/delete`, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((res) => {
				refetch()
				OpenNotification(res.data?.message, 'topRight', 'success')
			}).catch((err) => {
				OpenNotification(err.response?.data, 'topRight', 'error')
			})
		}
		return (
			<Action>
				<ul>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault
								viewPro(id)
							}}
							className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEye className="mt-1" /> <span>Preview</span>
						</button>
					</li>
					<li>
						<button
							onClick={edit}
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

	const columns: ColumnsType<IUser> = [
		{
			// fixed: "left",
			title: "Full Name",
			key: "firstName",
			dataIndex: "firstName",
			render: (firstName, record) => (
				<div className="flex items-center pr-1">
					<div>
						<div className="w-10 h-10 mr-3 overflow-hidden rounded-full flex items-center justify-center border border-gray-400">
							<img src="/avater.png" className="w-full h-full" />
						</div>
					</div>
					<p className="font-sans text-base">
						{record.firstName} {record?.lastName}
					</p>
				</div>
			),
			className: "text-gray-700",
			ellipsis: true,
		},
		{
			title: "Email",
			key: "email",
			dataIndex: "email",
			render: (email) => email,
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Username",
			key: "username",
			dataIndex: "username",
			render: (username) => username,
			className: "text-gray-700 font-sans",
			ellipsis: true,
		},
		{
			title: "Email Verified",
			key: "emailVerified",
			dataIndex: "emailVerified",
			render: (emailVerified, record) => (
				<div>
					{record.emailVerified ? (
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
			title: "Enabled",
			key: "enabled",
			dataIndex: "enabled",
			render: (enabled, record) => (
				<div>
					{record.enabled ? (
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
			render: (id) => action(id.id),
		},
	];

	return { rows: DummyUsers, columns, loading: false };
};
