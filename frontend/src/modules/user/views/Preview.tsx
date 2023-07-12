/* eslint-disable @next/next/no-img-element */

import { CovertFromTimestampToDate, ToMonthDayYear } from "@/common/utils/date-converter";
import { Drawer } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import getConfig from "next/config"
 
const { publicRuntimeConfig } = getConfig()

interface props {
	openDrawer: boolean;
	closeDrawer: () => void;
	userId: string;
}

export const PreviewUser = ({ openDrawer, closeDrawer, userId }: props) => {
	const [data, setData] = useState<any>();

	const tokens: any = secureLocalStorage.getItem("tokens") as object;
	const accessToken = tokens && 'accessToken' in tokens ? tokens.accessToken : '' 

	const fetchUser = async () => {
		try {
			const url = `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/user/${userId}`;
			const response = await axios.get(url, {
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${accessToken}`
				},
			});
			setData(response?.data);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);
	return (
		<Drawer
			title={"User Profile"}
			size="large"
			placement={"right"}
			closable={true}
			className="border-2"
			destroyOnClose={true}
			open={openDrawer}
			onClose={closeDrawer}
			width={1300}
		>
			<div className="container mx-auto my-5 p-5">
				<div className="md:flex no-wrap md:-mx-2">
					{/* <!-- Left Side --> */}
					<div className="w-full md:w-3/12 md:mx-2">
						{/* <!-- Profile Card --> */}
						<div className="bg-white p-3 border-t-4 border-green-400">
							<img
								className="h-32 w-32 rounded-md"
								src="/avater.png"
								alt=""
							/>
							<h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
								{data?.firstName} {data?.lastName}
							</h1>
							<h3 className="text-gray-600 font-lg text-semibold leading-6">
								Regional Pandemic Analytics.
							</h3>
							<ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
								<li className="flex items-center space-x-3 py-3">
									<span>Status</span>
									<span className="ml-auto">
										<span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
											{data?.enabled ? 'Enabled' : 'Disabled'}
										</span>
									</span>
								</li>
								<li className="flex items-center space-x-1 py-3">
									<span>Created since </span>
									<span className="ml-auto">
										{ToMonthDayYear(
											CovertFromTimestampToDate(data?.createdTimestamp)
										)}
									</span>
								</li>
							</ul>
						</div>
					</div>
					{/* <!-- Right Side --> */}
					<div className="w-full md:w-9/12 mx-2 h-64">
						{/* <!-- Profile tab -->
                <!-- About Section --> */}
                        <div className="bg-white p-3 shadow-sm rounded-sm">
                        <p className="block w-full text-blue-800 text-center text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
								See Full Information
							</p>
							<div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
								<span className="text-green-500">
									<svg
										className="h-5"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
								</span>
								<span className="tracking-wide">About</span>
							</div>
							<div className="text-gray-700">
								<div className="grid md:grid-cols-2 text-sm">
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">First Name</div>
										<div className="px-4 py-2">{data?.firstName}</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">Last Name</div>
										<div className="px-4 py-2">{data?.lastName}</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">Gender</div>
										<div className="px-4 py-2">Female</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">Contact No.</div>
										<div className="px-4 py-2">+11 998001001</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">
											Username
										</div>
										<div className="px-4 py-2">
											{data?.username}
										</div>
									</div>
									
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">Email Status</div>
										<div className="px-4 py-2">
											<a
												className="text-blue-800"
											>
												{data?.emailVerified ? 'Verified' : "Unverified"}
											</a>
										</div>
									</div>
									<div className="grid grid-cols-2">
										<div className="px-4 py-2 font-semibold">Email</div>
										<div className="px-4 py-2">{data?.email}</div>
									</div>
								</div>
							</div>
							<p className="block w-full text-blue-800 text-center text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">
								Additional Information
							</p>
						</div>
						{/* <!-- End of about section --> */}

						<div className="my-4"></div>

						{/* <!-- Experience and education --> */}
						<div className="bg-white p-3 shadow-sm rounded-sm">
							<div className="grid">
								<div>
									<div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
										<span className="text-green-500">
											<svg
												className="h-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
												<path
													fill="#fff"
													d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
												/>
											</svg>
										</span>
										<span className="tracking-wide">Roles</span>
									</div>
									<ul className="list-inside space-y-2">
										<li>
											<div className="text-teal-600">
												Manage
											</div>
											<div className="text-gray-500 text-xs">
												View
											</div>
										</li>
										<li>
											<div className="text-teal-600">
												Map Roles
											</div>
											<div className="text-gray-500 text-xs">
												Manage Group Membership
											</div>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};
