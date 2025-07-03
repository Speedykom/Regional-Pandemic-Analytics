import React, { Dispatch, Fragment, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserIcon,
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/solid';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
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
import LanguageSelector from '../LanguageSelector';
import { useGetUserAvatarQuery } from '@/modules/user/user';

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
  const myId = currentUser?.id || '';

  const { data: userProfileImage } = useGetUserAvatarQuery(myId, {
    skip: !myId,
    refetchOnMountOrArgChange: true,
  });

  const { t } = useTranslation();
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
        toast.error(t('somethingWentWrong'), { position: 'top-right' });
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
        <p className="text-xl">Cameroon One Health Information System</p>
      </div>
      <div className="flex pr-4 md:pr-16 items-center">
        <LanguageSelector />
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center items-center">
              <picture>
                <img
                  src={userProfileImage ? userProfileImage : '/avater.png'}
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
                    {t('yourProfile')}
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link
                    href="/tokens"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    {t('tokens.tokenManagement')}
                  </Link>
                </Menu.Item>

                <Menu.Item>
                  <Link
                    href="javascript:void(0)"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                    onClick={handleLogout}
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                    {t('logOut')}
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
