import { useState } from "react";
import {
  useEditAccessMutation,
  useFindAllQuery,
  useRunProcessMutation,
} from "@/src/modules/process/process";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import LoadData from "./upload";
import { ShowMessage } from "../ShowMessage";
import { ViewDag } from "../Dag/ViewDag";
import Router from "next/router";


export default function Dag() {
  const [editAccess] = useEditAccessMutation();
  const [isRuning, setRuning] = useState(false);
  const [isEditing, setEditing] = useState(false);



  return (
    <>
      Test
    </>
  );
}
