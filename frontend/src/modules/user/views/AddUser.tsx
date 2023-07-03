import { DeleteColumnOutlined, SaveOutlined } from "@ant-design/icons";
import {
	Button,
	Drawer,
	Form,
	Input,
	InputNumber,
	Radio,
	RadioChangeEvent,
	Select,
	SelectProps,
	Switch,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { countries } from "@/common/utils/countries";
import { getData } from "@/common/utils";
import { OpenNotification } from "@/common/utils/notify";
import { BASE_URL } from "@/common/config";
import secureLocalStorage from "react-secure-storage";

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
	});
});

export const AddUser123 = ({ openDrawer, closeDrawer, refetch }: props) => {
	const [enabled, setEnabled] = useState<boolean>(false);
	const [emailVerified, setVerify] = useState<boolean>(false);
	const [gender, setGender] = useState<string>();
	const [roles, setRoles] = useState([])
	const [roleLoading, setRoleLoading] = useState(true)

	const [code, setCode] = useState<string>();

	const selectBefore = (
		<Select
			size="large"
			value={code}
			onChange={setCode}
			showSearch
			placeholder="+232"
			options={myCodeOptions}
		/>
	);

	const [form] = Form.useForm();

	const onFinish = async (values: any) => {
		const tokens: any = secureLocalStorage.getItem("tokens") as object;
		values["enabled"] = enabled;
		values["emailVerified"] = emailVerified;
		values["code"] = code;
		values["role"] = JSON.parse(values["role"])

		await axios
			.post(`${BASE_URL}/api/account/user`, values, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${tokens?.accessToken}`
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

	const triggerEnabled = () => {
		if (enabled == true) {
			setEnabled(false);
		} else if (enabled == false) {
			setEnabled(true);
		}
	};

	const triggerVerify = () => {
		if (emailVerified) {
			setVerify(false);
		} else {
			setVerify(true);
		}
	};

	const onGenderChange = ({ target: { value } }: RadioChangeEvent) => {
		setGender(value);
	};

	const fetchRoles = async () => {
		const tokens: any = secureLocalStorage.getItem("tokens") as object;
		try {
			setRoleLoading(true)
			const url = `${BASE_URL}/api/role`;
			await axios.get(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokens?.accessToken}`
				},
			}).then((res) => {
				setRoleLoading(false)
				setRoles(res?.data);
			})
			
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchRoles();
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
									size="large"
									icon={<DeleteColumnOutlined />}
									onClick={() => {
										form.resetFields();
										closeDrawer();
									}}
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
									size="large"
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
			<Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
				<div className="lg:col-span-2">
					<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
						<div className="md:col-span-5">
							<label htmlFor="firstName">Given Names*</label>
							<Form.Item
								name={"firstName"}
								rules={[
									{
										required: true,
										message: "Please input your given names",
									},
								]}
							>
								<Input
									type="text"
									name="firstName"
									id="firstName"
									className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									placeholder="John"
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-5">
							<label htmlFor="lastName">Last Name*</label>
							<Form.Item
								name={"lastName"}
								rules={[
									{
										required: true,
										message: "Please input your family name",
									},
								]}
							>
								<Input
									type="text"
									name="lastName"
									id="lastName"
									className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									placeholder="Doe"
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-5">
							<label htmlFor="email">Email Address*</label>
							<Form.Item
								name={"email"}
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
								<Input
									type="email"
									name="email"
									id="email"
									className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									placeholder="email@domain.com"
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-3">
							<label htmlFor="username">Username*</label>
							<Form.Item
								name="username"
								rules={[
									{
										required: true,
										message: "Please input your username",
									},
								]}
							>
								<Input
									type="text"
									name="username"
									id="username"
									className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									placeholder="john-doe"
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-2">
							<label htmlFor="gender">Gender*</label>
							<Form.Item
								name={"gender"}
								rules={[
									{
										required: true,
										message: "Please select gender",
									},
								]}
							>
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
							</Form.Item>
						</div>

						<div className="md:col-span-3">
							<label htmlFor="phone">Phone Number*</label>
							<div className="flex items-center">
								<Form.Item
									className="w-full"
									name={"phone"}
									rules={[
										{
											required: true,
											message: "Please input your number",
										},
									]}
								>
									<Input
										type="number"
										addonBefore={selectBefore}
										size="large"
										placeholder={"76293389"}
										className="mt-1 bg-gray-50 w-full"
									/>
								</Form.Item>
							</div>
						</div>	

						<div className="md:col-span-2">
							<label htmlFor="country">Country*</label>
							<Form.Item
								name={"country"}
								rules={[
									{
										required: true,
										message: "Please select your country",
									},
								]}
							>
								<Select
									showSearch
									id="country"
									placeholder="select country"
									size="large"
									className="h-10 w-full mt-1 bg-gray-50"
									options={countryOptions}
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-2 mt-3">
							<label htmlFor="enabled">Enable User</label>
							<Form.Item name="enabled" valuePropName="enabled">
								<Switch
									checked={Boolean(enabled)}
									id="enabled"
									onChange={triggerEnabled}
									style={{
										backgroundColor: !enabled ? "#8c8c8c" : "cornflowerblue",
									}}
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-3 mt-3">
							<label htmlFor="emailVerified">Is Email Verified</label>
							<Form.Item name="emailVerified" valuePropName="emailverified">
								<Switch
									checked={Boolean(emailVerified)}
									id="emailVerified"
									onChange={triggerVerify}
									style={{
										backgroundColor: !emailVerified
											? "#8c8c8c"
											: "cornflowerblue",
									}}
								/>
							</Form.Item>
						</div>

						<div className="md:col-span-2">
							<label htmlFor="role">Assign Role*</label>
							<Form.Item
								name={"role"}
								rules={[
									{
										required: true,
										message: "Please select role to be assigned",
									},
								]}
							>
								<Select
									showSearch
									id="role"
									loading={roleLoading}
									placeholder="select role"
									size="large"
									className="h-10 w-full mt-1 bg-gray-50"
									options={roles?.map((val: any, i: number) => {
										return (
											{
												key: i,
												value: JSON.stringify({ id: val?.id, name: val?.name }),
												label: val?.name
											}
										)
									})}
								/>
							</Form.Item>
						</div>
					</div>
				</div>
			</Form>
		</Drawer>
	);
};
