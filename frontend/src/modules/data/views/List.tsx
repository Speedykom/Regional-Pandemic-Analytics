import {
  Badge,
  Button,
  Card,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Title,
} from '@tremor/react';
import React from 'react';
import { LinkIcon } from '@heroicons/react/20/solid';
import getConfig from 'next/config';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/auth';
import { Data } from '../interface';
import { useGetUploadedFilesQuery } from '../data';

const { publicRuntimeConfig } = getConfig();

export default function DataList() {
  const user = useSelector(selectCurrentUser);
  const { data } = useGetUploadedFilesQuery(user?.email || '');
  const file_server = publicRuntimeConfig.NEXT_PUBLIC_MINIO_URL;

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Total Upload(s)</Title>
        <Badge color="gray">{(data || [])?.length}</Badge>
      </Flex>
      <Text className="mt-2">Files uploaded to minio</Text>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>File Name</TableHeaderCell>
            <TableHeaderCell>File Type</TableHeaderCell>
            <TableHeaderCell>Link</TableHeaderCell>
            <TableHeaderCell>Uploaded by</TableHeaderCell>
            <TableHeaderCell>Date Uploaded</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((item: Data, index: number) => (
            <TableRow key={index}>
              <TableCell>{item?.file_name}</TableCell>
              <TableCell>{item?.file_type}</TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant="secondary"
                  color="gray"
                  icon={LinkIcon}
                  onClick={() => {
                    window.open(`${file_server}${item?.file}`, '_blank');
                  }}
                >
                  View
                </Button>
              </TableCell>
              <TableCell>{item?.username}</TableCell>
              <TableCell>{item?.date_added}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
