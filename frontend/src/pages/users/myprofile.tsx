import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { countries } from "@/common/utils/countries";

import { Fragment, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import {
	Badge,
	Button,
	Card,
	Divider,
	NumberInput,
	SearchSelect,
	SearchSelectItem,
	Text,
	TextInput,
} from "@tremor/react";
import { useGetUserQuery } from "@/modules/user/user";
import {
	CheckIcon,
	PencilSquareIcon,
	PlusCircleIcon,
	SignalSlashIcon,
	WifiIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { selectCurrentUser } from "@/modules/auth/auth";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const ProfileSettings = () => {
	const [changePassword, setChangePassword] = useState(false);
	const currentUser = useSelector(selectCurrentUser);

	const myId: any = currentUser?.id;
	const { data } = useGetUserQuery(myId);

	const [country, setCountry] = useState<string>();
	const [gender, setGender] = useState<string>();
	const [firstName, setFirstName] = useState(currentUser?.given_name);
	const [lastName, setLastName] = useState(currentUser?.family_name);
	const [phone, setPhone] = useState<string>();
	const [avatar, setAvatar] = useState(currentUser?.avatar);

	const [newPass, setNewPass] = useState<string>("");

	const onChange = (e?: string) => {
		setNewPass(String(e));
	};

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const triggerPasswordChange = () => {
		setChangePassword(!changePassword);
	};

	const handleDetailsEdit = async (values: any) => {};

	const password: string = secureLocalStorage.getItem("passcode") as string;

	useEffect(() => {
		if (typeof window != undefined) {
			setGender(data?.attributes?.gender[0])
			setCountry(data?.attributes?.country[0])
			setPhone(data?.attributes?.phone[0])
    }
	}, [])

	const handlePasswordChange = async (values: any) => {
		const decode = Buffer.from(password, "base64").toString("ascii");
		if (values["currentPassword"] !== decode) {
			toast.error("Current password entered is invalid", {
				position: "top-right",
			});
		} else {
			toast.info("Clicked", { position: "top-right" });
		}
	};

	return (
		<div className="my-5 w-full lg:w-8/12 px-4 mx-auto">
			<div className="md:flex no-wrap">
				{/* Left Side */}
				<div className="w-full md:w-2/3">
					{/* Profile Card */}
					<Card className="mb-6 bg-white p-5">
						<div className="flex ">
							<img className="h-32 w-32 rounded-md" src={avatar ? avatar : "/avater.png"} alt="" />
							<input type="file" style={{ display: "none" }} />
						</div>
						<div className="">
							<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
								{data?.firstName} {data?.lastName}
							</h1>
						</div>
						<div>
							<span className="text-gray-500 leading-8 my-1">
								Email Address
							</span>
							<p id="emailId" className="">
								{data?.email}
							</p>
						</div>
						<div className="mt-5">
							<span className="text-gray-500 leading-8 my-1">Phone Number</span>
							<p id="emailId" className="">
								{data?.attributes?.phone}
							</p>
						</div>
						<div className="mt-5">
							<span className="text-gray-500 leading-8 my-1">Username</span>
							<p id="emailId" className="">
								{data?.username}
							</p>
						</div>
						<div className="mt-5">
							<span className="text-gray-500 leading-8 my-1">Gender</span>
							<p id="emailId" className="">
								{data?.attributes?.gender}
							</p>
						</div>
						<div className="mt-5 mb-8">
							<span className="text-gray-500 leading-8 my-1">Country</span>
							<p id="emailId" className="">
								{data?.attributes?.country}
							</p>
						</div>
						<div className="">
							<span className="text-gray-500 leading-8 my-1">Access Roles</span>
							<div>
								<div className="flex">
									{data?.roles.map((role, index) => (
										<Text
											className="bg-gray-200 px-2 text-black rounded-md"
											key={index}
										>
											{role?.name}
										</Text>
									))}
								</div>
							</div>
						</div>
						<div className="mt-5">
							<span className="text-gray-500 leading-8 my-1">Email Status</span>
							<p>
								{data?.emailVerified ? (
									<Badge color="indigo" icon={CheckIcon}>
										Enable
									</Badge>
								) : (
									<Badge color="red" icon={XMarkIcon}>
										Disabled
									</Badge>
								)}
							</p>
						</div>
						<div className="mt-5">
							<span className="text-gray-500 leading-8 my-1">My Status</span>
							<p>
								{data?.enabled ? (
									<Badge color="green" icon={WifiIcon}>
										Active
									</Badge>
								) : (
									<Badge color="red" icon={SignalSlashIcon}>
										Inactive
									</Badge>
								)}
							</p>
						</div>
					</Card>
				</div>
				{/* Right Side */}
				<div className="w-full md:w-full md:mx-2">
					<Card className="bg-white mb-8">
						<div className="border-b-2 mb-6 flex items-center justify-between">
							<p className="flex items-center">Edit Profile</p>
						</div>
						<div className="lg:col-span-2">
							<div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
								<div className="md:col-span-5">
									<label htmlFor="firstName">Given Names*</label>
									<TextInput
										value={firstName}
										className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									/>
								</div>
								<div className="md:col-span-5">
									<label htmlFor="lastName">Last Name*</label>
									<TextInput
										value={lastName}
										className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
									/>
								</div>
								<div className="md:col-span-5">
									<label htmlFor="phone">Phone Number*</label>
									<NumberInput
										enableStepper={false}
										onInput={(e: any) => setPhone(e.target.value)}
										value={phone}
										defaultValue={phone}
										className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
										placeholder={phone ? phone : "phone"}
									/>
								</div>
								<div className="md:col-span-3">
									<label htmlFor="country">Country*</label>
									<SearchSelect
										onValueChange={(e) => {
											setCountry(e);
										}}
										className="bg-white"
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
								</div>
								<div className="md:col-span-2 w-full">
									<label htmlFor="gender">Gender*</label>
									<div className="flex">
										<Button
											onClick={() => setGender("Male")}
											className={`rounded-l ${
												gender == "Male" ? "bg-indigo-400 text-white" : ""
											}`}
										>
											Male
										</Button>
										<Button
											onClick={() => setGender("Female")}
											className={`rounded-r ${
												gender == "Female" && "bg-indigo-400 text-white"
											}`}
										>
											Female
										</Button>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-8">
							<Divider className="border border-gray-200" />
							<div>
								<div className="flex space-x-2 items-end justify-end">
									<Button
										type="submit"
										className="flex items-center bg-prim text-white"
										icon={PlusCircleIcon}
									>
										Save Changes
									</Button>
								</div>
							</div>
						</div>
					</Card>
					<Card className="bg-white">
						<div className="mt-1 border-b-2 mb-6 flex items-center justify-between">
							<h1 className="">Credential Settings</h1>
							<Button
								onClick={triggerPasswordChange}
								className="flex items-center border-0"
								icon={PencilSquareIcon}
							>
								Change Password
							</Button>
						</div>
						<div className="mt-3">
							<div className="flex mb-3 space-x-1 md:justify-between">
								<p>Email</p>
								<p>{data?.email}</p>
							</div>
							<div className="flex space-x-2 mb-3 md:justify-between">
								<p>Username</p>
								<p>{data?.username}</p>
							</div>
							<div className="flex mb-3 justify-between">
								<p>Password</p>
								<p>*************</p>
							</div>
						</div>
					</Card>
				</div>
				<Transition appear show={changePassword} as={Fragment}>
					<Dialog
						as="div"
						className="relative z-10"
						onClose={() => setChangePassword(false)}
					>
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-black bg-opacity-25" />
						</Transition.Child>

						<div className="fixed inset-0 overflow-y-auto">
							<div className="flex min-h-full items-center justify-center p-4 text-center">
								<Transition.Child
									as={Fragment}
									enter="ease-out duration-300"
									enterFrom="opacity-0 scale-95"
									enterTo="opacity-100 scale-100"
									leave="ease-in duration-200"
									leaveFrom="opacity-100 scale-100"
									leaveTo="opacity-0 scale-95"
								>
									<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
										<Dialog.Title
											as="h3"
											className="text-lg font-medium leading-6 text-gray-900"
										>
											Change Password
										</Dialog.Title>
										<div className="mt-5 flex-auto px-4 py-10 pt-0">
											<form
											// onSubmit={handleSubmit((data: any) => onSubmit(data))}
											>
												<div className="relative w-full mb-3">
													<label
														className="block text-blueGray-600 text-xs font-bold mb-2"
														htmlFor="name"
													>
														Current Password
													</label>
													<TextInput
														type="password"
														placeholder="current password"
														className="mt-1 bg-gray-50"
													/>
													{errors.name && (
														<span className="text-sm text-red-600">
															role name is required
														</span>
													)}
												</div>
												<div className="relative w-full mb-3">
													<label
														className="block text-blueGray-600 text-xs font-bold mb-2"
														htmlFor="descriptiond"
													>
														New Password
													</label>
													<TextInput
														type="password"
														value={newPass}
														onChange={(e) => {
															onChange(e.currentTarget.value);
														}}
														placeholder="new password"
														className="mt-1 bg-gray-50"
													/>
													{errors.description && (
														<span className="text-sm text-red-600">
															provide role description
														</span>
													)}
												</div>
												<div className="relative w-full mb-3">
													<label
														className="block text-blueGray-600 text-xs font-bold mb-2"
														htmlFor="descriptiond"
													>
														Confirm Password
													</label>
													<TextInput
														type="password"
														placeholder="confirm password"
														className="mt-1 bg-gray-50"
													/>
													{errors.description && (
														<span className="text-sm text-red-600">
															provide role description
														</span>
													)}
												</div>
												<div className="mt-16 flex justify-end space-x-2">
													<Button
														type="button"
														className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
														onClick={() => {
															setChangePassword(false);
														}}
													>
														Cancel
													</Button>
													<Button
														// loading={loading}
														type="submit"
														className="inline-flex justify-center rounded-md border border-transparent bg-prim px-4 py-2 text-sm font-medium text-white hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
													>
														Save Changes
													</Button>
												</div>
											</form>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</Dialog>
				</Transition>
			</div>
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
