import { useEffect, useState } from "react";
import Head from "next/head";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

import { motion, useAnimation } from "framer-motion";
import { SideNavLinks } from "./Menu";

export default function SideBar() {
	const controls = useAnimation();
	const controlstext = useAnimation();
	const controlstextopacity = useAnimation();
	const controlsfeed = useAnimation();
	const reversecontrolsfeed = useAnimation();
	const [active, setActive] = useState(true);

	const showMore = () => {
		controls.start({
			width: "200px",
			transition: { duration: 0.001 },
		});
		controlstextopacity.start({
			opacity: 1,
			transition: { delay: 0.3 },
		});
		controlstext.start({
			opacity: 1,
			display: "block",
			transition: { delay: 0.3 },
		});

		controlsfeed.start({
			display: "flex",
		});
		reversecontrolsfeed.start({
			display: "none",
		});

		setActive(true);
	};

	const showLess = () => {
		controls.start({
			width: "55px",
			transition: { duration: 0.001 },
		});
		controlsfeed.start({
			display: "none",
		});
		reversecontrolsfeed.start({
			display: "flex",
		});
		controlstextopacity.start({
			opacity: 0,
		});
		controlstext.start({
			opacity: 0,
			display: "none",
		});
		setActive(false);
	};

	useEffect(() => {}, [active]);

	return (
		<div className={`bg-white ${active && "w-full"} h-full border-r border-gray-400/70`}>
			<Head>
				<title>RePan Sidebar</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<motion.div
				animate={controls}
				className={`animation w-full duration-500 h-full group pt-10 relative shadow-xl text-gray-500 `}
			>
				<BsFillArrowLeftSquareFill
					onClick={() => {
						if (!active) {
							showMore();
						} else {
							showLess();
						}
					}}
					className={`cursor-pointer group-hover:block animate duration-300 absolute bg-prim text-white text-3xl -right-4 top-2 rounded-full border border-gray-400/70  ${!active && "rotate-180"}`}
				/>

				<motion.div
					// animate={reversecontrolsfeed}
					className="px-4 flex items-center justify-center flex-col mx-4 my-auto"
				>
					<img
						className={`w-32 h-auto ${!active && "w-10"}`}
						src="/images/igad_logo.jpeg"
						alt="company logo"
					/>
				</motion.div>

				<SideNavLinks controlstext={controlstext} controlstextopacity={controlstextopacity} />
			</motion.div>
		</div>
	);
}
