import { useState, useEffect, Fragment, ReactNode } from "react";
import SideBar from "./SideBar";
import {SideNav} from "../SideNav";
import TopBar from "./TopBar";
import { Transition } from "@headlessui/react";

interface props {
  children: ReactNode;
}

export default function Layout({ children }: props) {
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
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
    <div className="flex">
      {/* <TopBar showNav={showNav} setShowNav={setShowNav} /> */}
      <SideNav isOpen={showNav} />
      <main
        className={`pt-16 transition-all duration-[400ms] ${
          showNav && !isMobile ? "pl-56" : ""
        }`}
      >
        <div className="px-4 md:px-16 bg-gray-100 h-screen">{children}</div>
      </main>
    </div>
  );
}
