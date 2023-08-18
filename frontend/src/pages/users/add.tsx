import { countries } from "@/common/utils/countries";
import { TextInput, SearchSelect, SearchSelectItem, Button, NumberInput } from "@tremor/react";
import { useState } from "react";
import Layout from "@/common/components/Dashboard/Layout";
import { Unauthorized } from "@/common/components/common/unauth";
import { EnvelopeIcon, ExclamationCircleIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useAddUserMutation } from "@/modules/user/user";
import { SerialUser } from "@/modules/user/interface";
import { useRouter } from "next/router";
import { useGetRolesQuery } from "@/modules/roles/role";
import { usePermission } from "@/common/hooks/use-permission";

export const AddUser = () => {
	const [enabled, setEnabled] = useState<boolean>(false);
	const [emailVerified, setVerify] = useState<boolean>(false);
	const [country, setCountry] = useState<string>("");
	const [countryValid, setCountryValid] = useState(true);
	const [roleValid, setRoleValid] = useState(true);
	const { data } = useGetRolesQuery();
	const [addUser, { isLoading }  ] = useAddUserMutation();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const onSubmit = async (user: SerialUser) => {
		user.enabled = enabled;
		user.emailVerified = emailVerified;
		if (!user.country) {
			setCountryValid(false);
		} else if (!user.role) {
			setRoleValid(false);
		} else {
			addUser(user)
				.then((res: any) => {
					toast.success(res.data?.mesage, {
						position: "top-right",
						delay: 200
					});

					router.push("/users");
				})
				.catch((err: any) => {
					toast.error(err?.reasponse.data?.message, {
						position: "top-right",
						delay: 200
					});
				});
		}
	};

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
						<form onSubmit={handleSubmit((data: any) => onSubmit(data))}>
							<h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
								Basic Information
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="grid-password"
										>
											First Name
										</label>
										<TextInput
											{...register("firstName", {
												required: true,
												pattern: /^[A-Za-z]+$/i,
											})}
											icon={UserIcon}
											error={errors.firstName ? true : false}
											errorMessage={errors.firstName ? "given names required" : ""}
											placeholder="John"
											type="text"
											className="bg-white"
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="grid-password"
										>
											Last Name
										</label>
										<TextInput
											{...register("lastName", {
												required: true,
												pattern: /^[A-Za-z]+$/i,
											})}
											icon={UserIcon}
											error={errors.lastName ? true : false}
											errorMessage={errors.lastName ? "last name is required": ""}
											placeholder="Doe"
											type="text"
											className="bg-white"
										/>
									</div>
								</div>
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
													{...register("gender", { required: true })}
													type="radio"
													name="gender"
													value="Male"
													className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
												/>
												Male
											</label>
											<label>
												<input
													{...register("gender", { required: true })}
													type="radio"
													name="gender"
													value="Female"
													className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
												/>
												Female
											</label>
										</div>
										{errors.gender && (
											<span className="text-sm text-red-600">
												gender has to be selected
											</span>
										)}
									</fieldset>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="grid-password"
										>
											Country
										</label>
										<SearchSelect
											onValueChange={(e) => {
												setCountry(e);
												setValue("country", e, { shouldValidate: true });
												setCountryValid(true);
											}}
											className="bg-white"
											placeholder="Select country..."
											value={country}
										>
											{countries.map((item, index) => (
												<SearchSelectItem
													className="bg-white cursor-pointer"
													key={index}
													value={item.name}
												>
													{item.name}
												</SearchSelectItem>
											))}
										</SearchSelect>
										{!countryValid && (
											<span className="text-sm text-red-500 flex space-x-6 items-center justify-between">
												select country <ExclamationCircleIcon className="text-sm w-4 h-4" />
											</span>
										)}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="phone"
										>
											Contact Number
										</label>
										<NumberInput
											{...register("phone", { required: true, minLength: 10 })}
											icon={PhoneIcon}
											enableStepper={false}
											error={errors.phone ? true : false}
											errorMessage={errors.phone ? "provide contact number please": ""}
											placeholder="phone number..."
											className="border border-gray-200 h-10 rounded-md bg-white px-2"
										/>
									</div>
								</div>
							</div>
							<h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
								User Information
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="grid-password"
										>
											Username
										</label>
										<TextInput
											{...register("username", {
												required: true,
												minLength: 4,
											})}
											error={errors.username ? true : false}
											errorMessage={errors.username ? "username is required, min length 4 chars": ""}
											placeholder="john-doe01"
											type="text"
											className="bg-white"
											icon={UserIcon}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="grid-password"
										>
											Email address
										</label>
										<TextInput
											{...register("email", {
												required: true,
												pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											})}
											error={errors.email ? true : false}
											errorMessage={errors.email ? "valid email is required": ""}
											placeholder="john.doe@mail.com"
											type="text"
											className="bg-white"
											icon={EnvelopeIcon}
										/>
									</div>
								</div>
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
											onChange={setVerify}
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
											onChange={setEnabled}
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
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
											htmlFor="role"
										>
											User Role
										</label>
										<SearchSelect
											onValueChange={(e) => {
												setValue("role", JSON.parse(e), {
													shouldValidate: true,
												});
												setRoleValid(true);
											}}
											placeholder="Select role..."
											className="bg-white"
										>
											{(data || []).map((item: any, index) => (
												<SearchSelectItem
													className="bg-white cursor-pointer"
													key={index}
													value={JSON.stringify({
														id: item?.id,
														name: item?.name,
													})}
												>
													{item.name}
												</SearchSelectItem>
											))}
										</SearchSelect>
										{!roleValid && (
											<span className="text-sm text-red-600">
												select user role
											</span>
										)}
									</div>
								</div>
							</div>

							<hr className="mt-6 border-b-1 border-blueGray-300" />

							<div className="px-4 text-right mt-2">
								<Button
									type="submit"
									className="bg-prim hover:bg-prim-hover p-3  text-white"
									loading={isLoading}
								>
									Save User
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default function UserAdd() {
	const { hasPermission } = usePermission();
	return (
		<Layout>
			{hasPermission("user:add") ? <AddUser /> : <Unauthorized />}
		</Layout>
	);
}
