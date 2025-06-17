import React, { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Flex,
} from '@tremor/react';
import { PlusIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useGetTokensQuery, useDeleteTokenMutation } from '../tokens';
import { Token } from '../interface';
import CreateTokenModal from './CreateTokenModal';
import TokenDetailsModal from './TokenDetailsModal';

export const TokenList = () => {
  const { t } = useTranslation();
  const { data: tokensData, isLoading } = useGetTokensQuery();
  const [deleteToken, { isLoading: isDeleting }] = useDeleteTokenMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleDeleteToken = async (tokenId: string) => {
    try {
      await deleteToken(tokenId).unwrap();
      toast.success(t('tokens.deleteSuccess'));
    } catch (error) {
      toast.error(t('tokens.deleteError'));
    }
  };

  const handleViewDetails = (token: Token) => {
    setSelectedToken(token);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Text>Loading...</Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title className="text-3xl font-bold">
            {t('tokens.tokenManagement')}
          </Title>
          <Text className="mt-2 text-gray-600">
            Generate and manage access tokens for secure dataset sharing
          </Text>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          icon={PlusIcon}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('tokens.createNewToken')}
        </Button>
      </div>

      <Card>
        <Title>{t('tokens.active')} Tokens</Title>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>{t('name')}</TableHeaderCell>
              <TableHeaderCell>{t('tokens.datasets')}</TableHeaderCell>
              <TableHeaderCell>{t('tokens.createdAt')}</TableHeaderCell>
              <TableHeaderCell>{t('tokens.expires')}</TableHeaderCell>
              <TableHeaderCell>{t('status')}</TableHeaderCell>
              <TableHeaderCell>{t('tokens.actions')}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokensData?.tokens?.map((token) => (
              <TableRow key={token.id}>
                <TableCell>
                  <Flex className="space-x-2">
                    <KeyIcon className="h-4 w-4 text-gray-500" />
                    <Text>{token.name}</Text>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Text>{token.datasets.length} dataset(s)</Text>
                </TableCell>
                <TableCell>
                  <Text>{formatDate(token.created_at)}</Text>
                </TableCell>
                <TableCell>
                  <Text>
                    {token.expires_at
                      ? formatDate(token.expires_at)
                      : t('tokens.never')}
                  </Text>
                </TableCell>
                <TableCell>
                  <Badge color={token.is_active ? 'green' : 'red'} size="sm">
                    {token.is_active
                      ? t('tokens.active')
                      : t('tokens.inactive')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Flex className="space-x-2">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handleViewDetails(token)}
                    >
                      {t('tokens.viewDetails')}
                    </Button>
                    <Button
                      size="xs"
                      variant="secondary"
                      color="red"
                      icon={TrashIcon}
                      onClick={() => handleDeleteToken(token.id)}
                      loading={isDeleting}
                    >
                      {t('delete')}
                    </Button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {(!tokensData?.tokens || tokensData.tokens.length === 0) && (
          <div className="text-center py-12">
            <KeyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Text className="text-gray-500 mb-4">
              {t('tokens.noTokensFound')}. {t('tokens.createFirstToken')}.
            </Text>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              icon={PlusIcon}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('tokens.createNewToken')}
            </Button>
          </div>
        )}
      </Card>

      <CreateTokenModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TokenDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        token={selectedToken}
      />
    </div>
  );
};
