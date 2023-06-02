import { getData } from "@/utils";
import { countries } from "@/utils/countries";
import { OpenNotification } from "@/utils/notify";
import {
	DeleteColumnOutlined,
	DeleteRowOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import {
	Alert,
	Button,
	Drawer,
	Form,
	Input,
	Radio,
	RadioChangeEvent,
	Select,
	SelectProps,
	Switch,
	notification,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
	refetch: () => void;
}

const genderOptions = [
	{ label: "Male", value: "Male" },
	{ label: "Female", value: "Female" },
];

const myCodeOptions: SelectProps["options"] = [];
const countryOptions: SelectProps["options"] = [];

countries.forEach((item, index) => {
	myCodeOptions.push({
		key: index,
		value: item.code,
		label: item.code,
	});
	countryOptions.push({
		key: index,
		value: item.name,
		label: item.name,
	})
});

const selectBefore = (
	<Select size="large" defaultValue="+232" options={myCodeOptions} />
);

export const AddUser123 = ({ openDrawer, closeDrawer, refetch }: props) => {
	const [enabled, setEnabled] = useState(false);
	const [gender, setGender] = useState<string>();

	const [form] = Form.useForm();
	const router = useRouter();

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
		await axios
			.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user`, values, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})
			.then((res) => {
				closeDrawer();
				refetch();
				OpenNotification(res.data?.message, "topRight", "success");
				form.resetFields();
			})
			.catch((err) => {
				OpenNotification(
					err?.response?.data?.errorMessage,
					"topRight",
					"error"
				);
			});
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

	const onGenderChange = ({ target: { value } }: RadioChangeEvent) => {
		setGender(value);
	};

	useEffect(() => {
		fetchToken();
	}, []);

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
					<Form form={form} onFinish={onFinish}>
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
			<div className="lg:col-span-2">
				<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
					<div className="md:col-span-5">
						<label htmlFor="full_name">Given Names*</label>
						<Input
							type="text"
							name="full_name"
							id="full_name"
							className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
							placeholder="John"
						/>
					</div>

					<div className="md:col-span-5">
						<label htmlFor="full_name">Last Name*</label>
						<Input
							type="text"
							name="full_name"
							id="full_name"
							className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
							placeholder="Doe"
						/>
					</div>

					<div className="md:col-span-5">
						<label htmlFor="email">Email Address*</label>
						<Input
							type="email"
							name="email"
							id="email"
							className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
							placeholder="email@domain.com"
						/>
					</div>

					<div className="md:col-span-3">
						<label htmlFor="address">Username*</label>
						<Input
							type="text"
							name="address"
							id="address"
							className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
							placeholder="john-doe"
						/>
					</div>

					<div className="md:col-span-2">
						<label htmlFor="gender">Gender*</label>
						<Radio.Group
							options={genderOptions}
							onChange={onGenderChange}
							name="gender"
							id="gender"
							size="large"
							className="h-10 mt-1 w-full"
							optionType="button"
							buttonStyle="solid"
						/>
					</div>

					<div className="md:col-span-3 mt-3">
						<label htmlFor="phone">Phone Number*</label>
						<Input
							addonBefore={selectBefore}
							type="number"
							name="phone"
							id="phone"
							size="large"
							placeholder="76293389"
						/>
					</div>

					<div className="md:col-span-2 mt-3">
						<label htmlFor="country">Country*</label>
						<Select
							id="country"
							defaultValue="Germany"
							size="large"
							className="h-10 w-full"
							options={countryOptions}
						/>
					</div>

					<div className="md:col-span-2">
						<label htmlFor="state">State / province</label>
						<div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
							<input
								name="state"
								id="state"
								placeholder="State"
								className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
								value=""
							/>
							<button
								tabIndex={1}
								className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-red-600"
							>
								<svg
									className="w-4 h-4 mx-2 fill-current"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
							<button
								tabIndex={1}
								className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-blue-600"
							>
								<svg
									className="w-4 h-4 mx-2 fill-current"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polyline points="18 15 12 9 6 15"></polyline>
								</svg>
							</button>
						</div>
					</div>

					<div className="md:col-span-1">
						<label htmlFor="zipcode">Zipcode</label>
						<input
							type="text"
							name="zipcode"
							id="zipcode"
							className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
							placeholder=""
							value=""
						/>
					</div>

					<div className="md:col-span-5">
						<div className="inline-flex items-center">
							<input
								type="checkbox"
								name="billing_same"
								id="billing_same"
								className="htmlForm-checkbox"
							/>
							<label htmlFor="billing_same" className="ml-2">
								My billing address is different than above.
							</label>
						</div>
					</div>

					<div className="md:col-span-2">
						<label htmlFor="soda">How many soda pops?</label>
						<div className="h-10 w-28 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
							<button
								tabIndex={1}
								className="cursor-pointer outline-none focus:outline-none border-r border-gray-200 transition-all text-gray-500 hover:text-blue-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mx-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
							<input
								name="soda"
								id="soda"
								placeholder="0"
								className="px-2 text-center appearance-none outline-none text-gray-800 w-full bg-transparent"
								value="0"
							/>
							<button
								tabIndex={1}
								className="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-500 hover:text-blue-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mx-2 fill-current"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div className="md:col-span-5 text-right">
						<div className="inline-flex items-end">
							<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* <Form
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
			</Form> */}
		</Drawer>
	);
};
