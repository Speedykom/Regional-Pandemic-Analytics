import { Card, Flex, SelectBox, SelectBoxItem } from "@tremor/react";
import { useState, useEffect } from "react";
import DagList from "@/components/Dag/DagList";
import { DagType } from "./interface";

export default function Dag() {
  const [data, setData] = useState<DagType[]>([
    {
      id: 1,
      isActive: true,
      dagId: 1,
      description: "Sample covid dag",
    },
    {
      id: 3,
      isActive: true,
      dagId: 3,
      description: "Sample ebola dag",
    },
    {
      id: 4,
      isActive: false,
      dagId: 4,
      description: "Sample anthrax dag",
    },
    {
      id: 2,
      isActive: true,
      dagId: 2,
      description: "Sample malaria dag",
    },
    {
      id: 5,
      isActive: false,
      dagId: 5,
      description: "Sample typhoid dag",
    },
  ]);
  // const { data, error } = useSWR(
  //   [url, username, password],
  //   ([url, username, password]) => axiosFetcher(url, username, password)
  // );

  return (
    <>
      <Card className="mt-6">
        <h1 className="text-xl mb-3">SpeedyKom Process Chain(s)</h1>
        <Flex flexDirection="col">
          {data ? (
            data?.map((dag: object | any) => (
              <DagList key={dag?.id} dag={dag} />
            ))
          ) : (
            <div className="mt-3 flex justify-center items-center">
              <h4 className="text-xl text-center">No Dag(s) to display.</h4>
            </div>
          )}
        </Flex>
      </Card>
      <div className="mt-3 flex justify-center items-center">
        <div>
          <SelectBox defaultValue="1">
            <SelectBoxItem value="1">1</SelectBoxItem>
            <SelectBoxItem value="2">2</SelectBoxItem>
            <SelectBoxItem value="3">3</SelectBoxItem>
            <SelectBoxItem value="4">4</SelectBoxItem>
            <SelectBoxItem value="5">5</SelectBoxItem>
          </SelectBox>
        </div>
        <div className="pl-2">
          <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white">
            Load More
          </button>
        </div>
      </div>
    </>
  );
}
