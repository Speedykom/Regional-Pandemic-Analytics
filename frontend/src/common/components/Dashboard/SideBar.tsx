import { Ref, forwardRef } from 'react';
import {
  BiChart,
  BiData,
  BiGitMerge,
  BiGitPullRequest,
  BiHome,
  BiLock,
  BiUser,
} from 'react-icons/bi';
import secureLocalStorage from 'react-secure-storage';
import { NavLink } from '../link';
import { usePermission } from '@/common/hooks/use-permission';
import { useMediaQuery } from 'react-responsive';

const SideBar = forwardRef((_props, ref: Ref<any>) => {
  const { hasPermission } = usePermission();

  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 })
  const isBigScreen = useMediaQuery({ minWidth: 1824 })
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1223 })

  return (
    <div ref={ref} className={`fixed z-50 h-full bg-white border-r ${isBigScreen && isDesktopOrLaptop ? "w-64" : isTabletOrMobile ? "w-28" : ""}`}>
      <div className="flex justify-center mt-6 mb-14">
        <picture>
          <img
            className={`h-auto ${isTabletOrMobile ? "w-20" : "w-32"}`}
            src="/images/igad_logo.jpeg"
            alt="company logo"
          />
        </picture>
      </div>

      <div className="flex flex-col">
        <NavLink
          href="/home"
          activeClassName="bg-prim text-white"
          className={`px-3.5 py-3 mx-5 text-gray-400 rounded-xl cursor-pointer mb-3 transition-colors flex items-center text-center space-x-4`}
        >
          <p><BiHome className="text-xl" /></p>
          <p>Home</p>
        </NavLink>
        {hasPermission('dashboard:read') && (
          <NavLink
            href="/dashboards"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiChart className="text-xl" />
            <p>Dashboard</p>
          </NavLink>
        )}
        {hasPermission('chart:read') && (
          <NavLink
            href="/charts"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiChart className="text-xl" />
            <p>Chart(s)</p>
          </NavLink>
        )}
        {hasPermission('process:read') && (
          <NavLink
            href="/process-chains"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiGitPullRequest className="text-xl" />
            <p>Process Chain(s)</p>
          </NavLink>
        )}
        {hasPermission('data:read') && (
          <NavLink
            href="/data"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiData className="text-xl" />
            <p>Data</p>
          </NavLink>
        )}
        {hasPermission('pipeline:read') && (
          <NavLink
            href="/my-pipeline"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 mx-5 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiGitMerge className="text-xl" />
            <p>My Pipeline(s)</p>
          </NavLink>
        )}
        {hasPermission('user:read') && (
          <NavLink
            href="/users"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 mx-5 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiUser className="text-xl" />
            <p>Account(s)</p>
          </NavLink>
        )}
        {hasPermission('user:read') && (
          <NavLink
            href="/roles"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 mx-5 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiLock className="text-xl" />
            <p>Roles</p>
          </NavLink>
        )}
      </div>
    </div>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar;
