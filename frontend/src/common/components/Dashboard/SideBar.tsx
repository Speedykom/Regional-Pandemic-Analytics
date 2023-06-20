import { Ref, forwardRef } from "react";
import Link from "next/link";
import { UsersIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { LuFolderGit2 } from "react-icons/lu";
import { useRouter } from "next/router";
import secureLocalStorage from "react-secure-storage";
import { NavLink } from "../link";
import {
  BiData,
  BiHomeCircle,
  BiLock,
  BiScatterChart,
  BiSitemap,
  BiUser,
} from "react-icons/bi";

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
      <div className="flex justify-center mt-12 mb-5">
        <picture>
          <img
            className="w-32 h-auto"
            src="/images/igad_logo.jpeg"
            alt="company logo"
          />
        </picture>
      </div>

      <div className="flex flex-col p-5">
        <NavLink
          href="/home"
          activeClassName="bg-green-800 text-white"
          className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
        >
          <BiHomeCircle className="text-xl" />
          <p>Home</p>
        </NavLink>
        {permits?.Dashboard && permits?.Dashboard?.read && (
          <NavLink
            href="/dashboards"
            activeClassName="bg-green-800 text-white"
            className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
          >
            <BiScatterChart className="text-xl" />
            <p>Dashboard</p>
          </NavLink>
        )}
        {permits?.ProcessChain && permits?.ProcessChain?.read && (
          <NavLink
            href="/process-chains"
            activeClassName="bg-green-800 text-white"
            className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
          >
            <BiSitemap className="text-xl" />
            <p>Process Chain</p>
          </NavLink>
        )}
        {permits?.Data && permits?.Data?.read && (
          <NavLink
            href="/data"
            activeClassName="bg-green-800 text-white"
            className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
          >
            <BiData className="text-2xl" />
            <p>Storage</p>
          </NavLink>
        )}

        {permits?.User && permits?.User?.read && (
          <NavLink
            href="/users"
            activeClassName="bg-green-800 text-white"
            className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
          >
            <BiUser className="text-xl" />
            <p>Accounts</p>
          </NavLink>
        )}
        {permits?.Role && permits?.Role?.read && (
          <NavLink
            href="/roles"
            activeClassName="bg-green-800 text-white"
            className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg mb-4"
          >
            <BiLock className="text-xl" />
            <p>App Roles</p>
          </NavLink>
        )}
        <NavLink
          href="/hop-template"
          activeClassName="bg-green-800 text-white"
          className="py-3 px-4 flex items-center space-x-3 text-gray-600 rounded-lg"
        >
          <LuFolderGit2 className="text-xl" />
          <p>Pipeline Templates</p>
        </NavLink>
      </div>
    </div>
  );
});

SideBar.displayName = "SideBar";

export default SideBar;
