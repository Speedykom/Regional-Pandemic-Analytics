import {
	Card,
	Text,
	Badge,
	Table,
	Button,
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
import { useDisableUserMutation, useGetUsersQuery } from "../user";
import { useState } from "react";
import { toast } from "react-toastify";

export const UserList = () => {
	const { data } = useGetUsersQuery();
	const [disableUser, result] = useDisableUserMutation();
	const router = useRouter();
	const [onDeleteLoad, setOnDeleteLoad] = useState(false);

	const onDelete = (id: string) => {
		setOnDeleteLoad(true);
		disableUser(id).then((res: any) => {
			if (res.error) {
				setOnDeleteLoad(false);
				toast.error(res?.response?.data?.message, {
					position: "top-right",
				});
				console.log({ error: res.error });
				return;
			} else {
				setOnDeleteLoad(false);
				toast.success(res?.data?.message, {
					position: "top-right",
				});
			}
		});
	};

	return (
		<div className="">
			<nav className="mb-5 flex justify-between items-center">
				<div>
					<h2 className="text-3xl">App Accounts</h2>
					<p className="my-2 text-gray-600">
						View and manage settings related to app users.
					</p>
				</div>
				<Button
					className="bg-prim text-white border-0"
					onClick={() => router.push("/users/add")}
				>
					New User
				</Button>
			</nav>
			<div>
				<Card>
					<Table>
						<TableHead className=" bg-cyan-100">
							<TableRow>
								<TableHeaderCell>Full Name</TableHeaderCell>
								<MediaQuery minWidth={768}>
									<TableHeaderCell className="">Username</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1090}>
									<TableHeaderCell className="">Email</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1220}>
									<TableHeaderCell className="">Phone</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1350}>
									<TableHeaderCell className="">Gender</TableHeaderCell>
									<TableHeaderCell className="">Country</TableHeaderCell>
								</MediaQuery>
								<MediaQuery minWidth={1624}>
									<TableHeaderCell className="">Email Verified</TableHeaderCell>
									<TableHeaderCell className="">Status</TableHeaderCell>
								</MediaQuery>
								<TableHeaderCell></TableHeaderCell>
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
									<MediaQuery minWidth={768}>
										<TableCell className="">
											<Text>{item.username}</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1090}>
										<TableCell className="">
											<Text>{item.email}</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1220}>
										<TableCell className="">
											<Text>
												{item.attributes?.phone
													? item.attributes?.phone[0]
													: ""}
											</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1350}>
										<TableCell className="">
											<Text>
												{item.attributes?.gender
													? item.attributes?.gender[0]
													: "None"}
											</Text>
										</TableCell>
										<TableCell className="">
											<Text>
												{item.attributes?.country
													? item.attributes?.country[0]
													: "None"}
											</Text>
										</TableCell>
									</MediaQuery>
									<MediaQuery minWidth={1624}>
										<TableCell className="">
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
													icon={XMarkIcon}
													color="neutral"
												>
													False
												</Badge>
											)}{" "}
										</TableCell>
										<TableCell className="">
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
													color="neutral"
													icon={ExclamationCircleIcon}
												>
													Inactive
												</Badge>
											)}{" "}
										</TableCell>
									</MediaQuery>
									<TableCell>
										<div className="flex space-x-2 justify-end">
											<Button
												title="View Details"
												variant="primary"
												onClick={() => router.push(`users/${item.id}/details`)}
											>
												<FiEye />
											</Button>
											<Button
												title="Edit Details"
												variant="secondary"
												className="text-green-500 bg-gray-200 border-0"
												onClick={() => router.push(`users/${item.id}/edit`)}
											>
												<FiEdit />
											</Button>
											<Button
												title="Disable User"
												loading={onDeleteLoad}
												className="text-white bg-red-500 border-0"
												onClick={(e) => {
													e.preventDefault();
													onDelete(item.id);
												}}
											>
												<FiDelete />
											</Button>
										</div>
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
