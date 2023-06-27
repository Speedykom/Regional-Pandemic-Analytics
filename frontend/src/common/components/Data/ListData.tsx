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
    Title
} from "@tremor/react";
import React from "react";
import {LinkIcon} from "@heroicons/react/20/solid";

export interface IData {
    id: number;
    username: string;
    file_name: string;
    file_type: string;
    file: string;
    date_added: string;
}

interface ListDataProps {
    data: IData[];
}

export default function ListData({ data }: ListDataProps) {
    const file_server = process.env.NEXT_PUBLIC_MINIO_URL;

    return (
        <Card>
            <Flex justifyContent="start" className="space-x-2">
                <Title>Total Upload(s)</Title>
                <Badge color="gray">{data?.length}</Badge>
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
                    {data?.map((item: IData, index: number) => (
                        <TableRow key={index}>
                            <TableCell>{item?.file_name}</TableCell>
                            <TableCell>{item?.file_type}</TableCell>
                            <TableCell>
                                <Button size="xs" variant="secondary" color="gray" icon={LinkIcon} onClick={() => {window.open(`${file_server}${item?.file}`, "_blank")}}>
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
