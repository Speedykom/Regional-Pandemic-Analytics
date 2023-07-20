import { countries } from "@/common/utils/countries";
import { Text, TextInput } from "@tremor/react";
import axios from "axios";
import Form, { Field } from "rc-field-form";
import { useEffect, useState } from "react";
import getConfig from "next/config";
import DashboardFrame from "@/common/components/Dashboard/DashboardFrame";
import { Unauthorised } from "@/common/components/common/unauth";
import {
	CheckIcon,
	ExclamationCircleIcon,
	XMarkIcon,
	WifiIcon,
} from "@heroicons/react/24/outline";
import { usePermission } from "@/common/hooks/use-permission";
import secureLocalStorage from "react-secure-storage";
import { User } from "@/modules/user/interface";
import { Badge } from "@tremor/react";

const { publicRuntimeConfig } = getConfig();

export const GetUser = () => {
	const [roles, setRoles] = useState([]);
	const [data, setData] = useState<User>();

	const tokens: any = secureLocalStorage.getItem("tokens") as object;
	const accessToken =
		tokens && "accessToken" in tokens ? tokens.accessToken : "";
	const userId = location.href.substring(location.href.lastIndexOf("/") + 1);

	const gethUser = async () => {
		try {
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/user/${userId}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			});
			setData(response?.data);
			console.log(response.data)
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		gethUser();
	}, []);

	return (
		<section className="py-1 bg-blueGray-50">
			<div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-blueGray-700 text-xl font-bold">
								User Details
							</h6>
							<img
								src={
									data?.attributes?.avatar
										? data?.attributes?.avatar[0]
										: "/avater.png"
								}
								className="h-24 w-24 rounded-md"
							/>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
							Basic Information
						</h6>
						<div className="flex flex-wrap">
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="firstName"
									>
										First Name
									</label>
									<Text className="text-black px-2">{data?.firstName}</Text>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="lastName"
									>
										Last Name
									</label>
									<Text className="text-black px-2">{data?.lastName}</Text>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<fieldset className="relative z-0 w-full p-px mb-5">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="gender"
									>
										Gender
									</label>
									<Text className="text-black px-2">
										{data?.attributes.gender}
									</Text>
								</fieldset>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="country"
									>
										Country
									</label>
									<Text className="text-black px-2">
										{data?.attributes.country}
									</Text>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="phone"
									>
										Contact Number
									</label>
									<Text className="text-black px-2">
										{data?.attributes.phone}
									</Text>
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
										className="block text-gray-600 text-xs mb-2"
										htmlFor="firstName"
									>
										Username
									</label>
									<Text className="text-black px-2">{data?.username}</Text>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="email"
									>
										Email
									</label>
									<Text className="text-black px-2">{data?.email}</Text>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gGray-600 text-xs mb-2"
										htmlFor="emailVerify"
									>
										Email Status
									</label>
									{
										data?.emailVerified ? <Badge color="emerald" icon={CheckIcon}>Active</Badge> : <Badge color="red" icon={XMarkIcon}>Inactive</Badge>
									}
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="enable"
									>
										User Status
									</label>
									{data?.enabled ? (
										<Badge color="emerald" icon={WifiIcon}>
											Active
										</Badge>
									) : (
										<Badge color="red" icon={ExclamationCircleIcon}>
											Inactive
										</Badge>
									)}
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block text-gray-600 text-xs mb-2"
										htmlFor="role"
									>
										User Role
									</label>
									{"Roles"}
								</div>
							</div>
						</div>
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
			{hasPermission("user:read") ? <GetUser /> : <Unauthorised />}
		</DashboardFrame>
	);
}
