import { SaveOutlined } from "@ant-design/icons";
import {
	AutoComplete,
	Button,
	Cascader,
	Checkbox,
	Col,
	Drawer,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Switch,
} from "antd";
import { useState } from "react";

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
}

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];

export const AddUser = ({ openDrawer, closeDrawer }: props) => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [enabled, setEnabled] = useState(false);

  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

	const [form] = Form.useForm();

	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
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

	const tailFormItemLayout = {
		wrapperCol: {
			xs: {
				span: 24,
				offset: 0,
			},
			sm: {
				span: 16,
				offset: 8,
			},
		},
	};

	const triggerEnabled = () => {
		if (enabled) {
			setEnabled(false)
		}
		else {
			setEnabled(true)
		}
		console.log({enabled});
		
	}

	return (
		<Drawer
			title={"Create a user"}
			size={"large"}
			placement={"right"}
			closable={true}
			className="border-2"
			destroyOnClose={true}
			open={openDrawer}
			onClose={closeDrawer}
			footer={
				<div className="flex justify-end space-x-3 py-3 px-4">
					<button
						className="focus:outline-none px-8 py-2 text-gray-700 font-medium"
						style={{
							backgroundColor: "#48328526",
						}}
						type="submit"
					>
						Cancel
					</button>
					<Button
						type="primary"
						className="flex items-center"
						icon={<SaveOutlined />}
						style={{
							backgroundColor: "#087757",
							border: "1px solid #e65e01",
						}}
					>
						New User
					</Button>
				</div>
			}
		>
			<Form
				{...formItemLayout}
				form={form}
				name="register"
				onFinish={onFinish}
				style={{ maxWidth: 600 }}
				scrollToFirstError
			>
				<Form.Item
					name="firstName"
					label="Given Names"
					rules={[
						{
							required: true,
							message: "Please input your given names",
						},
					]}
				>
					<Input />
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
					<Input />
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
					<Switch checked={enabled} onChange={triggerEnabled} style={{ backgroundColor: "#8c8c8c" }} />
				</Form.Item>

				<Form.Item
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
				</Form.Item>
				
				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit">
						Register
					</Button>
				</Form.Item>
			</Form>
		</Drawer>
	);
};
