import { countries } from "@/common/utils/countries";
import { TextInput } from "@tremor/react";
import axios from "axios";
import Form, { Field } from "rc-field-form";
import { useEffect, useState } from "react";
import getConfig from "next/config";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { usePermission } from "@/common/hooks/use-permission";
import toast from 'react-hot-toast';

const { publicRuntimeConfig } = getConfig();

export const AddUser = () => {
	const [form] = Form.useForm();
	const [enabled, setEnabled] = useState<boolean>(false);
	const [emailVerified, setVerify] = useState<boolean>(false);
	const [country, setCountry] = useState<string>("");
	const [roles, setRoles] = useState([]);
	const [role, setRole] = useState<string>("");
	const [phone, setPhone] = useState<string>();
	const [roleLoading, setRoleLoading] = useState(true);
	const triggerEnabled = () => {
		if (enabled) {
			setEnabled(false);  
		} else {
			setEnabled(true);
		}
		console.log({ enabled });
	};

	const triggerVerify = () => {
		if (emailVerified) {
			setVerify(false);
		} else {
			setVerify(true);
		}
	};

	const onFinish = async (values: any) => {
		values["enabled"] = enabled;
		values["emailVerified"] = emailVerified;
		values["country"] = country;
		values["role"] = JSON.parse(role);

		await axios
			.post(
				`${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/user`,
				values,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
                toast.success(res.data.message, {
                    position: "top-right",
                    duration: 4000
                })
				form.resetFields();
			})
			.catch((err) => {
				toast.error(err.response.data.message, {
                    position: "top-right",
                    duration: 4000
                })
			});
	};

	const fetchRoles = async () => {
		try {
			setRoleLoading(true);
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/role`;
			await axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.then((res) => {
					setRoleLoading(false);
					setRoles(res?.data);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchRoles();
	}, []);
	return (
		<section className="py-1 bg-blueGray-50">
			<div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-blueGray-700 text-xl font-bold">
								Create User
							</h6>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<Form form={form} onFinish={onFinish}>
							<h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
								Basic Information
							</h6>
							<div className="flex flex-wrap">
								<Field name={"firstName"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												First Name
											</label>
											<TextInput
												type="text"
												className="h-12"
												// value="Lucky"
											/>
										</div>
									</div>
								</Field>
								<Field name={"lastName"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												Last Name
											</label>
											<TextInput
												type="text"
												className="h-12"
												// value="Jesse"
											/>
										</div>
									</div>
								</Field>
								<Field name={"gender"}>
									<div className="w-full lg:w-6/12 px-4">
										<fieldset className="relative z-0 w-full p-px mb-5">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												Gender
											</label>
											<div className="block pt-3 pb-2 space-x-4">
												<label>
													<input
														type="radio"
														name="radio"
														value="Male"
														className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
													/>
													Male
												</label>
												<label>
													<input
														type="radio"
														name="radio"
														value="Female"
														className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
													/>
													Female
												</label>
											</div>
											<span className="text-sm text-red-600 hidden" id="error">
												Option has to be selected
											</span>
										</fieldset>
									</div>
								</Field>
								<Field name={"country"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												Country
											</label>
											<Select
												onChange={(e) => setCountry(String(e?.value))}
												className="h-12"
												options={countries.map((item, index) => {
													return {
														value: item.name,
														label: item.name,
													};
												})}
											/>
										</div>
									</div>
								</Field>
								<Field name={"phone"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="phone"
											>
												Contact Number
											</label>
											<PhoneInput
												international
												defaultCountry="SL"
												value={phone}
												onChange={setPhone}
												className="border-2 border-gray-200 h-12 inline bg-white px-2"
											/>
											{/* <input className="w-full h-10 px-4 border-2 rounded border-gray-200" type="tel" /> */}
										</div>
									</div>
								</Field>
							</div>
							<h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
								User Information
							</h6>
							<div className="flex flex-wrap">
								<Field name={"username"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												Username
											</label>
											<TextInput type="text" className="h-12" icon={UserIcon} />
										</div>
									</div>
								</Field>
								<Field name={"email"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="grid-password"
											>
												Email address
											</label>
											<TextInput
												type="text"
												className="h-12"
												icon={EnvelopeIcon}
												// value="jesse@example.com"
											/>
										</div>
									</div>
								</Field>
								<Field name={"emailVerified"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="emailVerify"
											>
												Is Email Verified
											</label>
											<Switch
												id="emailVerify"
												checked={emailVerified}
												onChange={triggerVerify}
												className={`${
													emailVerified ? "bg-blue-600" : "bg-gray-200"
												} relative inline-flex h-6 w-11 items-center rounded-full`}
											>
												<span className="sr-only">Verify Emails</span>
												<span
													className={`${
														emailVerified ? "translate-x-6" : "translate-x-1"
													} inline-block h-4 w-4 transform rounded-full bg-white transition`}
												/>
											</Switch>
										</div>
									</div>
								</Field>
								<Field name={"enabled"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="enable"
											>
												Enable User
											</label>
											<Switch
												id="enable"
												checked={enabled}
												onChange={triggerEnabled}
												className={`${
													enabled ? "bg-blue-600" : "bg-gray-200"
												} relative inline-flex h-6 w-11 items-center rounded-full`}
											>
												<span className="sr-only">Enable User</span>
												<span
													className={`${
														enabled ? "translate-x-6" : "translate-x-1"
													} inline-block h-4 w-4 transform rounded-full bg-white transition`}
												/>
											</Switch>
										</div>
									</div>
								</Field>
								<Field name={"role"}>
									<div className="w-full lg:w-6/12 px-4">
										<div className="relative w-full mb-3">
											<label
												className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
												htmlFor="role"
											>
												User Role
											</label>
											<Select
												onChange={(e) => setRole(String(e?.value))}
												isLoading={roleLoading}
												options={roles.map((item: any, index) => {
													return {
														value: JSON.stringify({
															id: item?.id,
															name: item?.name,
														}),
														label: item.name,
													};
												})}
											/>
										</div>
									</div>
								</Field>
							</div>

							<hr className="mt-6 border-b-1 border-blueGray-300" />

							<div className="px-4 text-right">
								<button className="bg-prim border border-gray-200 p-3 rounded-md text-white">
									Save User
								</button>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default function UserAdd() {
	const { hasPermission } = usePermission();
	return (
		<DashboardFrame>
			{hasPermission("user:add") ? <AddUser /> : <Unauthorised />}
		</DashboardFrame>
	);
}
