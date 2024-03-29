import Layout from '@/common/components/Dashboard/Layout';
import { countries } from '@/common/utils/countries';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Divider,
  NumberInput,
  SearchSelect,
  SearchSelectItem,
  Text,
  TextInput,
} from '@tremor/react';
import { toast } from 'react-toastify';
import { useGetUserAvatarQuery, useGetUserQuery } from '@/modules/user/user';
import { useUploadAvatarMutation } from '@/modules/user/user';

import {
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  SignalSlashIcon,
  WifiIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { selectCurrentUser } from '@/modules/auth/auth';
import { useSelector } from 'react-redux';

export const ProfileSettings = () => {
  const [changePassword, setChangePassword] = useState(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const currentUser = useSelector(selectCurrentUser);
  const { t } = useTranslation();

  const myId: any = currentUser?.id;
  const { data } = useGetUserQuery(myId);

  const [country, setCountry] = useState<string>();
  const [gender, setGender] = useState<string>();
  const [firstName] = useState(currentUser?.given_name);
  const [lastName] = useState(currentUser?.family_name);
  /*const [email] = useState<string>();
  const [username] = useState<string>();
  const [enabled] = useState<string>();
  const [emailVerified] = useState<string>();
  const [role] = useState<string>();
  const [avatar, setAvatar] = useState<string>();*/
  const [phone, setPhone] = useState<string>();
  const [newPass, setNewPass] = useState<string>('');

  const [uploadAvatarMutation] = useUploadAvatarMutation();

  const onChange = (e?: string) => {
    setNewPass(String(e));
  };

  const {
    formState: { errors },
  } = useForm();

  const triggerPasswordChange = () => {
    setChangePassword(!changePassword);
  };
  const { data: avatarData } = useGetUserAvatarQuery(myId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']; // List of allowed image extensions
      const extension = file.name.split('.').pop()?.toLowerCase(); // Extract file extension

      if (extension && allowedExtensions.includes(extension)) {
        setSelectedFile(file);
        setImageUrl(file ? URL.createObjectURL(file) : null);
      } else {
        setSelectedFile(null);
        setImageUrl(null);
      }
    } else {
      setSelectedFile(null);
      setImageUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image to upload');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('uploadedFile', selectedFile, selectedFile.name);
      uploadAvatarMutation(formData).then((res: any) => {
        if (res.error) {
          const { data } = res.error;
          const { message } = data;
          toast.error(message, { position: 'top-right' });
          return;
        }
        toast.success('Profile image uploaded successfully', {
          position: 'top-right',
        });
      });
    } catch (error) {
      toast.error('An error occurred while uploading the profile image');
    }
  };

  /*const saveUserProfile = async () => {
    try {
      const updatedProfile: SerialUser = {
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        country: country || '',
        gender: gender || '',
        avatar: avatar || '',
        id: currentUser?.id,
        email: currentUser?.email || '',
        username: currentUser?.username || '',
        enabled: currentUser?.enabled || false,
        emailVerified: currentUser?.emailVerified || false,
        role: currentUser?.role || { id: '', name: '' },
      };
      await modifyUserMutation(updatedProfile);
      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };*/

  useEffect(() => {
    if (typeof window !== undefined) {
      const attributes = data?.attributes;
      if (attributes) {
        const { gender, country, phone } = attributes;
        gender && setGender(gender[0]);
        country && setCountry(country[0]);
        phone && setPhone(phone[0]);
        //avatar && setAvatar(avatar[0]);
      }
    }
  }, [data?.attributes]);

  return (
    <div className="my-5 w-full lg:w-8/12 px-4 mx-auto">
      <div className="md:flex no-wrap">
        {/* Left Side */}
        <div className="w-full md:w-2/3">
          {/* Profile Card */}
          <Card className="mb-6 bg-white p-5">
            <div className="flex ">
              <Image
                className="h-32 w-32 rounded-md"
                src={avatarData?.avatar_url || imageUrl || '/avater.png'}
                alt="avatar"
                width={128}
                height={128}
              />
            </div>
            <input
              onChange={handleFileChange}
              type="file"
              id="profile"
              name="profile"
            />
            <Button onClick={handleUpload}>Upload Image</Button>{' '}
            {/* Trigger file input dialog */}
            <div className="">
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {data?.firstName} {data?.lastName}
              </h1>
            </div>
            <div>
              <span className="text-gray-500 leading-8 my-1">
                Email Address
              </span>
              <p id="emailId" className="">
                {data?.email}
              </p>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">Phone Number</span>
              <p id="emailId" className="">
                {data?.attributes?.phone}
              </p>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">
                {t('username')}
              </span>
              <p id="emailId" className="">
                {data?.username}
              </p>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">
                {t('gender')}
              </span>
              <p id="emailId" className="">
                {data?.attributes?.gender}
              </p>
            </div>
            <div className="mt-5 mb-8">
              <span className="text-gray-500 leading-8 my-1">
                {t('country')}
              </span>
              <p id="emailId" className="">
                {data?.attributes?.country}
              </p>
            </div>
            <div className="">
              <span className="text-gray-500 leading-8 my-1">
                {t('accessRoles')}
              </span>
              <div>
                <div className="flex">
                  {data?.roles.map((role, index) => (
                    <Text
                      className="bg-gray-200 px-2 text-black rounded-md"
                      key={index}
                    >
                      {role?.name}
                    </Text>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">
                {t('emailStatus')}
              </span>
              <p>
                {data?.emailVerified ? (
                  <Badge color="indigo" icon={CheckIcon}>
                    Enable
                  </Badge>
                ) : (
                  <Badge color="red" icon={XMarkIcon}>
                    Disabled
                  </Badge>
                )}
              </p>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">
                {t('myStatus')}
              </span>
              <p>
                {data?.enabled ? (
                  <Badge color="green" icon={WifiIcon}>
                    {t('active')}
                  </Badge>
                ) : (
                  <Badge color="red" icon={SignalSlashIcon}>
                    {t('inactive')}{' '}
                  </Badge>
                )}
              </p>
            </div>
          </Card>
        </div>
        {/* Right Side */}
        <div className="w-full md:w-full md:mx-2">
          <Card className="bg-white mb-8">
            <div className="border-b-2 mb-6 flex items-center justify-between">
              <p className="flex items-center">{t('editProfile')}</p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                <div className="md:col-span-5">
                  <label htmlFor="firstName">{t('givenNames')}</label>
                  <TextInput
                    value={firstName}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="lastName">{t('lastName2')}</label>
                  <TextInput
                    value={lastName}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="phone">{t('phoneNumber')}</label>
                  <NumberInput
                    enableStepper={false}
                    onInput={(e: any) => setPhone(e.target.value)}
                    value={phone}
                    defaultValue={phone}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder={phone || 'phone'}
                  />
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="country">{t('country2')}</label>
                  <SearchSelect
                    onValueChange={(e) => {
                      setCountry(e);
                    }}
                    className="bg-white"
                    value={country}
                  >
                    {countries.map((item, index) => (
                      <SearchSelectItem
                        className="bg-white cursor-pointer"
                        key={index}
                        value={item.name}
                      >
                        {item.name}
                      </SearchSelectItem>
                    ))}
                  </SearchSelect>
                </div>
                <div className="md:col-span-2 w-full">
                  <label htmlFor="gender">{t('gender2')}</label>
                  <div className="flex">
                    <Button
                      onClick={() => setGender('Male')}
                      className={`rounded-l ${
                        gender == 'Male' ? 'bg-indigo-400 text-white' : ''
                      } text-sm`}
                    >
                      {t('male')}
                    </Button>
                    <Button
                      onClick={() => setGender('Female')}
                      className={`rounded-r ${
                        gender == 'Female' && 'bg-indigo-400 text-white'
                      } text-sm ml-2`} //
                    >
                      {t('female')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Divider className="border border-gray-200" />
              <div>
                <div className="flex space-x-2 items-end justify-end">
                  <Button
                    type="submit"
                    className="flex items-center hover:bg-prim-hover text-white"
                    icon={PlusCircleIcon}
                  >
                    {t('saveChanges')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <Card className="bg-white">
            <div className="mt-1 border-b-2 mb-6 flex items-center justify-between">
              <h1 className="">{t('credentialSettings')}</h1>
              <div className="flex items-center justify-center mt-4 mb-4">
                <Button
                  onClick={triggerPasswordChange}
                  className="flex items-center border-0 text-sm"
                  icon={PencilSquareIcon}
                >
                  {t('changePassword')}
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex mb-3 space-x-1 md:justify-between">
                <p> {t('email')}</p>
                <p>{data?.email}</p>
              </div>
              <div className="flex space-x-2 mb-3 md:justify-between">
                <p> {t('username')}</p>
                <p>{data?.username}</p>
              </div>
              <div className="flex mb-3 justify-between">
                <p> {t('password')}</p>
                <p>*************</p>
              </div>
            </div>
          </Card>
        </div>
        <Transition appear show={changePassword} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setChangePassword(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {t('changePassword')}
                    </Dialog.Title>
                    <div className="mt-5 flex-auto px-4 py-10 pt-0">
                      <form
                      // onSubmit={handleSubmit((data: any) => onSubmit(data))}
                      >
                        <div className="relative w-full mb-3">
                          <label
                            className="block text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="descriptiond"
                          >
                            {t('new')}
                          </label>
                          <TextInput
                            type="password"
                            value={newPass}
                            onChange={(e) => {
                              onChange(e.currentTarget.value);
                            }}
                            placeholder="new password"
                            className="mt-1 bg-gray-50"
                          />
                          {errors.description && (
                            <span className="text-sm text-red-600">
                              {t('provideRoleDescrip')}{' '}
                            </span>
                          )}
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="block text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="descriptiond"
                          >
                            {t('confirmPass')}
                          </label>
                          <TextInput
                            type="password"
                            placeholder="confirm password"
                            className="mt-1 bg-gray-50"
                          />
                          {errors.description && (
                            <span className="text-sm text-red-600">
                              {t('provideRoleDescrip')}{' '}
                            </span>
                          )}
                        </div>
                        <div className="mt-16 flex justify-end space-x-2">
                          <Button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => {
                              setChangePassword(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            // loading={loading}
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-prim px-4 py-2 text-sm font-medium text-white hover:bg-prim-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            {t('saveChanges')}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default function ProfileLayout() {
  return (
    <Layout>
      <ProfileSettings />
    </Layout>
  );
}
