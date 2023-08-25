import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
} from '@tremor/react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MediaQuery from 'react-responsive';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Role } from '../interface';
import { useGetRolesQuery, useUpdateRoleMutation } from '../role';

export const RoleList = () => {
  const { data, refetch } = useGetRolesQuery();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [roleData, setRoleData] = useState<any>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (role: Role) => {
    role.id = id;
    updateRole(role)
      .then((res: any) => {
        toast.success(res?.data?.message, {
          position: 'top-right',
        });
        toast.success(res?.data?.message, {
          position: 'top-right',
        });
        setOpen(false);
        refetch();
        reset();
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message, {
          position: 'top-right',
        });
      });
  };

  return (
    <div className="">
      <nav className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-3xl">App Roles</h2>
          <p className="my-2 text-gray-600">
            View and manage settings related to app roles.
          </p>
        </div>
      </nav>
      <div>
        <Card className="bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Role Name</TableHeaderCell>
                <MediaQuery minWidth={1090}>
                  <TableHeaderCell className="">Description</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1420}>
                  <TableHeaderCell className="">Composite</TableHeaderCell>
                </MediaQuery>
                <MediaQuery minWidth={1620}>
                  <TableHeaderCell className="">Client Role</TableHeaderCell>
                </MediaQuery>
                <TableHeaderCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {(data || []).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Text className="font-sans">{item.name}</Text>
                  </TableCell>
                  <MediaQuery minWidth={1090}>
                    <TableCell className="">
                      <Text>{item.description}</Text>
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1420}>
                    <TableCell className="">
                      {item.composite ? (
                        <Badge
                          className="flex items-center space-x-1"
                          icon={CheckIcon}
                          color="indigo"
                        >
                          True
                        </Badge>
                      ) : (
                        <Badge icon={XMarkIcon} color="neutral">
                          False
                        </Badge>
                      )}{' '}
                    </TableCell>
                  </MediaQuery>
                  <MediaQuery minWidth={1620}>
                    <TableCell className="">
                      {item.clientRole ? (
                        <Badge
                          className="flex items-center space-x-1"
                          color="green"
                          icon={CheckIcon}
                        >
                          True
                        </Badge>
                      ) : (
                        <Badge color="red" icon={XMarkIcon}>
                          False
                        </Badge>
                      )}{' '}
                    </TableCell>
                  </MediaQuery>
                  <TableCell>
                    <div className="flex space-x-2 justify-end">
                      <Button
                        onClick={() => {
                          setId(item.name);
                          setRoleData(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
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
                    Update Role
                  </Dialog.Title>
                  <div className="mt-5 flex-auto px-4 py-10 pt-0">
                    <form
                      onSubmit={handleSubmit((data: any) => onSubmit(data))}
                    >
                      <div className="relative w-full mb-3">
                        <label
                          className="block text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="name"
                        >
                          Role Name
                        </label>
                        <TextInput
                          defaultValue={roleData?.name}
                          {...register('name', {
                            required: true,
                          })}
                          placeholder="John"
                          type="text"
                          className="bg-white"
                        />
                        {errors.name && (
                          <span className="text-sm text-red-600">
                            role name is required
                          </span>
                        )}
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="descriptiond"
                        >
                          Description
                        </label>
                        <TextInput
                          defaultValue={roleData?.description}
                          {...register('description', {
                            required: true,
                          })}
                          placeholder="John"
                          type="text"
                          className="bg-white"
                        />
                        {errors.description && (
                          <span className="text-sm text-red-600">
                            provide role description
                          </span>
                        )}
                      </div>
                      <div className="mt-16 flex justify-end space-x-2">
                        <Button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            reset(['name', 'description']);
                            setOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          loading={isLoading}
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-prim px-4 py-2 text-sm font-medium text-white hover:bg-prim-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        >
                          Save Changes
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
  );
};
