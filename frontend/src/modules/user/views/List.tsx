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
import MediaQuery from "react-responsive";
import { FiDelete, FiEdit, FiEye } from "react-icons/fi";
import { useGetUsersQuery } from "../user";

export const UserList = () => {
	const { data } = useGetUsersQuery();
	const router = useRouter();

	return (
		<div className="">
			<nav className="mb-5 flex justify-between items-center">
				<div className="">
					<h2 className="text-3xl">App Accounts</h2>
					<p className="my-2 text-gray-600">
						View and manage settings related to app users.
					</p>
				</div>
				<Button className="bg-prim text-white border-0" onClick={() => router.push("/users/add")}>New User</Button>
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
							{(data || []).map((item, index) => (
								<TableRow key={index}>
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
													? item.attributes?.phone[0]
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
		</div>
	);
};
