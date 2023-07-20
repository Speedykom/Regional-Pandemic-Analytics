import { Ref, forwardRef } from 'react';
import Link from 'next/link';
import {
  BiChart,
  BiData,
  BiGitMerge,
  BiGitPullRequest,
  BiHome,
  BiLock,
  BiUser,
} from 'react-icons/bi';
import { useRouter } from 'next/router';
import secureLocalStorage from 'react-secure-storage';
import { NavLink } from '../link';
import { usePermission } from '@/common/hooks/use-permission';

interface props {
  showNav?: boolean;
}

const SideBar = forwardRef(({ showNav }: props, ref: Ref<any>) => {
  const { hasPermission } = usePermission();
  const userRole: any = secureLocalStorage.getItem('user_role');
  const permits = userRole?.attributes;

  return (
    <div ref={ref} className="fixed z-50 w-64 h-full bg-white border-r">
      <div className="flex justify-center mt-6 mb-14">
        <picture>
          <img
            className="w-28 md:32 lg:32 h-auto"
            src="/images/igad_logo.jpeg"
            alt="company logo"
          />
        </picture>
      </div>

      <div className="flex flex-col">
        <NavLink
          href="/home"
          activeClassName="bg-prim text-white"
          className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
        >
          <BiHome className="text-xl" />
          <p>Home</p>
        </NavLink>
        {permits?.Dashboard && permits?.Dashboard?.read && (
          <NavLink
            href="/dashboards"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiChart className="text-xl" />
            <p>Dashboard</p>
          </NavLink>
        )}
        {permits?.Chart && permits?.Chart?.read && (
          <NavLink
            href="/charts"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiChart className="text-xl" />
            <p>Chart(s)</p>
          </NavLink>
        )}
        {permits?.ProcessChain && permits?.ProcessChain?.read && (
          <NavLink
            href="/process-chains"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiGitPullRequest className="text-xl" />
            <p>Process Chain(s)</p>
          </NavLink>
        )}
        {permits?.Data && permits?.Data?.read && (
          <NavLink
            href="/data"
            activeClassName="bg-prim text-white"
            className="px-3.5 py-3 mx-5 text-gray-400 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiData className="text-xl" />
            <p>Data</p>
          </NavLink>
        )}
        <NavLink
          href="/my-pipeline"
          activeClassName="bg-prim text-white"
          className="px-3.5 text-gray-400 py-3 mx-5 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
        >
          <BiGitMerge className="text-xl" />
          <p>My Pipeline(s)</p>
        </NavLink>
        {hasPermission('user:read') && (
          <NavLink
            href="/users"
            activeClassName="bg-prim text-white"
            className="px-3.5 text-gray-400 py-3 mx-5 rounded-xl space-x-4 text-center cursor-pointer mb-3 flex items-center transition-colors"
          >
            <BiUser className="text-xl" />
            <p>Account(s)</p>
          </NavLink>
        )}
        {permits?.Role && permits?.Role?.read && (
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
