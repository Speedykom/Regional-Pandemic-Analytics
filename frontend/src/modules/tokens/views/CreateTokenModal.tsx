import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button, Text, TextInput, Card, Flex } from '@tremor/react';
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useGetDatasetsQuery, useCreateTokenMutation } from '../tokens';

interface CreateTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TokenCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  tokenName: string;
}

const TokenCreatedModal: React.FC<TokenCreatedModalProps> = ({
  isOpen,
  onClose,
  token,
  tokenName,
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success(t('tokens.copiedToClipboard'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {t('tokens.tokenCreatedSuccessfully')}
                </Dialog.Title>

                <div className="mb-4">
                  <Text className="text-sm text-gray-600 mb-2">
                    {t('tokens.tokenCreatedMessage', { tokenName })}
                  </Text>
                </div>

                <Card className="bg-gray-50 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono text-gray-800 break-all flex-1 mr-2">
                      {token}
                    </code>
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={copied ? CheckIcon : ClipboardDocumentIcon}
                      onClick={copyToClipboard}
                      color={copied ? 'green' : 'gray'}
                    >
                      {copied ? t('tokens.copied') : t('tokens.copy')}
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleClose}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {t('tokens.done')}
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

const CreateTokenModal: React.FC<CreateTokenModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { data: datasetsData, isLoading: isDatasetsLoading } =
    useGetDatasetsQuery();
  const [createToken, { isLoading: isCreating }] = useCreateTokenMutation();

  const [tokenName, setTokenName] = useState('');
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [createdToken, setCreatedToken] = useState<string>('');
  const [createdTokenName, setCreatedTokenName] = useState<string>('');
  const [isTokenCreatedModalOpen, setIsTokenCreatedModalOpen] = useState(false);

  const handleClose = () => {
    setTokenName('');
    setSelectedDatasets([]);
    setCreatedToken('');
    setCreatedTokenName('');
    onClose();
  };

  const toggleDatasetSelection = (datasetId: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId)
        ? prev.filter((id) => id !== datasetId)
        : [...prev, datasetId]
    );
  };

  const handleCreateToken = async () => {
    if (!tokenName.trim()) {
      toast.error(t('tokens.pleaseEnterTokenName'));
      return;
    }

    if (selectedDatasets.length === 0) {
      toast.error(t('tokens.pleaseSelectDataset'));
      return;
    }

    try {
      const response = await createToken({
        description: tokenName.trim(),
        allowed_objects: selectedDatasets,
      }).unwrap();

      // Store the token name before clearing the state
      const currentTokenName = tokenName.trim();
      setCreatedToken(response.token);
      setCreatedTokenName(currentTokenName);
      setIsTokenCreatedModalOpen(true);

      // Clear the form state
      setTokenName('');
      setSelectedDatasets([]);
      onClose();

      toast.success(t('tokens.tokenCreatedSuccess'));
    } catch (error) {
      toast.error(t('tokens.failedToCreateToken'));
    }
  };

  if (isDatasetsLoading) {
    return null;
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
                      {t('tokens.createNewToken')}
                    </Dialog.Title>
                    <Button
                      variant="light"
                      icon={XMarkIcon}
                      onClick={handleClose}
                      size="xs"
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md p-1"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('tokens.tokenName')} *
                      </label>
                      <TextInput
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        placeholder={t('tokens.tokenNamePlaceholder')}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('tokens.selectDatasets')} * (
                        {selectedDatasets.length} {t('tokens.selected')})
                      </label>
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        {datasetsData?.datasets?.map(
                          (dataset: string, index: number) => (
                            <div
                              key={`${dataset}-${index}`}
                              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                selectedDatasets.includes(dataset)
                                  ? 'bg-blue-50'
                                  : ''
                              }`}
                              onClick={() => toggleDatasetSelection(dataset)}
                            >
                              <Flex className="items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedDatasets.includes(dataset)}
                                  onChange={() =>
                                    toggleDatasetSelection(dataset)
                                  }
                                  className="mr-3"
                                />
                                <div className="flex-1">
                                  <Text className="font-medium">{dataset}</Text>
                                  <Text className="text-xs text-gray-500">
                                    {t('tokens.datasetFile')}: {dataset}.parquet
                                  </Text>
                                </div>
                              </Flex>
                            </div>
                          )
                        )}
                      </div>

                      {(!datasetsData?.datasets ||
                        datasetsData.datasets.length === 0) && (
                        <div className="text-center py-8">
                          <Text className="text-gray-500">
                            {t('tokens.noDatasetsAvailable')}
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-200"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      onClick={handleCreateToken}
                      loading={isCreating}
                      disabled={
                        !tokenName.trim() || selectedDatasets.length === 0
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t('tokens.createToken')}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <TokenCreatedModal
        isOpen={isTokenCreatedModalOpen}
        onClose={() => setIsTokenCreatedModalOpen(false)}
        token={createdToken}
        tokenName={createdTokenName}
      />
    </>
  );
};

export default CreateTokenModal;
