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
          className={`px-3.5 py-3 text-gray-400 cursor-pointer mb-3 transition-colors flex items-center text-center space-x-4`}
        >
          {/* <BiHome className="text-xl" /> */}
          <div className={`${isTabletOrMobile ? "text-center items-center justify-center": ""}`}><BiHome className="text-xl text-center" />Home</div>
        </NavLink>
        {hasPermission('dashboard:read') && (
          <NavLink
            href="/dashboards"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 text-gray-400 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiChart className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "text-center items-center justify-center": ""}`}><BiChart className="text-xl text-center" />Dashboard</div>
          </NavLink>
        )}
        {hasPermission('chart:read') && (
          <NavLink
            href="/charts"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 text-gray-400 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiChart className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiChart className="text-xl text-center" />Chart(s)</div>
          </NavLink>
        )}
        {hasPermission('process:read') && (
          <NavLink
            href="/process-chains"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 text-gray-400 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiGitPullRequest className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiGitPullRequest className="text-xl text-center" />Processes</div>
          </NavLink>
        )}
        {hasPermission('data:read') && (
          <NavLink
            href="/data"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiData className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiData className="text-xl text-center" />Data</div>
          </NavLink>
        )}
        {hasPermission('pipeline:read') && (
          <NavLink
            href="/my-pipeline"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiGitMerge className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiGitMerge className="text-xl text-center" />Pipeline(s)</div>
          </NavLink>
        )}
        {hasPermission('user:read') && (
          <NavLink
            href="/users"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiUser className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiUser className="text-xl text-center" />Account(s)</div>
          </NavLink>
        )}
        {hasPermission('user:read') && (
          <NavLink
            href="/roles"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            {/* <BiLock className="text-xl" /> */}
            <div className={`${isTabletOrMobile ? "items-center justify-center": ""}`}><BiLock className="text-xl text-center" />Roles</div>
          </NavLink>
        )}
      </div>
    </div>
  );
});

SideBar.displayName = 'SideBar';

export default SideBar;
