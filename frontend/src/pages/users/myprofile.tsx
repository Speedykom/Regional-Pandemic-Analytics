import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import getConfig from 'next/config';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';
import {
  Badge,
  Button,
  Card,
  Divider,
  SearchSelect,
  SearchSelectItem,
  Text,
  TextInput,
} from '@tremor/react';
import { useDropzone } from 'react-dropzone';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  SignalSlashIcon,
  WifiIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import CryptoJS from 'crypto-js';
import { countries } from '@/common/utils/countries';
import Layout from '@/common/components/Dashboard/Layout';
import {
  useGetUserQuery,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useGetUserAvatarQuery,
  useModifyUserMutation,
} from '@/modules/user/user';
import { selectCurrentUser } from '@/modules/auth/auth';

export const ProfileSettings = () => {
  const [changePassword, setChangePassword] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const currentUser = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const { publicRuntimeConfig } = getConfig();

  const myId = currentUser?.id || '';
  const { data } = useGetUserQuery(myId);
  const {
    data: avatarData,
    isLoading,
    isError,
  } = useGetUserAvatarQuery(myId, { skip: !myId });

  const [imageUrl, setImageUrl] = useState(avatarData || '/avater.png');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadAvatarMutation] = useUploadAvatarMutation();
  const [changePasswordMutation] = useChangePasswordMutation();
  const [modifyUserMutation] = useModifyUserMutation();
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { dirtyFields, isDirty },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      country: '',
      gender: '',
      email: '',
    },
  });

  const triggerPasswordChange = () => {
    setChangePassword(!changePassword);
  };
  const onChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser?.id) {
      toast.error(t('userUndefined'));
      return;
    }
    if (newPass !== confirmPass) {
      toast.error(t('passwordsDoNotMatch'), { position: 'top-right' });
      return;
    }
    try {
      const keyHex = publicRuntimeConfig.NEXT_PUBLIC_PASSWORD_HEX_KEY;
      const ivHex = publicRuntimeConfig.NEXT_PUBLIC_PASSWORD_IVHEX;
      const key = CryptoJS.enc.Hex.parse(keyHex);
      const iv = CryptoJS.enc.Hex.parse(ivHex);

      const encryptedNewPassword = CryptoJS.AES.encrypt(newPass, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
      await changePasswordMutation({
        id: currentUser.id,
        newPassword: encryptedNewPassword,
        confirmPassword: encryptedNewPassword,
      }).unwrap();
      toast.success(t('passwordChangeSuccess'), { position: 'top-right' });
      setChangePassword(false);
    } catch (error) {
      toast.error(t('passwordChangeError'), { position: 'top-right' });
    }
  };
  useEffect(() => {
    if (!isLoading && !isError && avatarData) {
      setImageUrl(avatarData);
    }
  }, [avatarData, isLoading, isError]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.info(t('uploadMessages.selectImage'));
      return;
    }
    const formData = new FormData();
    formData.append('uploadedFile', selectedFile);
    try {
      await uploadAvatarMutation({ avatarData: formData, id: myId }).unwrap();
      toast.success(t('uploadMessages.uploadSuccess'));
      setSelectedFile(null);
    } catch (error) {
      toast.error(t('uploadMessages.uploadError'));
    }
  };
  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: Array.isArray(data.attributes?.phone)
          ? data.attributes.phone[0] || ''
          : data.attributes?.phone || '',
        country: Array.isArray(data.attributes?.country)
          ? data.attributes.country[0] || ''
          : data.attributes?.country || '',
        gender: Array.isArray(data.attributes?.gender)
          ? data.attributes.gender[0] || ''
          : data.attributes?.gender || '',
        email: data.email || '',
      });
    }
  }, [data, reset]);

  const saveChanges = async () => {
    if (!isDirty) {
      toast.info(t('noChangesMade'), { position: 'top-right' });
      return;
    }

    // Get updated values from the form
    const updatedValues = getValues();

    const formData = {
      firstName: dirtyFields.firstName
        ? updatedValues.firstName
        : data?.firstName || '',
      lastName: dirtyFields.lastName
        ? updatedValues.lastName
        : data?.lastName || '',
      email: dirtyFields.email ? updatedValues.email : data?.email || '',

      attributes: {
        phone: dirtyFields.phone
          ? updatedValues.phone
          : data?.attributes?.phone || '',
        gender: dirtyFields.gender
          ? updatedValues.gender
          : data?.attributes?.gender || '',
        country: dirtyFields.country
          ? updatedValues.country
          : data?.attributes?.country || '',
      },
    };

    try {
      await modifyUserMutation({ id: myId, userData: formData });
      toast.success(t('profileUpdateSuccess'), { position: 'top-right' });
    } catch (error) {
      toast.error(t('profileUpdateError'), { position: 'top-right' });
    }
  };

  return (
    <div className="my-5 w-full lg:w-8/12 px-4 mx-auto">
      <div className="md:flex no-wrap">
        {/* Left Side */}
        <div className="w-full md:w-2/3">
          {/* Profile Card */}
          <Card className="mb-6 bg-white p-5">
            <div className="flex flex-col items-center justify-center p-4">
              <div
                {...getRootProps()}
                className="w-64 h-64 rounded-lg overflow-hidden border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 transition-all relative"
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center h-full">
                  {imageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imageUrl}
                        alt="Profile avatar"
                        className={`object-cover w-full h-full ${
                          isDragActive ? 'opacity-50' : 'opacity-100'
                        }`}
                      />
                      {/* Button for changing the profile picture */}
                      <Button
                        onClick={handleUpload}
                        className="absolute bottom-0 right-0 mb-2 mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        style={{ zIndex: 10 }}
                      >
                        <FaCamera className="inline mr-2" />
                        {t('changePicture')}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaCamera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-600">
                        Click or drag profile picture to upload
                      </p>
                    </div>
                  )}
                  {isDragActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25">
                      <p className="text-white text-lg">
                        Drop the files here...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {t('uploadPicture')}
            </Button>
            <div className="">
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {data?.firstName} {data?.lastName}
              </h1>
            </div>
            <div>
              <span className="text-gray-500 leading-8 my-1">
                {t('emailAddress')}
              </span>
              <p id="emailId" className="">
                {data?.email}
              </p>
            </div>
            <div className="mt-5">
              <span className="text-gray-500 leading-8 my-1">
                {t('phoneNumber')}
              </span>
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
                    {t('verified')}
                  </Badge>
                ) : (
                  <Badge color="red" icon={XMarkIcon}>
                    {t('unverified')}
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
        <div className="w-full md:w-2/3">
          {/* Profile Card */}
          <Card className="bg-white mb-8">
            <form onSubmit={handleSubmit(saveChanges)}>
              <label htmlFor="firstName">{t('firstName')}</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    id="firstName"
                    placeholder={t('givenNames')}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                )}
              />

              <label htmlFor="lastName">{t('lastName2')}</label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    id="lastName"
                    placeholder={t('lastName')}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                )}
              />

              <label htmlFor="phone">{t('phone')}</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    id="phone"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder={t('phoneNumber')}
                    pattern="^\+?\d{0,13}"
                  />
                )}
              />

              <label htmlFor="email">{t('email')}</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder={t('email')}
                  />
                )}
              />

              <label htmlFor="country">{t('country2')}</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    {...field}
                    id="country"
                    onValueChange={field.onChange}
                    className="bg-white"
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
                )}
              />

              <label htmlFor="gender">{t('gender2')}</label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    {...field}
                    id="gender"
                    onValueChange={field.onChange}
                    className="bg-white"
                  >
                    {[t('male'), t('female')].map((gender, index) => (
                      <SearchSelectItem
                        className="bg-white cursor-pointer"
                        key={index}
                        value={gender}
                      >
                        {gender}
                      </SearchSelectItem>
                    ))}
                  </SearchSelect>
                )}
              />

              <Divider className="border border-gray-200" />
              <Button
                type="submit"
                className="flex items-center hover:bg-prim-hover text-white"
                icon={PlusCircleIcon}
              >
                {t('saveChanges')}
              </Button>
            </form>
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
                        onSubmit={(e) => {
                          e.preventDefault();
                          onChangePassword(e);
                        }}
                      >
                        <div className="relative w-full mb-3">
                          <label
                            className="block text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="newPassword"
                          >
                            {t('newPass')}
                          </label>
                          <TextInput
                            id="newPassword"
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.currentTarget.value)}
                            placeholder={t('newPass')}
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="block text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="confirmPassword"
                          >
                            {t('confirmPass')}
                          </label>
                          <TextInput
                            id="confirmPassword"
                            type="password"
                            value={confirmPass}
                            onChange={(e) =>
                              setConfirmPass(e.currentTarget.value)
                            }
                            placeholder={t('confirmPass')}
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                        <div className="mt-16 flex justify-end space-x-2">
                          <Button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => setChangePassword(false)}
                          >
                            Cancel
                          </Button>
                          <Button
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
