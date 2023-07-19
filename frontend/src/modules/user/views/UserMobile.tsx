import { Loading } from "@/common/components/Loading";
import { IUser } from "../interface";
import { Badge, Card, Text } from "@tremor/react";
import { FiMoreVertical } from "react-icons/fi";
import { ExclamationCircleIcon, WifiIcon } from "@heroicons/react/24/outline";

interface props {
	loading: boolean;
	data: Array<IUser>;
}
export const UserListMobile = ({ loading, data }: props) => {
	return (
		<div className="container mb-5">
			{loading ? (
				<Loading />
			) : (
				<div className="flex flex-wrap">
					{data.map((item, index) => (
						<div key={index} className="lg:w-1/3 lg:p-2 md:py-2 md:w-full w-full py-2">
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
														<Badge icon={WifiIcon}>Active</Badge>
													) : (
														<Badge color="slate" icon={ExclamationCircleIcon}>
															Inactive
														</Badge>
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
	);
};
