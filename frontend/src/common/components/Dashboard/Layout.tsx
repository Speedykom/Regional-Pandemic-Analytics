import { useState, useEffect, Fragment, ReactNode } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface props {
	children: ReactNode;
}

export default function Layout({ children }: props) {
	const [showNav, setShowNav] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

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
			<TopBar />
			<main className="flex">
					<div className={`${isMobile && "hidden"} mt-16`}>
						<SideBar />
						{/* <SideBar open={showNav} setOpen={setShowNav} /> */}
					</div>
				<div
					className={`w-full pt-16 transition-all duration-[400ms]`}
				>
					<div className="px-4 bg-gray-100 h-screen">{children}</div>
				</div>
			</main>
		</>
	);
}

// ${
// 	showNav ? "pl-56" : ""
// }
