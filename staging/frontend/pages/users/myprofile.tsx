import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import { countries } from "@/utils/countries";
import { OpenNotification } from "@/utils/notify";
import {
	DeleteColumnOutlined,
	EditOutlined,
	ProfileOutlined,
	SaveOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import {
	Button,
	Divider,
	Form,
	Input,
	Modal,
	Radio,
	Select,
	SelectProps,
	Switch,
	Tag,
	message,
	Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";

import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const beforeUpload = (file: RcFile) => {
	const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
	if (!isJpgOrPng) {
		message.error("You can only upload JPG/PNG file!");
	}
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isLt2M) {
		message.error("Image must smaller than 2MB!");
	}
	return isJpgOrPng && isLt2M;
};

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

export const ProfileSettings = () => {
	const [form] = Form.useForm();
	const [passwordForm] = Form.useForm();
	const [visible, setVisible] = useState(false);
	const [changePassword, setChangePassword] = useState(false);
	// const [user, setUser] = useState<any>();

	const user: any = secureLocalStorage.getItem("user") as string;
	const imageList: UploadFile[] = [
		{
			uid: "0",
			name: "profile-avatar.png",
			status: "done",
			url: user?.avatar ? user?.avatar : "/avater.png",
		},
	];

	const [newPass, setNewPass] = useState<string>("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");

	const [fileList, setFileList] = useState<UploadFile[]>(imageList);

	const onChange = (e?: string) => {
		setNewPass(String(e));
	};

	const [code, setCode] = useState<string>("");

	const triggerPasswordChange = () => {
		setChangePassword(!changePassword);
	};

	const handleCancel = () => setPreviewOpen(false);

	const triggerEdit = () => {
		setVisible(true);
		form.setFieldValue("firstName", user?.given_name);
		form.setFieldValue("lastName", user?.family_name);
		form.setFieldValue("country", user?.country);
		form.setFieldValue("gender", user?.gender);
		form.setFieldValue("phone", user?.phone);
		form.setFieldValue("code", user?.code);
	};
	const cancelEdit = () => {
		form.resetFields();
		setVisible(false);
	};

	const onChangeImage: UploadProps["onChange"] = async ({
		fileList: newFileList,
	}) => {
		setFileList(newFileList);
	};

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleDetailsEdit = async (values: any) => {
		await axios
			.put(
				`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user/${user?.sub}/update`,
				values,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				let newUserData = user
				secureLocalStorage.removeItem('user')
				newUserData.given_name = values['firstName']
				newUserData.family_name = values['lastName']
				newUserData.phone = values['phone']
				newUserData.code = values['code']
				newUserData.country = values['country']
				newUserData.gender = values['gender']
				newUserData.name = `${values['firstName']} ${values['lastName']}`
				secureLocalStorage.setItem('user', newUserData)
				OpenNotification(res?.data?.message, "topRight", "success");
				form.resetFields();
			})
			.catch((err) => {
				OpenNotification(err.response?.data?.errorMessage, "topRight", "error");
			});
	}

	const password: string = secureLocalStorage.getItem("passcode") as string;

	const handlePasswordChange = async (values: any) => {
		const decode = Buffer.from(password, "base64").toString("ascii");
		if (values["currentPassword"] !== decode) {
			OpenNotification(
				"Current password entered is invalid",
				"topRight",
				"error"
			);
		} else {
			await axios
				.put(
					`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user/${user?.sub}/change-password`,
					{
						newPassword: values["newPassword"],
						confirmPassword: values["confirmPassword"],
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					secureLocalStorage.removeItem('passcode')
					secureLocalStorage.setItem("passcode", Buffer.from(values["newPassword"]).toString("base64"));
					OpenNotification(res.data?.message, "topRight", "success");
					passwordForm.resetFields();
				})
				.catch((err) => {
					OpenNotification(
						err?.response?.data?.errorMessage,
						"topRight",
						"error"
					);
				});
		}
	};

	return (
		<div className="my-5">
			<div className="md:flex no-wrap">
				{/* Left Side */}
				<div className="w-full md:w-1/3">
					{/* Profile Card */}
					<div className="mb-6">
						<div className="bg-white border p-5 rounded-md border-gray-400">
							<div className="flex">
								<ImgCrop rotationSlider>
									<Upload
										className=""
										listType="picture-card"
										onChange={onChangeImage}
										fileList={fileList}
										onPreview={handlePreview}
										showUploadList={{ showRemoveIcon: false }}
										maxCount={1}
										action={`${process.env.NEXT_PUBLIC_BASE_URL}/api/account/user/${user?.sub}/avatar-upload`}
										customRequest={(options) => {
											const data = new FormData();
											data.append("file", options.file);
											const config = {
												headers: {
													"content-type": "multipart/form-data",
												},
											};
											axios
												.post(options.action, data, config)
												.then((resp) => {
													let newUserData = user
													newUserData.avatar = resp?.data?.avatarUrl
													secureLocalStorage.removeItem('user')
													secureLocalStorage.setItem('user', newUserData)
													const newList: UploadFile[] = [
														{
															uid: "0",
															name: "profile-avatare.png",
															status: "done",
															url: resp?.data?.avatarUrl,
														},
													];

													setFileList(newList)
												})
												.catch((err: Error) => {
													message.error('error')
												});
										}}
										
									>
										<Button type="link" className="flex items-center px-2"><UploadOutlined /> Upload Avatar</Button>
									</Upload>
								</ImgCrop>
								{/* <img
									className="h-32 w-32 rounded-md"
									src={previewImage}
									alt=""
								/>
								<Button type="link">Upload Avatar</Button> */}
							</div>
							<div className="">
								<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
									{user?.name}
								</h1>
							</div>
							<div>
								<span className="text-gray-500 leading-8 my-1">
									Email Address
								</span>
								<p id="emailId" className="">
									{user?.email}
								</p>
							</div>
							<div className="mt-5">
								<span className="text-gray-500 leading-8 my-1">
									Phone Number
								</span>
								<p id="emailId" className="">
									{user?.code} {user?.phone}
								</p>
							</div>
							<div className="mt-5">
								<span className="text-gray-500 leading-8 my-1">Username</span>
								<p id="emailId" className="">
									{user?.preferred_username}
								</p>
							</div>
							<div className="mt-5">
								<span className="text-gray-500 leading-8 my-1">Gender</span>
								<p id="emailId" className="">
									{user?.gender}
								</p>
							</div>
							<div className="mt-5">
								<span className="text-gray-500 leading-8 my-1">Country</span>
								<p id="emailId" className="">
									{user?.country}
								</p>
							</div>
						</div>
					</div>
					<div className="mb-6">
						<div className="bg-white border border-gray-400 p-5 rounded-md">
							<div className="mt-3">
								<h1 className="text-xl font-bold">App Roles</h1>
							</div>
							<div className="text-2xl mt-3">
								<Tag color="gold" className="text-xl">
									Dashboard
								</Tag>
								<Tag color="gold" className="text-xl">
									Superset
								</Tag>
								<Tag color="gold" className="text-xl">
									Hop
								</Tag>
								<Tag color="gold" className="text-xl">
									Druid
								</Tag>
								<Tag color="gold" className="text-xl">
									My Profile
								</Tag>
								<Tag color="gold" className="text-xl">
									Manage Users
								</Tag>
								<Tag color="gold" className="text-xl">
									Manage Roles
								</Tag>
							</div>
						</div>
					</div>
					<div className="mb-6">
						<div className="bg-white border border-gray-400 p-5 rounded-md">
							<div className="mt-3">
								<h1 className="text-xl font-bold">Status</h1>
							</div>
							<div className="text-lg mt-3">
								<div className="flex space-x-28 mb-3">
									<p>Email Verified</p>
									<Tag color="error" className="text-xl">
										{user?.email_verified ? "True" : "False"}
									</Tag>
								</div>
								<div className="flex  space-x-28">
									<p>User Enabled</p>
									<Tag color="success" className="text-xl item-start">
										True
									</Tag>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Right Side */}
				<div className="w-full md:w-2/3 md:mx-2">
					<div className="mb-6">
						<div className="bg-white border border-gray-400 p-5 rounded-md">
							<div className="border-b-2 mb-6 flex items-center justify-between">
								<p className="flex items-center">
									<ProfileOutlined className="pr-2" /> Edit Profile
								</p>
								<Button
									type="link"
									onClick={triggerEdit}
									className="flex items-center space-x-1"
								>
									<EditOutlined />
									<span>Update Details</span>
								</Button>
							</div>
							<Form form={form} name="edit" onFinish={handleDetailsEdit} scrollToFirstError>
								<div className="lg:col-span-2">
									<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
										<div className="md:col-span-5">
											<label htmlFor="firstName">Given Names*</label>
											<Form.Item
												name={"firstName"}
												initialValue={user?.given_name}
												rules={[
													{
														required: true,
														message: "Please input your given names",
													},
												]}
											>
												<Input
													className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
													placeholder={user?.given_name}
												/>
											</Form.Item>
										</div>

										<div className="md:col-span-5">
											<label htmlFor="lastName">Last Name*</label>
											<Form.Item
												name={"lastName"}
												initialValue={user?.family_name}
												rules={[
													{
														required: true,
														message: "Please input your family name",
													},
												]}
											>
												<Input
													className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
													placeholder={user?.family_name}
												/>
											</Form.Item>
										</div>

										<div className="md:col-span-3">
											<label htmlFor="phone">Phone Number*</label>
											<div className="flex items-center">
												<Form.Item
													name="code"
													className="w-1/14"
													initialValue={user?.code}
													rules={[
														{
															required: true,
															message: "Please select country code",
														},
													]}
												>
													<Select
														value={code}
														onChange={setCode}
														showSearch
														placeholder={user?.code}
														options={myCodeOptions}
														className="mt-1"
														size="large"
													/>
												</Form.Item>
												<Form.Item
													className="w-full"
													name={"phone"}
													initialValue={user?.phone}
													rules={[
														{
															required: true,
															message: "Please input your number",
														},
													]}
												>
													<Input
														// addonBefore={selectBefore}
														size="large"
														placeholder={user?.phone}
														className="mt-1 bg-gray-50 w-full"
													/>
												</Form.Item>
											</div>
										</div>

										<div className="md:col-span-2">
											<label htmlFor="country">Country*</label>
											<Form.Item
												name={"country"}
												initialValue={user?.country}
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
													placeholder={user?.country}
													size="large"
													className="h-10 w-full mt-1 bg-gray-50"
													options={countryOptions}
												/>
											</Form.Item>
										</div>

										<div className="md:col-span-2">
											<label htmlFor="gender">Gender*</label>
											<Form.Item
												name={"gender"}
												initialValue={user?.gender}
												rules={[
													{
														required: true,
														message: "Please select gender",
													},
												]}
											>
												<Radio.Group
													options={genderOptions}
													// onChange={onGenderChange}
													className="h-10 mt-1 w-full"
													optionType="button"
													buttonStyle="solid"
												/>
											</Form.Item>
										</div>
									</div>
								</div>
								{visible && (
									<div>
										<Divider style={{ border: "1px solid gray" }} />
										<div>
											<Form.Item>
												<div className="flex space-x-2 items-end justify-end">
													<Button
														className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
														style={{
															backgroundColor: "#48328526",
															border: "1px solid #48328526",
														}}
														type="primary"
														size="large"
														icon={<DeleteColumnOutlined />}
														onClick={cancelEdit}
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
														Save Changes
													</Button>
												</div>
											</Form.Item>
										</div>
									</div>
								)}
							</Form>
						</div>
					</div>
					<div className="mb-6">
						<div className="bg-white border border-gray-400 p-5 rounded-md">
							<div className="mt-3 border-b-2 mb-6 flex items-center justify-between">
								<h1 className="">Credential Settings</h1>
								<Button
									type="link"
									onClick={triggerPasswordChange}
									className="flex items-center space-x-1"
								>
									<EditOutlined /> <span>Change Password</span>
								</Button>
							</div>
							<div className="mt-3">
								<div className="flex space-x-28 mb-3 justify-between">
									<p>Email</p>
									<p>{user?.email}</p>
								</div>
								<div className="flex space-x-28 mb-3 justify-between">
									<p>Username</p>
									<p>{user?.preferred_username}</p>
								</div>
								<div className="flex space-x-28 mb-3 justify-between">
									<p>Password</p>
									<p>*****************</p>
								</div>
							</div>
							{changePassword && (
								<div className="border border-1 p-5 flex flex-col ">
									<Divider
										type="horizontal"
										children={
											<p className="text-lg mb-5">Create New Password</p>
										}
									/>
									<Form form={passwordForm} onFinish={handlePasswordChange}>
										<div className="flex">
											<div className="w-1/2">
												<div className="">
													<label htmlFor="currentPassword">
														Current Password*
													</label>
													<Form.Item
														name={"currentPassword"}
														rules={[
															{
																required: true,
																message: "Please input currentPassword",
															},
														]}
													>
														<Input.Password
															size="large"
															placeholder="current password"
															className="mt-1 bg-gray-50"
														/>
													</Form.Item>
												</div>
												<div className="">
													<label htmlFor="newPassword">New Password*</label>
													<Form.Item
														name={"newPassword"}
														rules={[
															{
																required: true,
																message: "Please input currentPassword",
															},
														]}
													>
														<Input.Password
															type="password"
															visibilityToggle={{
																visible: passwordVisible,
																onVisibleChange: setPasswordVisible,
															}}
															value={newPass}
															onChange={(e) => {
																onChange(e.currentTarget.value);
															}}
															size="large"
															placeholder="new password"
															className="mt-1 bg-gray-50"
														/>
													</Form.Item>
												</div>
												<div className="">
													<label htmlFor="confirmPassword">
														Confirm Password*
													</label>
													<Form.Item
														name={"confirmPassword"}
														rules={[
															{
																required: true,
																validator(rule, value, callback) {
																	if (value === "") {
																		callback("This field is required");
																	} else if (value !== newPass) {
																		callback("Passwords do not match!");
																	} else {
																		callback();
																	}
																},
															},
														]}
													>
														<Input.Password
															type="password"
															size="large"
															placeholder="confirm password"
															className="mt-1 bg-gray-50"
														/>
													</Form.Item>
												</div>
												<div>
													<Divider style={{ border: "1px solid gray" }} />
													<div>
														<Form.Item>
															<div className="flex space-x-2 items-end justify-end">
																<Button
																	className="focus:outline-none px-6 py-2 text-gray-700 font-medium flex items-center"
																	style={{
																		backgroundColor: "#48328526",
																		border: "1px solid #48328526",
																	}}
																	type="primary"
																	size="large"
																	icon={<DeleteColumnOutlined />}
																	onClick={triggerPasswordChange}
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
																	Save Changes
																</Button>
															</div>
														</Form.Item>
													</div>
												</div>
											</div>
										</div>
									</Form>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Modal
				open={previewOpen}
				title="Profile image"
				footer={null}
				onCancel={handleCancel}
			>
				<img alt="example" style={{ width: "100%" }} src={previewImage} />
			</Modal>
		</div>
	);
};

export default function ProfileLayout() {
	return (
		<DashboardFrame title="Profile Settings">
			<ProfileSettings />
		</DashboardFrame>
	);
}
