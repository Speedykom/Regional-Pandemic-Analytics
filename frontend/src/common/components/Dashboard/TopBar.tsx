import React, { Dispatch, Fragment, SetStateAction } from 'react';
import {
  UserIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  Cog8ToothIcon,
} from '@heroicons/react/24/solid';
import {
  Bars3CenterLeftIcon,
  BellIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition, Popover } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearCredentials,
  selectCurrentUser,
  useLogoutFromHopMutation,
  useLogoutMutation,
} from '@/modules/auth/auth';
import { toast } from 'react-toastify';

interface props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isTabletOrMobile: boolean;
}

export default function TopBar({ isOpen, setIsOpen, isTabletOrMobile }: props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [logoutFromHop] = useLogoutFromHopMutation();
  const currentUser = useSelector(selectCurrentUser);
  const username = currentUser?.given_name;

  const handleLogout = async () => {
    logout()
      .then(() => {
        return logoutFromHop().catch((err) => {
          /* eslint-disable no-console */
          console.warn(err);
        });
      })
      .then(() => {
        dispatch(clearCredentials());
        router.push('/');
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.log(err);
        toast.error('Something went wrong!', { position: 'top-right' });
      });
  };

  return (
    <div
      className={`fixed bg-white w-full h-16 flex z-50 justify-between items-center transition-all duration-[400ms] border-b border-gray-400/70 `}
    >
      <div className="pl-8 flex items-center space-x-5">
        {isTabletOrMobile && (
          <Bars3CenterLeftIcon
            className="h-8 w-8 text-gray-700 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
        <p className="text-xl">Regional Pandemic Analytics</p>
      </div>
      <div className="flex pr-4 md:pr-16 items-center">
        <Popover className="relative">
          <Popover.Button className="outline-none mr-5 md:mr-8 cursor-pointer text-gray-700">
            <BellIcon className="h-6 w-6" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Popover.Panel className="absolute -right-16 sm:right-4 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen">
              <div className="relative p-3">
                <div className="flex justify-between items-center w-full">
                  <p className="text-gray-700 font-medium">Notifications</p>
                  <a className="text-sm text-orange-500" href="#">
                    Mark all as read
                  </a>
                </div>
                <div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
                  <div className="flex">
                    <div className="rounded-full shrink-0 bg-green-200 h-8 w-8 flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        RePAN Notification
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Test Notification text
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center items-center">
              <picture>
                <img
                  src={
                    currentUser && currentUser?.avatar
                      ? currentUser?.avatar
                      : '/avater.png'
                  }
                  className="rounded-full h-8 md:mr-4 border-2 border-white shadow-sm"
                  alt="avat"
                />
              </picture>
              <div>
                <span className="hidden md:block font-medium text-gray-700 text-sm">
                  {username}
                </span>
              </div>
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-700" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-lg">
              <div className="p-1">
                <Menu.Item>
                  <Link
                    href="/users/myprofile"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Your Profile
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="javascript:void(0)"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <Cog8ToothIcon className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="javascript:void(0)"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                    onClick={handleLogout}
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                    Log Out
                  </Link>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

// ${
//   showNav ? "pl-56" : "pl-16"
// }`
