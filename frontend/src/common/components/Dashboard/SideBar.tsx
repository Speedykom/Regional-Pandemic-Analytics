import { Ref, forwardRef } from "react";
import Link from "next/link";
import {
	HomeIcon,
	ChevronDoubleRightIcon,
	ChartBarSquareIcon,
	UsersIcon,
	CircleStackIcon,
	DocumentIcon,
	LockClosedIcon
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import secureLocalStorage from "react-secure-storage";

interface props {
	showNav?: boolean;
}

const SideBar = forwardRef(({ showNav }: props, ref: Ref<any>) => {
	const router = useRouter();
	const user: any = secureLocalStorage.getItem("user");
	const userRole: any = secureLocalStorage.getItem("user_role");
	const permits = userRole?.attributes;

	return (
		<div ref={ref} className="fixed z-50 w-64 h-full bg-white border-r">
			<div className="flex justify-center mt-6 mb-14">
				<picture>
					<img
						className="w-32 h-auto"
						src="/images/igad_logo.jpeg"
						alt="company logo"
					/>
				</picture>
			</div>

			<div className="flex flex-col">
				<Link href="/home/">
					<div
						className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
							router.pathname == "/home"
								? "bg-green-100 text-green-500"
								: "text-gray-400 hover:bg-green-100 hover:text-green-500"
						}`}
					>
						<div className="mr-5">
							<HomeIcon className="h-5 w-5" />
						</div>
						<div>
							<p>Home</p>
						</div>
					</div>
				</Link>
				{permits?.Dashboard && permits?.Dashboard?.read && (
					<Link href="/dashboards">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/dashboards"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<ChartBarSquareIcon className="h-5 w-5" />
							</div>
							<div>
								<p>Dashboards</p>
							</div>
						</div>
					</Link>
				)}
				{permits?.Chart && permits?.Chart?.read && (
					<Link href="/charts">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/charts"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<ChevronDoubleRightIcon className="h-5 w-5" />
							</div>
							<div>
								<p>Chart(s)</p>
							</div>
						</div>
					</Link>
				)}
				{permits?.ProcessChain && permits?.ProcessChain?.read && (
					<Link href="/process-chains">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/process-chains"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<ChevronDoubleRightIcon className="h-5 w-5" />
							</div>
							<div>
								<p>Process Chain(s)</p>
							</div>
						</div>
					</Link>
				)}
				{permits?.Data && permits?.Data?.read && (
					<Link href="/home/data">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/home/data"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<CircleStackIcon className="h-5 w-5" />
							</div>
							<div>
								<p>Data</p>
							</div>
						</div>
					</Link>
				)}

				{permits?.User && permits?.User?.read && (
					<Link href="/users">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/users"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<UsersIcon className="h-5 w-5" />
							</div>
							<div>
								<p>Accounts</p>
							</div>
						</div>
					</Link>
				)}
				{permits?.Role && permits?.Role?.read && (
					<Link href="/roles">
						<div
							className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
								router.pathname == "/roles"
									? "bg-green-100 text-green-500"
									: "text-gray-400 hover:bg-green-100 hover:text-green-500"
							}`}
						>
							<div className="mr-5">
								<LockClosedIcon className="h-5 w-5" />
							</div>
							<div>
								<p>App Roles</p>
							</div>
						</div>
					</Link>
				)}
				<Link href="/hop-template">
					<div
						className={`px-2 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
							router.pathname == "/hopes"
								? "bg-green-100 text-green-500"
								: "text-gray-400 hover:bg-green-100 hover:text-green-500"
						}`}
					>
						<div className="mr-5">
							<DocumentIcon className="h-5 w-5" />
						</div>
						<div>
							<p>Hop Template</p>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
});

SideBar.displayName = "SideBar";

export default SideBar;
