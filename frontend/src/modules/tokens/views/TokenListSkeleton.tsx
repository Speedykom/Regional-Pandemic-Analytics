import React from 'react';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@tremor/react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

interface TokenListSkeletonProps {
  rows?: number;
}

const TokenListSkeleton: React.FC<TokenListSkeletonProps> = ({ rows = 5 }) => {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <Title className="text-lg font-semibold text-gray-900">
            {t('tokens.activeTokens')}
          </Title>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
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
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                } animate-pulse`}
              >
                {/* Name Column */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <KeyIcon className="h-5 w-5 text-gray-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`h-4 bg-gray-200 rounded mb-2 ${
                          index % 3 === 0
                            ? 'w-28'
                            : index % 3 === 1
                            ? 'w-36'
                            : 'w-32'
                        }`}
                      ></div>
                      <div
                        className={`h-3 bg-gray-200 rounded ${
                          index % 2 === 0 ? 'w-20' : 'w-24'
                        }`}
                      ></div>
                    </div>
                  </div>
                </TableCell>

                {/* Datasets Column */}
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                      {index % 3 !== 0 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                      )}
                    </div>
                    <div
                      className={`h-4 bg-gray-200 rounded ml-2 ${
                        index % 2 === 0 ? 'w-16' : 'w-20'
                      }`}
                    ></div>
                  </div>
                </TableCell>

                {/* Created At Column */}
                <TableCell className="px-6 py-4 text-center">
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                </TableCell>

                {/* Expires Column */}
                <TableCell className="px-6 py-4 text-center">
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
                </TableCell>

                {/* Status Column */}
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex justify-center mb-1">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto"></div>
                </TableCell>

                {/* Actions Column */}
                <TableCell className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TokenListSkeleton;
