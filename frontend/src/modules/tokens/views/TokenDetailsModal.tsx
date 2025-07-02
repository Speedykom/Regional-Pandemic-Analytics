import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button, Text, Card, Title, Flex, Badge } from '@tremor/react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Token } from '../interface';

interface TokenDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token | null;
}

const TokenDetailsModal: React.FC<TokenDetailsModalProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const { t } = useTranslation();

  if (!token) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {t('tokens.tokenDetails')}
                  </Dialog.Title>
                  <Button
                    variant="light"
                    icon={XMarkIcon}
                    onClick={onClose}
                    size="xs"
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  />
                </div>

                <div className="space-y-6">
                  <Card>
                    <div className="flex items-center space-x-3 mb-3">
                      <KeyIcon className="h-5 w-5 text-gray-600" />
                      <Title>
                        {token.description || t('tokens.unnamedToken')}
                      </Title>
                      <Badge
                        color={!token.is_revoked ? 'green' : 'red'}
                        size="sm"
                      >
                        {!token.is_revoked
                          ? t('tokens.active')
                          : t('tokens.revoked')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Text className="font-medium text-gray-600">
                          {t('tokens.createdAt')}:
                        </Text>
                        <Text>{formatDate(token.created_at)}</Text>
                      </div>

                      <div>
                        <Text className="font-medium text-gray-600">
                          {t('tokens.userId')}:
                        </Text>
                        <Text>{token.user_id}</Text>
                      </div>
                      <div>
                        <Text className="font-medium text-gray-600">
                          {t('tokens.datasets')}:
                        </Text>
                        <Text>
                          {token.allowed_objects.length}{' '}
                          {t('tokens.datasetCount')}
                        </Text>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <Title className="mb-3">
                      {t('tokens.associatedDatasets')}
                    </Title>
                    <div className="space-y-3">
                      {token.allowed_objects.map((dataset, index) => (
                        <div
                          key={`${dataset}-${index}`}
                          className="p-3 border border-gray-200 rounded-lg"
                        >
                          <Flex className="justify-between items-start">
                            <div>
                              <Text className="font-medium">{dataset}</Text>
                              <Text className="text-xs text-gray-500">
                                {t('tokens.datasetFile')}: {dataset}.parquet
                              </Text>
                            </div>
                          </Flex>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={onClose}
                    variant="secondary"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-200"
                  >
                    {t('tokens.close')}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TokenDetailsModal;
