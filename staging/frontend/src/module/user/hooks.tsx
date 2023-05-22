import { ColumnsType } from "antd/es/table";
import { IUser } from "./interface";
import { DummyUsers } from "./dommy";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

export const useUsers = () => {
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
	];

	return { rows: DummyUsers, columns, loading: false };
};
