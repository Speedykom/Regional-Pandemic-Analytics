import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import Dag from "@/components/TABS/Dag";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import {
  ClockIcon,
  FingerPrintIcon,
  AdjustmentsHorizontalIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { TextInput } from "@tremor/react";
import { useForm } from "react-hook-form";
import { ShowMessage } from "@/components/ShowMessage";
import { useCreateProcessMutation } from "@/src/modules/process/process";
import { AddProcess } from "@/src/modules/process/views/add";

type FormValues = {
  dagName: string;
  dagID: string;
  dagPath: string;
  scheduleInterval: string;
  parquetPath: string;
  dataSource: string;
};

export default function ProcessChains() {
  const [addProcess, setProcess] = useState(false);

  const closeAdd = () => {
    setProcess(false);
  }

  const openAdd = () => {
    setProcess(true);
  };
  
  return (
    <DashboardFrame title="List(s) of Process Chains">
      <button
        onClick={() => openAdd()}
        className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
      >
        Add Process Chain
      </button>
      <Dag/>
      <AddProcess onClose={closeAdd} state={addProcess} />
    </DashboardFrame>
  );
}
