import { getData } from "@/utils";
import { OpenNotification } from "@/utils/notify";
import { DeleteColumnOutlined, DeleteRowOutlined, SaveOutlined,  } from "@ant-design/icons";
import {
	Alert,
	Button,
	Drawer,
	Form,
	Input,
	Switch,
	notification,
} from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
	refetch: () => void;
}

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

export const AddUser = ({ openDrawer, closeDrawer, refetch }: props) => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [enabled, setEnabled] = useState(false);

	const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

	const [form] = Form.useForm();
	const [api, contextHolder] = notification.useNotification();
	const router = useRouter()

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

	const onFinish = async (values: any) => {
		await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user`, values, {
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': "application/json"
			},
		}).then((res) => {
			closeDrawer()
			refetch()
			OpenNotification(res.data?.message, 'topRight', 'success')
			form.resetFields()
		}).catch((err) => {
			api.info({
				message: `User Creation`,
				description: err.response.data,
				placement: 'topRight',
				type: "success"
			  });
		})
		
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

	const triggerEnabled = () => {
		if (enabled) {
			setEnabled(false);
		} else {
			setEnabled(true);
		}
		console.log({ enabled });
	};

	useEffect(() => {
		fetchToken()
	}, [])

	return (
		<Drawer
			title={"Create a user"}
			size="large"
			placement={"right"}
			closable={true}
			className="border-2"
			destroyOnClose={true}
			open={openDrawer}
			onClose={closeDrawer}
			width={700}
			footer={
				<div className="flex justify-end space-x-3 py-3 px-4">
					<Form
						form={form}
						onFinish={onFinish}
					>
						<Form.Item>
							<div className="flex space-x-2">
							<Button
								className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
								style={{
									backgroundColor: "#48328526",
									border: "1px solid #48328526",
								}}
									type="primary"
									icon={<DeleteColumnOutlined />}
							>
								Cancel
							</Button>
							<Button
								type="primary"
								className="flex items-center"
								icon={<SaveOutlined />}
								style={{
									backgroundColor: "#087757",
									border: "1px solid #e65e01",
								}}
								htmlType="submit"
							>
								Save User
							</Button>
							</div>
						</Form.Item>
					</Form>
				</div>
			}
		>
			<Form
				{...formItemLayout}
				form={form}
				name="register"
				onFinish={onFinish}
				scrollToFirstError
				size="large"
				className="w-full"
			>
				<Form.Item
					name="firstName"
					label="Given Names"
					className="w-full"
					rules={[
						{
							required: true,
							message: "Please input your given names",
						},
					]}
				>
					<Input className="w-full" />
				</Form.Item>
				<Form.Item
					name="lastName"
					label="Family Name"
					rules={[
						{
							required: true,
							message: "Please input your family name",
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="email"
					label="E-mail"
					rules={[
						{
							type: "email",
							message: "The input is not valid E-mail!",
						},
						{
							required: true,
							message: "Please input your E-mail!",
						},
					]}
				>
					<Input className="w-full" />
				</Form.Item>
				<Form.Item
					name="username"
					label="Username"
					rules={[
						{
							required: true,
							message: "Please input your username",
						},
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name="enabled"
					label="Enable"
					valuePropName="checked"
					tooltip="Do you want to automatically enable this user?"
				>
					<Switch
						checked={enabled}
						onChange={triggerEnabled}
						style={{ backgroundColor: "#8c8c8c" }}
					/>
				</Form.Item>

				{/* <Form.Item
					name="realmRoles"
					label="Assign Roles"
					tooltip="Select roles to assign to the user"
				>
					<Select
						mode="multiple"
						placeholder="Inserted are removed"
						value={selectedItems}
						onChange={setSelectedItems}
						className="w-full"
						style={{ width: "100%" }}
						options={filteredOptions.map((item) => ({
							value: item,
							label: item,
						}))}
					/>
				</Form.Item> */}
			</Form>
		</Drawer>
	);
};
