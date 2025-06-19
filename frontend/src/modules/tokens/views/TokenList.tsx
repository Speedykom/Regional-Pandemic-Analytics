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
import {
  PlusIcon,
  TrashIcon,
  KeyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useGetTokensQuery, useDeleteTokenMutation } from '../tokens';
import { Token } from '../interface';
import CreateTokenModal from './CreateTokenModal';
import TokenDetailsModal from './TokenDetailsModal';
import TokenListSkeleton from './TokenListSkeleton';

export const TokenList = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: tokensData, isLoading } = useGetTokensQuery({
    page: currentPage,
    limit: pageSize,
  });
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            icon={PlusIcon}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t('tokens.createNewToken')}
          </Button>
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
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          icon={PlusIcon}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('tokens.createNewToken')}
        </Button>
      </div>

      <Card className="overflow-hidden shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <Title className="text-lg font-semibold text-gray-900">
              {t('tokens.activeTokens')}
            </Title>
            {tokensData && (
              <Text className="text-sm text-gray-500">
                {t('common.pagination.showing', {
                  from: (tokensData.page - 1) * tokensData.limit + 1,
                  to: Math.min(
                    tokensData.page * tokensData.limit,
                    tokensData.count
                  ),
                  total: tokensData.count,
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
                  {t('tokens.expires')}
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
                  key={token.id}
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
                          {token.name}
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {t('common.id')}: {token.id}
                        </Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex -space-x-1">
                        {token.datasets.slice(0, 3).map((dataset) => (
                          <div
                            key={dataset.id}
                            className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center"
                            title={dataset.name}
                          >
                            <Text className="text-xs font-medium text-blue-600">
                              {dataset.name.charAt(0)}
                            </Text>
                          </div>
                        ))}
                        {token.datasets.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <Text className="text-xs font-medium text-gray-600">
                              +{token.datasets.length - 3}
                            </Text>
                          </div>
                        )}
                      </div>
                      <Text className="text-sm text-gray-600 ml-2">
                        {t('tokens.datasetCount', {
                          count: token.datasets.length,
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
                    <div className="text-sm text-gray-900">
                      {token.expires_at
                        ? formatDate(token.expires_at)
                        : t('tokens.never')}
                    </div>
                    {token.expires_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(token.expires_at) > new Date() ? (
                          <span className="text-green-600">
                            {t('tokens.active')}
                          </span>
                        ) : (
                          <span className="text-red-600">
                            {t('tokens.expired')}
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <Badge
                        color={token.is_active ? 'green' : 'red'}
                        size="sm"
                        className="font-medium"
                      >
                        {token.is_active
                          ? t('tokens.active')
                          : t('tokens.inactive')}
                      </Badge>
                    </div>
                    {token.last_used && (
                      <div className="text-xs text-gray-500 mt-1">
                        {t('tokens.lastUsed')}: {formatDate(token.last_used)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleViewDetails(token)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
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
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200"
                      >
                        {t('delete')}
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

        {/* Pagination Controls */}
        {tokensData && tokensData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Text className="text-sm font-medium text-gray-700">
                  {t('common.pagination.pageOf', {
                    current: tokensData.page,
                    total: tokensData.totalPages,
                  })}
                </Text>
                <Text className="text-xs text-gray-500">
                  (
                  {t('common.pagination.totalItems', {
                    count: tokensData.count,
                  })}
                  )
                </Text>
              </div>
              <div className="flex items-center space-x-1">
                {/* First Page Button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={!tokensData.hasPrev}
                  className={`
                    inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      tokensData.hasPrev
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }
                  `}
                  title={t('common.pagination.firstPage')}
                >
                  <ChevronDoubleLeftIcon className="h-4 w-4 mr-1" />
                  {t('common.pagination.first')}
                </button>

                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!tokensData.hasPrev}
                  className={`
                    inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      tokensData.hasPrev
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }
                  `}
                  title={t('common.pagination.previousPage')}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  {t('common.pagination.previous')}
                </button>

                {/* Page numbers with improved styling */}
                <div className="flex items-center space-x-1 mx-2">
                  {Array.from(
                    { length: Math.min(5, tokensData.totalPages) },
                    (_, i) => {
                      const startPage = Math.max(1, tokensData.page - 2);
                      const pageNum = startPage + i;
                      if (pageNum > tokensData.totalPages) return null;

                      const isCurrentPage = pageNum === tokensData.page;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`
                            inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200
                            ${
                              isCurrentPage
                                ? 'bg-blue-600 text-white ring-2 ring-blue-200 hover:bg-blue-700'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                            }
                          `}
                          title={t('common.pagination.goToPage', {
                            page: pageNum,
                          })}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!tokensData.hasNext}
                  className={`
                    inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      tokensData.hasNext
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }
                  `}
                  title={t('common.pagination.nextPage')}
                >
                  {t('common.pagination.next')}
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>

                {/* Last Page Button */}
                <button
                  onClick={() => handlePageChange(tokensData.totalPages)}
                  disabled={!tokensData.hasNext}
                  className={`
                    inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      tokensData.hasNext
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                    }
                  `}
                  title={t('common.pagination.lastPage')}
                >
                  {t('common.pagination.last')}
                  <ChevronDoubleRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
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
