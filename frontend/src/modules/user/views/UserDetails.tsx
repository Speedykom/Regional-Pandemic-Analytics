import { Text, Badge } from '@tremor/react';
import {
  CheckIcon,
  XMarkIcon,
  WifiIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';
import { useGetUserAvatarQuery, useGetUserQuery } from '@/modules/user/user';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';

export const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetUserQuery(String(id));
  const { t } = useTranslation();

  const { data: userProfileImage } = useGetUserAvatarQuery(data?.id ?? '', {
    skip: !data?.id,
  });

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                {t('user.userDetails')}
              </h6>
              <img
                src={userProfileImage ? userProfileImage : '/avater.png'}
                alt="avatar"
                className="h-24 w-24 rounded-md"
              />
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              {t('user.basicInformation')}
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="firstName"
                  >
                    {t('user.firstName')}
                  </label>
                  <Text className="text-black px-2">{data?.firstName}</Text>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="lastName"
                  >
                    {t('user.lastName')}
                  </label>
                  <Text className="text-black px-2">{data?.lastName}</Text>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <fieldset className="relative z-0 w-full p-px mb-5">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="gender"
                  >
                    {t('user.gender')}
                  </label>
                  <Text className="text-black px-2">
                    {data?.attributes?.gender}
                  </Text>
                </fieldset>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="country"
                  >
                    {t('user.country')}
                  </label>
                  <Text className="text-black px-2">
                    {data?.attributes?.country}
                  </Text>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="phone"
                  >
                    {t('user.contactNumber')}
                  </label>
                  <Text className="text-black px-2">
                    {data?.attributes?.phone}
                  </Text>
                </div>
              </div>
            </div>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              {t('user.userInformation')}
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="firstName"
                  >
                    {t('user.username')}
                  </label>
                  <Text className="text-black px-2">{data?.username}</Text>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="email"
                  >
                    {t('user.email')}
                  </label>
                  <Text className="text-black px-2">{data?.email}</Text>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gGray-600 text-xs mb-2"
                    htmlFor="emailVerify"
                  >
                    {t('user.emailStatus')}
                  </label>
                  {data?.emailVerified ? (
                    <Badge color="indigo" icon={CheckIcon}>
                      {t('user.enable')}
                    </Badge>
                  ) : (
                    <Badge color="red" icon={XMarkIcon}>
                      {t('user.disable')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="enable"
                  >
                    {t('user.userStatus')}
                  </label>
                  {data?.enabled ? (
                    <Badge color="green" icon={WifiIcon}>
                      {t('user.active')}
                    </Badge>
                  ) : (
                    <Badge color="red" icon={SignalSlashIcon}>
                      {t('user.inactive')}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="role"
                  >
                    {t('user.userRole')}
                  </label>
                  <div>
                    <div className="flex px-2">
                      {data?.roles.map((role, index) => (
                        <Text
                          className="bg-gray-200 p-2 text-black rounded-md"
                          key={index}
                        >
                          {role?.name}
                        </Text>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
