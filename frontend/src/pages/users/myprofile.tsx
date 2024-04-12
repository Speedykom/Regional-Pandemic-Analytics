import Layout from '@/common/components/Dashboard/Layout';
import { countries } from '@/common/utils/countries';
import { useTranslation } from 'react-i18next';
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
import {
  useGetUserQuery,
  useChangePasswordMutation,
} from '@/modules/user/user';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { selectCurrentUser } from '@/modules/auth/auth';
import { useSelector } from 'react-redux';
import { useModifyUserMutation } from '@/modules/user/user';
import {
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  SignalSlashIcon,
  WifiIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
export const ProfileSettings = () => {
  const [changePassword, setChangePassword] = useState(false);
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const currentUser = useSelector(selectCurrentUser);
  const { t } = useTranslation();
  const [changePasswordMutation] = useChangePasswordMutation();

  const [avatar] = useState(currentUser?.avatar);

  const myId: any = currentUser?.id;
  const { data } = useGetUserQuery(myId);
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
    },
  });

  const [modifyUserMutation] = useModifyUserMutation();

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
      await changePasswordMutation({
        id: currentUser.id,
        newPassword: newPass,
        confirmPassword: confirmPass,
      }).unwrap();
      toast.success(t('passwordChangeSuccess'), { position: 'top-right' });
      setChangePassword(false);
    } catch (error) {
      toast.error(t('passwordChangeError'), { position: 'top-right' });
    }
  };
  useEffect(() => {
    reset({
      firstName: currentUser?.given_name || '',
      lastName: currentUser?.family_name || '',
      phone: currentUser?.phone || '',
      country: currentUser?.country || '',
      gender: currentUser?.gender || '',
    });
  }, [reset, currentUser]);

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
        : currentUser?.given_name || '',
      lastName: dirtyFields.lastName
        ? updatedValues.lastName
        : currentUser?.family_name || '',
      attributes: {
        phone: dirtyFields.phone
          ? updatedValues.phone
          : currentUser?.phone || '',
        gender: dirtyFields.gender
          ? updatedValues.gender
          : currentUser?.gender || '',
        country: dirtyFields.country
          ? updatedValues.country
          : currentUser?.country || '',
        avatar: currentUser?.avatar || '',
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
            <div className="flex ">
              <img
                className="h-32 w-32 rounded-md"
                src={avatar || '/avater.png'}
                alt=""
              />
              <input type="file" style={{ display: 'none' }} />
            </div>
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
                  <NumberInput
                    {...field}
                    id="phone"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder={t('phoneNumber')}
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
                            {t('new')}
                          </label>
                          <TextInput
                            id="newPassword"
                            type="password"
                            value={newPass}
                            onChange={(e) => setNewPass(e.currentTarget.value)}
                            placeholder="new password"
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
                            placeholder="confirm password"
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
