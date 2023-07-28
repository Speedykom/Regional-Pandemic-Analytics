import { ReactNode } from "react";
import {
	BiChart,
	BiData,
	BiGitMerge,
	BiGitPullRequest,
	BiHome,
	BiLock,
	BiTable,
	BiUser,
} from "react-icons/bi";
import { NavLink } from "../link";
import { boolean } from "zod";

interface MenuProps {
	title: string;
	href: string;
	icon: ReactNode;
	scope: string;
	isOpen: boolean;
}

export const Menus: Array<Omit<MenuProps, "isOpen">> = [
	{
		title: "Home",
		href: "/home",
		icon: <BiHome className="text-xl" />,
		scope: "",
	},
	{
		title: "Dashboard(s)",
		href: "/dashboards",
		icon: <BiTable className="text-xl" />,
		scope: "dashboard:read",
	},
	{
		title: "Chart(s)",
		href: "/charts",
		icon: <BiChart className="text-xl" />,
		scope: "chart:read",
	},
	{
		title: "Process Chain(s)",
		href: "/process-chains",
		icon: <BiGitPullRequest className="text-xl" />,
		scope: "process:read",
	},
	{
		title: "Data",
		href: "/data",
		icon: <BiData className="text-xl" />,
		scope: "data:read",
	},
	{
		title: "My Pipeline(s)",
		href: "/my-pipelines",
		icon: <BiGitMerge className="text-xl" />,
		scope: "pipeline:read",
	},
	{
		title: "Account(s)",
		href: "/users",
		icon: <BiUser className="text-xl" />,
		scope: "user:read",
	},
	{
		title: "Role(s)",
		href: "/roles",
		icon: <BiLock className="text-xl" />,
		scope: "user:read",
	},
];

export const SideNavLinks = (prop: MenuProps) => {
	return (
		<NavLink
			href={prop.href}
			activeClassName="bg-prim text-white"
			className={`px-3.5 py-3 text-gray-400 text-center cursor-pointer mb-3 transition-colors items-center ${
				prop.isOpen && "flex items-center mx-5 space-x-4"
			}`}
		>
			<span className="text-xl">{prop.icon}</span>
			<span className={`origin-left duration-200 ${!prop.isOpen && "hidden"}`}>
				{prop.title}
			</span>
		</NavLink>
	);
};
