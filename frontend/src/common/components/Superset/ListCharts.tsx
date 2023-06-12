import {
  Card,
  Title,
  Text,
  Flex,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Badge,
  Button,
  Color,
} from "@tremor/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData } from "@/common/utils";

export type TChartData = {
  count: number;
  result: TItem[]; // Updated type to TItem[]
};

export type TItem = {
  [key: string]: string;
  slice_name: string;
  viz_type: string;
  datasource_name_text: string;
  changed_by_name: string;
  changed_on_delta_humanized: string;
  created_by_name: string;
};

const colors: { [key: string]: Color } = {
  draft: "gray",
  published: "emerald",
};

export default function ListCharts({ data }: { data: TChartData }) {
  const router = useRouter();

  const [token, setToken] = useState("");

  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <Card>
      <Flex justifyContent="start" className="space-x-2">
        <Title>Total Charts(s)</Title>
        <Badge color="gray">{data?.count}</Badge>
      </Flex>
      <Text className="mt-2">Created on Apache Superset</Text>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Chart</TableHeaderCell>
            <TableHeaderCell>Visualization Type</TableHeaderCell>
            <TableHeaderCell>Dataset</TableHeaderCell>
            <TableHeaderCell>Modified By</TableHeaderCell>
            <TableHeaderCell>Last Modified</TableHeaderCell>
            <TableHeaderCell>Created By</TableHeaderCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.result?.map((item: TItem, index: number) => (
            <TableRow key={index}>
              <TableCell>{item?.slice_name}</TableCell>
              <TableCell>{item?.viz_type}</TableCell>
              <TableCell>{item?.datasource_name_text}</TableCell>
              <TableCell>{item?.changed_by_name}</TableCell>
              <TableCell>{item?.changed_on_delta_humanized}</TableCell>
              <TableCell>{item?.created_by_name}</TableCell>
              <TableCell>
                <Button size="xs" variant="secondary" color="gray">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
