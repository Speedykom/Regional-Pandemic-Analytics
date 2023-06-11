import { api_url } from "@/utils/auth";
import { OpenNotification } from "@/utils/notify";
import { Button, Form, Input } from "antd";
import axios from "axios";
import jwtDecode, { JwtDecodeOptions } from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const specialChars = /[!-\/:-@[-`{-~]/;
const upperRegex = /[A-Z]/;
const lowerRegex = /[a-z]/;
const numberRegex = /[0-9]/;

interface props {
	mail: string;
	token: string;
}

export const CreatePassword = ({ mail, token }: props) => {
	const router = useRouter();
	const [form] = Form.useForm();
	const { tok } = router.query;
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string>("");
	const [uppercase, setUppercase] = useState<boolean>(false);
	const [num, setNumber] = useState<boolean>(false);
	const [lowercase, setLowercase] = useState<boolean>(false);
	const [specialChar, setSpecialChar] = useState<boolean>(false);

	const onChange = (e?: string) => {
		setPassword(String(e));
		isUpper();
		isLower();
		isNumber();
		isSpecial();
	};

	const isUpper = () => {
		const test = upperRegex.test(password);
		setUppercase(test);
	};
	const isLower = () => {
		const test = lowerRegex.test(password);
		setLowercase(test);
	};

	const isNumber = () => {
		const test = numberRegex.test(password);
		setNumber(test);
	};

	const isSpecial = () => {
		const test = specialChars.test(password);
		setSpecialChar(test);
	};

	const onFinish = async (values: any) => {
		if (!lowercase || !uppercase || !specialChar || !num) {
			OpenNotification(
				"Validation error, please fix the errors and continue",
				"topRight",
				"error"
			);
		} else {
			await axios
				.post(
					`${api_url}/api/auth/password`,
					{
						newPassword: values["password"],
						confirmPassword: values["confirmPassword"],
						token: token,
					},
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					OpenNotification(res.data?.message, "topRight", "success");
					form.resetFields();
					router.push("/");
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

	useEffect(() => {
		isUpper();
		isLower();
		isNumber();
		isSpecial();
	});

	return (
		<div className="font-mono bg-gray-400">
			<section className="bg-gray-50 dark:bg-gray-900">
				<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
					<p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
						IGAD Regional Pandemic
					</p>
					<div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
						<h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Change Password
						</h2>
						<Form
							form={form}
							onFinish={onFinish}
							className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
						>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Your email
								</label>
								<Input
									value={mail}
									type="email"
									name="email"
									id="email"
									disabled
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="name@company.com"
								/>
							</div>
							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									New Password
								</label>
								<Form.Item
									name={"password"}
									rules={[
										{
											required: true,
											message: "Please input the password",
										},
										{
											min: 8,
											message: "Password must be at least 8 chars long",
										},
									]}
								>
									<Input
										type="password"
										value={password}
										onChange={(e) => {
											onChange(e.currentTarget.value);
										}}
										placeholder="new password"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									/>
								</Form.Item>
							</div>
							<div>
								<label
									htmlFor="confirmPassword"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Confirm password
								</label>
								<Form.Item
									name={"confirmPassword"}
									rules={[
										{
											required: true,
											validator(rule, value, callback) {
												if (value === "") {
													callback("Please input the password again");
												} else if (value !== password) {
													callback("Two inputs don't match!");
												} else {
													callback();
												}
											},
										},
									]}
								>
									<Input
										type="password"
										placeholder="confirm password"
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									/>
								</Form.Item>
							</div>
							<div className="flex justify-start mt-2 p-1">
								<ul>
									<li className="flex items-center py-1">
										<div
											className={`rounded-full p-1 fill-current ${
												password?.length > 7
													? "bg-green-200 text-indigo-700"
													: "bg-red-200 text-red-700"
											}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												{password.length > 7 ? (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												) : (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												)}
											</svg>
										</div>
										<span
											className={`font-medium text-sm ml-3 dark:text-gray-400 text-gray-700`}
										>
											Minimum 8 characters long
										</span>
									</li>
									<li className="flex items-center py-1">
										<div
											className={`rounded-full p-1 fill-current ${
												uppercase
													? "bg-green-200 text-green-700"
													: "bg-red-200 text-red-700"
											}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												{uppercase ? (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												) : (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												)}
											</svg>
										</div>
										<span
											className={`font-medium text-sm ml-3 dark:text-gray-400 text-gray-700`}
										>
											At least one (1) Upper case letter [A-Z]
										</span>
									</li>
									<li className="flex items-center py-1">
										<div
											className={`rounded-full p-1 fill-current ${
												lowercase
													? "bg-green-200 text-green-700"
													: "bg-red-200 text-red-700"
											}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												{lowercase ? (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												) : (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												)}
											</svg>
										</div>
										<span
											className={`font-medium text-sm ml-3 dark:text-gray-400 text-gray-700`}
										>
											At least one (1) lower case letter [a-z]
										</span>
									</li>
									<li className="flex items-center py-1">
										<div
											className={`rounded-full p-1 fill-current ${
												num
													? "bg-green-200 text-green-700"
													: "bg-red-200 text-red-700"
											}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												{num ? (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												) : (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												)}
											</svg>
										</div>
										<span
											className={`font-medium text-sm ml-3 dark:text-gray-400 text-gray-700`}
										>
											At least one (1) numeric value [0-9]
										</span>
									</li>
									<li className="flex items-center py-1">
										<div
											className={`rounded-full p-1 fill-current ${
												specialChar
													? "bg-green-200 text-green-700"
													: "bg-red-200 text-red-700"
											}`}
										>
											<svg
												className="w-4 h-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												{specialChar ? (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M5 13l4 4L19 7"
													/>
												) : (
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M6 18L18 6M6 6l12 12"
													/>
												)}
											</svg>
										</div>
										<span
											className={`font-medium text-sm ml-3 dark:text-gray-400 text-gray-700`}
										>
											At least one (1) special character eg. {"!@#$%^&*()"}
										</span>
									</li>
								</ul>
							</div>
							<Form.Item>
								<Button
									htmlType="submit"
									size="large"
									className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
								>
									Reset passwod
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</section>
		</div>
	);
};
