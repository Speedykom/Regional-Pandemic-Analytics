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
} from '@tremor/react';
import { PlusIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useGetTokensQuery } from '../tokens';
import { Token } from '../interface';
import CreateTokenModal from './CreateTokenModal';
import TokenDetailsModal from './TokenDetailsModal';
import TokenListSkeleton from './TokenListSkeleton';
import DeleteTokenModal from './DeleteTokenModal';

export const TokenList = () => {
  const { t } = useTranslation();

  const { data: tokensData, isLoading } = useGetTokensQuery();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleViewDetails = (token: Token) => {
    setSelectedToken(token);
    setIsDetailsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title className="text-3xl font-bold">
              {t('tokens.tokenManagement')}
            </Title>
            <Text className="mt-2 text-gray-600">
              {t('tokens.description')}
            </Text>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              color="red"
              icon={TrashIcon}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              {t('tokens.deleteToken') || 'Delete Token'}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              icon={PlusIcon}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('tokens.createNewToken')}
            </Button>
          </div>
        </div>
        <TokenListSkeleton />
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
          <Text className="mt-2 text-gray-600">{t('tokens.description')}</Text>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            color="red"
            icon={TrashIcon}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            {t('tokens.deleteToken') || 'Delete Token'}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            icon={PlusIcon}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t('tokens.createNewToken')}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <Title className="text-lg font-semibold text-gray-900">
              {t('tokens.activeTokens')}
            </Title>
            {tokensData?.tokens && tokensData.tokens.length > 0 && (
              <Text className="text-sm text-gray-500">
                {t('common.pagination.showing', {
                  from: 1,
                  to: tokensData.tokens.length,
                  total: tokensData.tokens.length,
                  items: t('tokens.tokens'),
                })}
              </Text>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableHeaderCell className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {t('name')}
                </TableHeaderCell>
                <TableHeaderCell className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {t('tokens.datasets')}
                </TableHeaderCell>
                <TableHeaderCell className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {t('tokens.createdAt')}
                </TableHeaderCell>
                <TableHeaderCell className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {t('status')}
                </TableHeaderCell>
                <TableHeaderCell className="px-6 py-4 text-center text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {t('tokens.actions')}
                </TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-white divide-y divide-gray-200">
              {tokensData?.tokens?.map((token, index) => (
                <TableRow
                  key={`${token.user_id}-${token.created_at}-${index}`}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <KeyIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Text className="text-sm font-medium text-gray-900 truncate">
                          {token.description || t('tokens.unnamedToken')}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {t('tokens.createdAt')}:{' '}
                          {formatDate(token.created_at)}
                        </Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex -space-x-1">
                        {token.allowed_objects
                          .slice(0, 3)
                          .map((dataset, datasetIndex) => (
                            <div
                              key={`${dataset}-${datasetIndex}`}
                              className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                              title={dataset}
                            >
                              <Text className="text-xs font-medium text-blue-600">
                                {dataset.charAt(0)}
                              </Text>
                            </div>
                          ))}
                        {token.allowed_objects.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <Text className="text-xs font-medium text-gray-600">
                              +{token.allowed_objects.length - 3}
                            </Text>
                          </div>
                        )}
                      </div>
                      <Text className="text-sm text-gray-600 ml-2">
                        {t('tokens.datasetCount', {
                          count: token.allowed_objects.length,
                        })}
                      </Text>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-900">
                      {formatDate(token.created_at)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(token.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Badge
                        color={!token.is_revoked ? 'green' : 'red'}
                        size="sm"
                        className="font-medium"
                      >
                        {!token.is_revoked
                          ? t('tokens.active')
                          : t('tokens.revoked')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleViewDetails(token)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                      >
                        {t('tokens.viewDetails')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {(!tokensData?.tokens || tokensData.tokens.length === 0) && (
          <div className="text-center py-16 bg-white">
            <div className="mx-auto max-w-md">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <KeyIcon className="h-8 w-8 text-gray-400" />
              </div>
              <Title className="text-xl font-semibold text-gray-900 mb-2">
                {t('tokens.noTokensYet')}
              </Title>
              <Text className="text-gray-500 mb-6 leading-relaxed">
                {t('tokens.noTokensFound')}. {t('tokens.createFirstToken')}.
              </Text>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                icon={PlusIcon}
                onClick={() => setIsCreateModalOpen(true)}
              >
                {t('tokens.createNewToken')}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <CreateTokenModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <DeleteTokenModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <TokenDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        token={selectedToken}
      />
    </div>
  );
};
