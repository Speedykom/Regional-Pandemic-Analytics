import { IUser } from "../interface";
import { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "next/config";
import secureLocalStorage from "react-secure-storage";
import {
	Card,
	Text,
	Badge,
	Table,
	Button,
	Flex,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
} from "@tremor/react";
import {
	CheckIcon,
	ExclamationCircleIcon,
	WifiIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Loading } from "@/common/components/Loading";
const { publicRuntimeConfig } = getConfig();
import MediaQuery from "react-responsive";
import { FiDelete, FiEdit, FiEye } from "react-icons/fi";
import { DataLoading } from "@/common/components/common/data-loading";

export const UserList = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [data, setData] = useState<Array<IUser>>([]);
	const [loading, setLoading] = useState<boolean>(true);
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

	useEffect(() => {
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
			<div>
				<Card>
					<Table className="mt-5">
						<TableHead>
							<TableRow>
								<TableHeaderCell>Full Name</TableHeaderCell>
								<MediaQuery minWidth={1824}>
									<TableHeaderCell>Username</TableHeaderCell>
									<TableHeaderCell>Email</TableHeaderCell>
									<TableHeaderCell>Phone</TableHeaderCell>
									<TableHeaderCell>Gender</TableHeaderCell>
									<TableHeaderCell>Country</TableHeaderCell>
									<TableHeaderCell>Email Verified</TableHeaderCell>
									<TableHeaderCell>Status</TableHeaderCell>
								</MediaQuery>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((item) => (
								<TableRow key={item.id}>
									<TableCell>
										<div className="flex items-center pr-1">
											<div>
												<div className="w-10 h-10 mr-3 overflow-hidden rounded-full flex items-center justify-center border border-gray-300">
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
											</div>
											<Text className="font-sans">
												{item.firstName} {item?.lastName}
											</Text>
										</div>
									</TableCell>
									<MediaQuery minWidth={1824}>
										<TableCell>
											<Text>{item.username}</Text>
										</TableCell>
										<TableCell>
											<Text>{item.email}</Text>
										</TableCell>
										<TableCell>
											<Text>
												{item.attributes?.phone
													? `${
															item.attributes?.code
																? item.attributes?.code[0]
																: ""
													  }${item.attributes?.phone[0]}`
													: ""}
											</Text>
										</TableCell>
										<TableCell>
											<Text>
												{item.attributes?.gender
													? item.attributes?.gender[0]
													: "None"}
											</Text>
										</TableCell>
										<TableCell>
											<Text>
												{item.attributes?.country
													? item.attributes?.country[0]
													: "None"}
											</Text>
										</TableCell>
										<TableCell>
											{item.emailVerified ? (
												<Badge
													className="flex items-center space-x-1"
													icon={CheckIcon}
													color="indigo"
												>
													True
												</Badge>
											) : (
												<Badge
													// className="flex items-center"
													icon={XMarkIcon}
													color="neutral"
												>
													False
												</Badge>
											)}{" "}
										</TableCell>
										<TableCell>
											{item.enabled ? (
												<Badge
													className="flex items-center space-x-1"
													color="emerald"
													icon={WifiIcon}
												>
													Active
												</Badge>
											) : (
												<Badge
													// className="flex items-center"
													color="neutral"
													icon={ExclamationCircleIcon}
												>
													Inactive
												</Badge>
											)}{" "}
										</TableCell>
									</MediaQuery>
									<TableCell>
										<Flex>
											<Button variant="primary">
												<FiEye />
											</Button>
											<Button
												variant="secondary"
												className="text-green-500 bg-gray-200"
											>
												<FiEdit />
											</Button>
											<Button className="text-white bg-red-500">
												<FiDelete />
											</Button>
										</Flex>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			</div>
			<button
				onClick={() => router.push("/users/add")}
				title="Add User"
				className="fixed z-90 bottom-10 right-8 w-16 h-16 md:w-20 md:h-20 lg:h-20 lg:w-20 bg-prim rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-prim hover:drop-shadow-2xl hover:animate-bounce duration-300"
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
