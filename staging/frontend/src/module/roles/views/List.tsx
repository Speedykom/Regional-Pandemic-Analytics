import { IGADTable } from "@/components/common/table";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Switch } from "antd";
import { useRoles } from "../hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { getData } from "@/utils";

interface props {
	viewPro: () => void;
}

export const RoleList = () => {
	const edit = () => {};
	const del = () => { };
	const [form] = Form.useForm()

	const [token, setToken] = useState<string>("");

	const fetchToken = async () => {
		try {
			const url = "/api/get-access-token/";
			const response = await getData(url);
			setToken(response?.accessToken);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const [data, setData] = useState([]);

	const [view, setView] = useState<boolean>(false);
	const [roleId, setRoleId] = useState<string>();

	const fetchRoles = async () => {
		try {
			const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/account/roles`;
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setData(response?.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const refetch = () => {
		fetchRoles();
	};

	const formItemLayout = {
		labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		},
		wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		},
	};

	const [open, setOpen] = useState(false);

	const showModal = () => {
		setOpen(true);
	};

	const handleOk = () => {
		setTimeout(() => {
			setOpen(false);
		}, 3000);
	};

	const handleCancel = () => {
		setOpen(false);
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	const { columns, loading } = useRoles({ edit, del, refetch });
	return (
		<div className="">
			<nav>
				<div className="flex justify-between">
					<div>
						<h2 className="text-3xl">App Accounts</h2>
						<p className="my-2 text-gray-600">
							View and manage settings related to app users.
						</p>
					</div>
					<div>
						<Button
							type="primary"
							className="flex items-center"
							icon={<PlusOutlined />}
							style={{
								backgroundColor: "#087757",
								border: "1px solid #e65e01",
							}}
							onClick={showModal}
						>
							New Role
						</Button>
					</div>
				</div>
			</nav>
			<section className="mt-5">
				<div className="py-2">
					<IGADTable
						key={"id"}
						loading={loading}
						rows={data}
						columns={columns}
					/>
				</div>
			</section>

			<Modal
				open={open}
				title={"Create Role"}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Return
					</Button>,
					<Button
						key="submit"
						type="primary"
						style={{
							backgroundColor: "#087757",
							border: "1px solid #e65e01",
						}}
						loading={loading}
						onClick={handleOk}
					>
						Submit
					</Button>,
				]}
			>
				<Form
					{...formItemLayout}
					form={form}
					name="register"
					// onFinish={onFinish}
					scrollToFirstError
					size="large"
					className="w-full"
				>
					<Form.Item
						name="name"
						label="Role Name"
						className="w-full"
						rules={[
							{
								required: true,
								message: "Please input role name",
							},
						]}
					>
						<Input className="w-full" />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
						rules={[
							{
								required: true,
								message: "Please input role description",
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="composite"
						label="Is Composite Role"
						valuePropName="checked"
						// tooltip="Do you want to automatically enable this user?"
					>
						<Switch
							style={{ backgroundColor: "#8c8c8c" }}
						/>
					</Form.Item>

					<Form.Item
						name="clientRole"
						label="Is Client Role"
						valuePropName="checked"
						// tooltip="Do you want to automatically enable this user?"
					>
						<Switch
							style={{ backgroundColor: "#8c8c8c" }}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
