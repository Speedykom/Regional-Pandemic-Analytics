import { Text, Badge } from '@tremor/react';
import {
  CheckIcon,
  XMarkIcon,
  WifiIcon,
  SignalSlashIcon,
} from '@heroicons/react/24/outline';
import { useGetUserAvatarQuery, useGetUserQuery } from '@/modules/user/user';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/auth';

export const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetUserQuery(String(id));
  const currentUser = useSelector(selectCurrentUser);

  const { data: userProfileImage } = useGetUserAvatarQuery(
    currentUser?.id ?? '',
    {
      skip: !currentUser?.id,
    }
  );

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                User Details
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
              Basic Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="firstName"
                  >
                    First Name
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
                    Last Name
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
                    Gender
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
                    Country
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
                    Contact Number
                  </label>
                  <Text className="text-black px-2">
                    {data?.attributes?.phone}
                  </Text>
                </div>
              </div>
            </div>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              User Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="block text-gray-600 text-xs mb-2"
                    htmlFor="firstName"
                  >
                    Username
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
                    Email
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
                    Email Status
                  </label>
                  {data?.emailVerified ? (
                    <Badge color="indigo" icon={CheckIcon}>
                      Enable
                    </Badge>
                  ) : (
                    <Badge color="red" icon={XMarkIcon}>
                      Disabled
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
                    User Status
                  </label>
                  {data?.enabled ? (
                    <Badge color="green" icon={WifiIcon}>
                      Active
                    </Badge>
                  ) : (
                    <Badge color="red" icon={SignalSlashIcon}>
                      Inactive
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
                    User Role
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
