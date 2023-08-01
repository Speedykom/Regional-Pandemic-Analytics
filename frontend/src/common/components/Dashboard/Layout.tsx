import { useState, useEffect, Fragment, ReactNode } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Drawer from "../common/Drawer";

interface props {
	children: ReactNode;
}

export default function Layout({ children }: props) {
	const [isMobile, setIsMobile] = useState(false);
	const [showMobileNav, setShowMobileNav] = useState(false);

	function handleResize() {
		if (innerWidth <= 640) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	}

	useEffect(() => {
		if (typeof window != undefined) {
			addEventListener("resize", handleResize);
		}

		return () => {
			removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<TopBar
				isMobile={isMobile}
				isOpen={showMobileNav}
				setIsOpen={setShowMobileNav}
			/>
			<main className="flex">
				<Drawer isOpen={showMobileNav} setIsOpen={setShowMobileNav}>
					<p>Hello</p>
				</Drawer>

				<div className={`${isMobile && "hidden"} mt-16`}>
					<SideBar />
					{/* <SideBar open={showNav} setOpen={setShowNav} /> */}
				</div>
				<div className={`w-full pt-16 transition-all duration-[400ms]`}>
					<div className="px-4 bg-gray-100 h-screen">{children}</div>
				</div>
			</main>
		</>
	);
}

// ${
// 	showNav ? "pl-56" : ""
// }
