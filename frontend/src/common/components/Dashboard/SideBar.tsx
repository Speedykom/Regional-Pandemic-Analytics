import { Ref, forwardRef } from "react";
import { NavLink } from "../link";
import { usePermission } from "@/common/hooks/use-permission";
import { Menus, SideNavLinks } from "./Menu";

interface props {
	open: boolean;
}

const SideBar = forwardRef((_props: props, ref: Ref<any>) => {
	const { hasPermission } = usePermission();

	return (
		<div
			ref={ref}
			className={`${
				_props.open ? "w-64" : "w-20"
			} fixed z-50 h-full bg-white border-r items-center duration-300`}
		>
			<div className="flex justify-center mt-3 mb-10">
				<picture>
					<img
						className={`w-32 h-auto ${!_props.open && "rotate-[360deg]"}`}
						src="/images/igad_logo.jpeg"
						alt="company logo"
					/>
				</picture>
			</div>

			<div className={`flex flex-col`}>
				{Menus.map((menu, index) => (
					<>
						{menu.title == "Home" ? (
							<SideNavLinks
								key={index}
								href={menu.href}
								title={menu.title}
								icon={menu.icon}
								scope={menu.scope}
								isOpen={_props.open}
							/>
						) : (
							hasPermission(menu.scope) && (
								<SideNavLinks
									key={index}
									href={menu.href}
									title={menu.title}
									icon={menu.icon}
									scope={menu.scope}
									isOpen={_props.open}
								/>
							)
						)}
					</>
				))}
			</div>
		</div>
	);
});

SideBar.displayName = "SideBar";

export default SideBar;
