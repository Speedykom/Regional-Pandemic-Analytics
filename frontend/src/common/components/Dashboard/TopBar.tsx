import React, {
	Dispatch,
	Fragment,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import {
	Bars3CenterLeftIcon,
	UserIcon,
	ChevronDownIcon,
	ArrowLeftOnRectangleIcon,
	Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import secureLocalStorage from "react-secure-storage";
import { useRouter } from "next/router";
import axios from "axios";
import { PreviewUser } from "@/modules/user/views/Preview";

interface props {
	showNav: boolean;
	setShowNav: Dispatch<SetStateAction<boolean>>;
}

export default function TopBar({ showNav, setShowNav }: props) {
	const router = useRouter();
	const [username, setUsername] = useState<string | null>();
	const [myId, setMyId] = useState<string>();

	const [view, setView] = useState<boolean>(false);

	const viewPro = () => {
		setView(true);
	};
	const onCloseView = () => {
		setView(false);
	};

	const profile: any = secureLocalStorage.getItem(
		"user"
	) as object;

	useEffect(() => {
		if (typeof window !== undefined && window.localStorage) {
			const user: string | null = secureLocalStorage.getItem(
				"username"
			) as string;
			const userId: string = secureLocalStorage.getItem("userId") as string;
			setUsername(user);
			setMyId(userId);
		}
	}, []);

	const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		await axios.post("/api/auth/logout/").then((response) => {
			if (response.status === 200) {
				router.push("/");
			}
		});
	};
	return (
		<div
			className={`fixed bg-white w-full h-16 z-50 flex justify-between items-center transition-all duration-[400ms] border-b ${
				showNav ? "pl-56" : ""
			}`}
		>
			<div className="pl-4 md:pl-16 flex items-center space-x-5">
				<Bars3CenterLeftIcon
					className="h-8 w-8 text-gray-700 cursor-pointer"
					onClick={() => setShowNav(!showNav)}
				/>
				<p className="text-xl font-semibold">Regional Pandemic Analytics</p>
			</div>
			<div className="flex pr-4 md:pr-16 items-center">
				<Popover className="relative">
					<Popover.Button className="outline-none mr-5 md:mr-8 cursor-pointer text-gray-700">
						<BellIcon className="h-6 w-6" />
					</Popover.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform scale-95"
						enterTo="transform scale-100"
						leave="transition ease-in duration=75"
						leaveFrom="transform scale-100"
						leaveTo="transform scale-95"
					>
						<Popover.Panel className="absolute -right-16 sm:right-4 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen">
							<div className="relative p-3">
								<div className="flex justify-between items-center w-full">
									<p className="text-gray-700 font-medium">Notifications</p>
									<a className="text-sm text-orange-500" href="#">
										Mark all as read
									</a>
								</div>
								<div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
									<div className="flex">
										<div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
											<CheckIcon className="h-4 w-4 text-green-600" />
										</div>
										<div className="ml-4">
											<p className="font-medium text-gray-700">
												RePAN Notification
											</p>
											<p className="text-sm text-gray-500 truncate">
												Test Notification text
											</p>
										</div>
									</div>
									<div className="flex">
										<div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
											<CheckIcon className="h-4 w-4 text-green-600" />
										</div>
										<div className="ml-4">
											<p className="font-medium text-gray-700">
												RePAN Notification
											</p>
											<p className="text-sm text-gray-500 truncate">
												Test Notification text
											</p>
										</div>
									</div>
									<div className="flex">
										<div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
											<CheckIcon className="h-4 w-4 text-green-600" />
										</div>
										<div className="ml-4">
											<p className="font-medium text-gray-700">
												RePAN Notification
											</p>
											<p className="text-sm text-gray-500 truncate">
												Test Notification text
											</p>
										</div>
									</div>
									<div className="flex">
										<div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
											<CheckIcon className="h-4 w-4 text-green-600" />
										</div>
										<div className="ml-4">
											<p className="font-medium text-gray-700">
												RePAN Notification
											</p>
											<p className="text-sm text-gray-500 truncate">
												Test Notification text
											</p>
										</div>
									</div>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</Popover>
				<Menu as="div" className="relative inline-block text-left">
					<div>
						<Menu.Button className="inline-flex w-full justify-center items-center">
							<picture>
								<img
									src={profile && profile?.avatar ? profile?.avatar : '/avater.png'}
									className="rounded-full h-8 md:mr-4 border-2 border-white shadow-sm"
									alt="avat"
								/>
							</picture>
							<div>
							<span className="hidden md:block font-medium text-gray-700 text-sm">
								{username}
							</span>
							</div>
							<ChevronDownIcon className="ml-2 h-4 w-4 text-gray-700" />
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-100"
						enterFrom="transform scale-95"
						enterTo="transform scale-100"
						leave="transition ease-in duration=75"
						leaveFrom="transform scale-100"
						leaveTo="transform scale-95"
					>
						<Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-lg">
							<div className="p-1">
								<Menu.Item>
									<Link
										href="/users/myprofile"
										className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
									>
										<UserIcon className="h-4 w-4 mr-2" />
										Your Profile
									</Link>
								</Menu.Item>
								<Menu.Item>
									<Link
										href="#"
										className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
									>
										<Cog8ToothIcon className="h-4 w-4 mr-2" />
										Settings
									</Link>
								</Menu.Item>
								<Menu.Item>
									<Link
										href="#"
										className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
										onClick={handleLogout}
									>
										<ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
										Log Out
									</Link>
								</Menu.Item>
							</div>
						</Menu.Items>
					</Transition>
				</Menu>
			</div>
			{view && myId && (
				<div>
					<PreviewUser
						openDrawer={view}
						closeDrawer={onCloseView}
						userId={String(myId)}
					/>
				</div>
			)}
		</div>
	);
}
