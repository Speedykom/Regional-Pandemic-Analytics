import { theme } from "antd";
import { useState } from "react";
import { useFindOneQuery } from "../process";
import Router, { useRouter } from "next/router";
import { IGADTable } from "@/common/components/common/table";
import { useProcessDagRuns } from "../hooks";

interface props {
  process: any;
}

export const EditAirflowProcess = ({ process }: props) => {

  const {columns} = useProcessDagRuns();

  return (
    <div>
      <div className="flex flex-wrap w-full py-5">
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Dag Id: </p>
          <p>{process?.dag_id}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Dag Id: </p>
          <p>{process?.data_source_name}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Owners: </p>
          <p>{process?.owners.toString()}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Schedule Interval: </p>
          <p>{process?.schedule_interval.value}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Is Active: </p>
          <p>{process?.is_active ? "Yes" : "No"}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Is Paused: </p>
          <p>{process?.is_paused ? "Yes" : "No"}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Next Dagrun: </p>
          <p>{new Date(process?.next_dagrun).toLocaleString()}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Timetable Description: </p>
          <p>{process?.timetable_description}</p>
        </div>
        <div className="flex space-x-2 w-1/3 mb-8">
          <p className="text-gray-500">Last Parsed Time:</p>
          <p>{new Date(process?.last_parsed_time).toLocaleString()}</p>
        </div>
      </div>
      <IGADTable columns={columns} rows={process?.runs || []} />
    </div>
  );
};
