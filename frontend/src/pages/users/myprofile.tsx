import Layout from '@/common/components/Dashboard/Layout';
import { countries } from '@/common/utils/countries';
import { useTranslation } from 'react-i18next';
import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  NumberInput,
  SearchSelect,
  SearchSelectItem,
  TextInput,
} from '@tremor/react';
import { toast } from 'react-toastify';
import { useGetUserQuery } from '@/modules/user/user';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { selectCurrentUser } from '@/modules/auth/auth';
import { useSelector } from 'react-redux';
import { useModifyUserMutation } from '@/modules/user/user';

export const ProfileSettings = () => {
  const [changePassword, setChangePassword] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const { t } = useTranslation();

  const myId: any = currentUser?.id;
  const { data } = useGetUserQuery(myId);
  const [country, setCountry] = useState(currentUser?.country);
  const [gender, setGender] = useState(currentUser?.gender);
  const [firstName, setFirstName] = useState(currentUser?.given_name || '');
  const [lastName, setLastName] = useState(currentUser?.family_name || '');
  const [phone, setPhone] = useState(currentUser?.phone);
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

  const [newPass, setNewPass] = useState<string>('');
  const [modifyUserMutation] = useModifyUserMutation();
  const {
    formState: { errors },
  } = useForm();

  const onChange = (e?: string) => {
    setNewPass(String(e));
  };

  const triggerPasswordChange = () => {
    setChangePassword(!changePassword);
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
      toast.info('No changes made to the profile.', { position: 'top-right' });
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
      toast.success('Profile updated successfully', { position: 'top-right' });
    } catch (error) {
      toast.error('An error occurred while updating the profile', {
        position: 'top-right',
      });
    }
  };

  return (
    <div className="my-5 w-full lg:w-8/12 px-4 mx-auto">
      <div className="md:flex no-wrap">
        {/* Left Side */}
        <div className="w-full md:w-2/3">
          {/* Profile Card */}
          <Card className="bg-white mb-8">
            <form onSubmit={handleSubmit(saveChanges)}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Enter your first name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    placeholder="Enter your last name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter phone number"
                  />
                )}
              />

              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    {...field}
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

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <SearchSelect
                    {...field}
                    onValueChange={field.onChange}
                    className="bg-white"
                  >
                    {['Male', 'Female'].map((gender, index) => (
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
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="lastName">{t('lastName2')}</label>
                  <TextInput
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  />
                </div>
                <div className="md:col-span-5">
                  <label htmlFor="phone">{t('phoneNumber')}</label>
                  <NumberInput
                    enableStepper={false}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="md:col-span-3">
                  <label htmlFor="country">{t('country2')}</label>
                  <SearchSelect
                    onValueChange={(e) => setCountry(e)}
                    className="bg-white"
                    value={country} // This should be the string you get from currentUser?.country
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
                <div className="md:col-span-3">
                  <label htmlFor="gender">{t('gender')}</label>
                  <SearchSelect
                    onValueChange={(e) => {
                      setGender(e);
                    }}
                    className="bg-white"
                    value={gender}
                  >
                    {['Male', 'Female'].map((item, index) => (
                      <SearchSelectItem
                        className="bg-white cursor-pointer"
                        key={index}
                        value={item}
                      >
                        {item}
                      </SearchSelectItem>
                    ))}
                  </SearchSelect>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Divider className="border border-gray-200" />
              <div>
                <div className="flex space-x-2 items-end justify-end">
                  <Button
                    onClick={saveChanges}
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
