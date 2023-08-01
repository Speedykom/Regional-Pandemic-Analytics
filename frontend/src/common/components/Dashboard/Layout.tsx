import { useState, ReactNode } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Drawer from "../common/Drawer";
import { SideNavLinks } from "./Menu";
import { useMediaQuery } from "react-responsive";

interface props {
	children: ReactNode;
}

export default function Layout({ children }: props) {
	const [showMobileNav, setShowMobileNav] = useState(false);
	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

	return (
		<>
			<TopBar
				isOpen={showMobileNav}
				setIsOpen={setShowMobileNav}
				isTabletOrMobile={isTabletOrMobile}
			/>
			<main className="flex">
				<div className={`mt-16`}>
					{!isTabletOrMobile && <SideBar />}
					<Drawer
						title="RePAN"
						placement="left"
						isOpen={showMobileNav}
						onClose={() => setShowMobileNav(false)}
					>
						<div className="px-4 py-4">
							<div className={`text-gray-500`}>
								<div className="px-4 flex items-center justify-center flex-col mx-4 my-auto">
									<img
										className={`w-32 h-auto`}
										src="/images/igad_logo.jpeg"
										alt="company-logo"
									/>
								</div>
								<SideNavLinks />
							</div>
						</div>
					</Drawer>
				</div>
				<div className={`w-full pt-16 transition-all duration-[400ms]`}>
					<div className="bg-gray-100 h-screen">{children}</div>
				</div>
			</main>
		</>
	);
}
