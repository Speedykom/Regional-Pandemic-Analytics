import { IUser } from "../interface";
import { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "next/config";
import secureLocalStorage from "react-secure-storage";
import { IRole } from "@/modules/roles/interface";
import { Card, Text, Badge } from "@tremor/react";
import {
	CheckIcon,
	ExclamationCircleIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	WifiIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/router";
import { Loading } from "@/common/components/Loading";
const { publicRuntimeConfig } = getConfig();

export const UserList = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [roles, setRoles] = useState([]);
	const [userRoles, setUserRoles] = useState<Array<IRole>>([]);
	const [roleLoading, setRoleLoading] = useState(true);
	const router = useRouter();

	const tokens: any = secureLocalStorage.getItem("tokens") as object;
	const accessToken =
		tokens && "accessToken" in tokens ? tokens.accessToken : "";

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/users`;
			await axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => {
					setLoading(false);
					setData(res?.data);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const refetch = () => {
		fetchUsers();
	};

	const fetchRoles = async () => {
		try {
			setRoleLoading(true);
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/role`;
			await axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
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
		fetchUsers();
	}, []);

	return (
		<div className="">
			<nav className="mb-5">
				<div>
					<h2 className="text-3xl">App Accounts</h2>
					<p className="my-2 text-gray-600">
						View and manage settings related to app users.
					</p>
				</div>
			</nav>
			<div className="container mb-5">
				{loading ? (
					<Loading />
				) : (
					<div className="flex flex-wrap">
						{data.map((item, index) => (
							<div className="lg:w-1/3 lg:p-2 md:py-2 md:w-full w-full">
								<Card>
									<div className="flex space-x-4">
										<div className="h-12 w-12 mr-2 overflow-hidden rounded-full flex items-center justify-center border border-gray-300">
											<img
												src={
													item?.attributes?.avatar &&
													item?.attributes?.avatar[0] != ""
														? item?.attributes?.avatar[0]
														: "/avater.png"
												}
												className="w-full h-full"
											/>
										</div>
										<div className="flex-1 space-y-4 py-1">
											<div className="h-4 rounded w-3/4 flex space-x-2">
												<Text className="text-lg font-sans">
													{item.firstName} {item?.lastName}
												</Text>
												<Text className="text-lg font-sans">
													({item.username})
												</Text>
											</div>
											<div className="space-y-2">
												<div className="h-4 rounded">
													<Text className="font-sans">{item.email}</Text>
												</div>
												<div className="h-4 rounded w-5/6 flex space-x-2">
													<Text className="font-sans">
														{item.attributes?.country
															? item.attributes?.country[0]
															: ""}
													</Text>
													<Text className="font-sans">
														-{" "}
														{item.attributes?.gender
															? item.attributes?.gender[0]
															: ""}
													</Text>
												</div>
											</div>
											<div className="space-y-2">
												<div className="h-4 rounded w-5/6 flex space-x-2">
													<Text className="font-sans">
														{item.attributes?.phone
															? `${
																	item.attributes?.code
																		? item.attributes?.code[0]
																		: ""
															  }${item.attributes?.phone[0]}`
															: ""}
													</Text>
													<Text className="font-sans">
														-{" "}
														{item.enabled ? (
															<Badge>Active</Badge>
														) : (
															<Badge color="slate">Inactive</Badge>
														)}
													</Text>
												</div>
											</div>
										</div>
										<div>
											<button>
												<FiMoreVertical className="text-xl" />
											</button>
										</div>
									</div>
								</Card>
							</div>
						))}
					</div>
				)}
			</div>
			<button
				onClick={() => router.push("/users/add")}
				title="Add User"
				className="fixed z-90 bottom-10 right-8 w-20 h-20 bg-prim rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-prim hover:drop-shadow-2xl hover:animate-bounce duration-300"
			>
				<svg
					viewBox="0 0 20 20"
					enable-background="new 0 0 20 20"
					className="w-6 h-6 inline-block"
				>
					<path
						fill="#FFFFFF"
						d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"
					/>
				</svg>
			</button>
		</div>
	);
};
