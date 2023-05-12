import { forwardRef, useRef } from "react";
import Link from "next/link";
import { HomeIcon, ChevronDoubleRightIcon, ChartBarSquareIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

interface Props {
  ref: any
  showNav: boolean;
}

const SideBar = forwardRef(({ref}: Props) => {
  const router = useRouter();

  return (
    <div ref={ref} className="fixed w-56 h-full bg-white shadow-lg">
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
        <Link href="/dashboard/">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/dashboard"
                ? "bg-green-100 text-green-500"
                : "text-gray-400 hover:bg-green-100 hover:text-green-500"
            }`}
          >
            <div className="mr-2">
              <HomeIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Home</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/superset-dashboards/">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/superset-dashboards"
                ? "bg-green-100 text-green-500"
                : "text-gray-400 hover:bg-green-100 hover:text-green-500"
            }`}
          >
            <div className="mr-2">
              <ChartBarSquareIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Dashboards</p>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/process-chains">
          <div
            className={`pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center transition-colors ${
              router.pathname == "/process-chains"
                ? "bg-green-100 text-green-500"
                : "text-gray-400 hover:bg-green-100 hover:text-green-500"
            }`}
          >
            <div className="mr-2">
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </div>
            <div>
              <p>Process Chain(s)</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
});

SideBar.displayName = "SideBar";

export default SideBar;
