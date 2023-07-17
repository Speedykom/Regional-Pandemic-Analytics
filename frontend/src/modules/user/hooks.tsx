import { ColumnsType } from "antd/es/table";
import { IUser } from "./interface";
import { Button, Popconfirm, Tag } from "antd";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Action } from "@/common/components/common/action";
import axios from "axios";
import { OpenNotification } from "@/common/utils/notify";
import getConfig from 'next/config'
import secureLocalStorage from "react-secure-storage";
const { publicRuntimeConfig } = getConfig()
interface props {
	edit: (
		id: string,
		firstName: string,
		lastName: string,
		username: string,
		email: string,
		enabled: boolean,
		code: string,
		phone: string,
		country: string,
		gender: string,
		avatar: string,
		editLoad: boolean,
		userRole: any
	) => void;
	viewPro: (id: string) => void;
	refetch: () => void;
}

export const useUsers = ({ edit, viewPro, refetch }: props) => {
	const action = (
		id: string,
		firstName: string,
		lastName: string,
		username: string,
		email: string,
		enabled: boolean,
		code: string,
		phone: string,
		country: string,
		gender: string,
		avatar: string
	) => {
		let editLoad: boolean = false;

		const deleteUser = async () => {
			const tokens: any = secureLocalStorage.getItem("tokens") as object;
			const accessToken =
				tokens && "accessToken" in tokens ? tokens.accessToken : "";

			await axios
				.delete(
					`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/user/${id}/delete`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					}
				)
				.then((res) => {
					OpenNotification("User archived successfully", "topRight", "success");
					refetch();
				})
				.catch((err) => {
					OpenNotification(err.response?.data, "topRight", "error");
				});
		};
		const editRec = async () => {
			editLoad = true
			const tokens: any = secureLocalStorage.getItem("tokens") as object;
			const accessToken =
				tokens && "accessToken" in tokens ? tokens.accessToken : "";
			
			await axios
				.get(`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/user/${id}/roles`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => {
					editLoad = false;
					const userRole = res.data
					edit(
						id,
						firstName,
						lastName,
						username,
						email,
						enabled,
						code,
						phone,
						country,
						gender,
						avatar,
						editLoad,
						userRole
					);
				});
		};
		return (
			<Action>
				<ul>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault;
								viewPro(id);
							}}
							className="flex space-x-2 border-b w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEye className="mt-1" /> <span>Preview</span>
						</button>
					</li>
					<li>
						<button
							onClick={(e) => {
								e.preventDefault();
								editLoad = true
								editRec();
							}}
							className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
						>
							<FiEdit className="mt-1" /> <span>Edit</span>
						</button>
					</li>
					<li>
						<Popconfirm
							placement="left"
							title={"Disable User"}
							description={"Are you sure you want to disable this user"}
							onConfirm={deleteUser}
							okText="Yes"
							cancelText="No"
							okType="link"
							okButtonProps={{
								style: { backgroundColor: "#3f96ff", color: "white" },
							}}
						>
							<button className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white">
								<FiTrash className="mt-1" /> <span>Disable User</span>
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
						<div className="w-10 h-10 mr-3 overflow-hidden rounded-full flex items-center justify-center border border-gray-300">
							<img
								src={
									record?.attributes?.avatar &&
									record?.attributes?.avatar[0] != ""
										? record?.attributes?.avatar[0]
										: "/avater.png"
								}
								className="w-full h-full"
							/>
						</div>
					</div>
					<p className="font-sans">
						{record.firstName} {record?.lastName}
					</p>
				</div>
			),
			className: "text-gray-700",
			ellipsis: true,
			width: 200,
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
			title: "Email",
			key: "email",
			dataIndex: "email",
			render: (email) => email,
			className: "text-gray-700 font-sans",
			ellipsis: true,
			width: 350,
			responsive: ["lg"]
		},
		{
			title: "Phone",
			key: "attributes",
			dataIndex: "attributes",
			render: (attributes) =>
				attributes?.phone
					? `${attributes?.code ? attributes?.code[0] : ""}${
							attributes?.phone[0]
					  }`
					: "",
			className: "text-gray-700 font-sans",
			ellipsis: true,
			responsive: ["lg"]
		},
		{
			title: "Gender",
			key: "attributes",
			dataIndex: "attributes",
			render: (attributes) =>
				attributes?.gender ? attributes?.gender[0] : "None",
			className: "text-gray-700 font-sans",
			ellipsis: true,
			responsive: ["md"]
		},
		{
			title: "Country",
			key: "attributes",
			dataIndex: "attributes",
			render: (attributes) =>
				attributes?.country ? attributes?.country[0] : "None",
			className: "text-gray-700 font-sans",
			ellipsis: true,
			responsive: ["lg"]
		},
		{
			title: "Email Verified",
			key: "emailVerified",
			dataIndex: "emailVerified",
			render: (emailVerified, record) => (
				<div className="flex">
					{record.emailVerified ? (
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
			responsive: ["lg"]
		},
		{
			title: "Enabled",
			key: "enabled",
			dataIndex: "enabled",
			render: (enabled, record) => (
				<div className="flex">
					{record.enabled ? (
						<Tag
							className="flex items-center"
							icon={<CheckCircleOutlined />}
							color="warning"
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
			responsive: ["lg"]
		},
		{
			align: "right",
			width: 100,
			key: "action",
			render: (id, record) =>
				action(
					record.id,
					record.firstName,
					record.lastName,
					record.username,
					record.email,
					record.enabled,
					record.attributes?.code ? record.attributes?.code[0] : "",
					record.attributes?.phone ? record.attributes?.phone[0] : "",
					record.attributes?.country ? record.attributes?.country[0] : "",
					record.attributes?.gender ? record.attributes?.gender[0] : "",
					record.attributes?.avatar ? record.attributes?.avatar[0] : ""
				),
		},
	];

	return { columns, loading: false };
};
