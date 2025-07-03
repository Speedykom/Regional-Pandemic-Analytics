import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Button, Title, Text, TextInput, Flex } from '@tremor/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDeleteTokenMutation } from '../tokens';

interface DeleteTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteTokenModal: React.FC<DeleteTokenModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const [deleteToken, { isLoading }] = useDeleteTokenMutation();

  const [tokenId, setTokenId] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const handleClose = () => {
    setTokenId('');
    setConfirmationText('');
    onClose();
  };

  const handleDelete = async () => {
    if (!tokenId.trim()) {
      toast.error(t('tokens.tokenIdRequired') || 'Token ID is required');
      return;
    }

    // Accept both "Delete token" (English) and "Supprimer le jeton" (French) for confirmation
    const validConfirmations = ['Delete token', 'Supprimer le jeton'];
    if (!validConfirmations.includes(confirmationText)) {
      toast.error(
        t('tokens.confirmationTextMismatch') ||
          'Please type "Delete token" to confirm'
      );
      return;
    }

    try {
      await deleteToken(tokenId).unwrap();
      toast.success(
        t('tokens.tokenRevokedSuccessfully') || 'Token revoked successfully'
      );
      handleClose();
    } catch (error: any) {
      if (error?.status === 404) {
        toast.error(
          t('tokens.tokenNotFound') ||
            'Token not found or does not belong to you'
        );
      } else {
        toast.error(
          t('tokens.tokenRevocationFailed') || 'Failed to revoke token'
        );
      }
    }
  };

  const validConfirmations = ['Delete token', 'Supprimer le jeton'];
  const isFormValid =
    tokenId.trim() && validConfirmations.includes(confirmationText);

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Title className="text-xl font-semibold text-gray-900">
                    {t('tokens.deleteToken') || 'Delete Token'}
                  </Title>
                  <Button
                    variant="light"
                    size="xs"
                    onClick={handleClose}
                    icon={XMarkIcon}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Text className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tokens.tokenId') || 'Token ID'}
                    </Text>
                    <TextInput
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      placeholder={
                        t('tokens.enterTokenId') ||
                        'Enter the token ID to delete'
                      }
                      className="w-full"
                      disabled={isLoading}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {t('tokens.tokenIdHint') ||
                        'This is the token string that was provided when the token was created'}
                    </Text>
                  </div>

                  <div>
                    <Text className="block text-sm font-medium text-gray-700 mb-2">
                      {t('tokens.confirmationText') || 'Confirmation'}
                    </Text>
                    <TextInput
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder={
                        t('tokens.confirmationPlaceholder') ||
                        'Type "Delete token" or "Supprimer le jeton"'
                      }
                      className="w-full"
                      disabled={isLoading}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {t('tokens.confirmationTextHint') ||
                        'Type "Delete token" exactly to confirm deletion'}
                    </Text>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <Text className="text-sm text-red-700">
                      <strong>{t('common.warning') || 'Warning'}:</strong>{' '}
                      {t('tokens.deleteWarning') ||
                        'This action cannot be undone. The token will be permanently revoked and cannot be used for future API requests.'}
                    </Text>
                  </div>
                </div>

                <Flex className="mt-8 space-x-3">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 hover:bg-blue-200"
                  >
                    {t('common.cancel') || 'Cancel'}
                  </Button>
                  <Button
                    color="red"
                    onClick={handleDelete}
                    disabled={!isFormValid || isLoading}
                    loading={isLoading}
                    className="flex-1"
                  >
                    {t('tokens.deleteToken') || 'Delete Token'}
                  </Button>
                </Flex>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteTokenModal;
