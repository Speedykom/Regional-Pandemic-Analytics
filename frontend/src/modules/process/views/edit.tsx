import { AppDrawer } from "@/common/components/AppDrawer";
import { ShowMessage } from "@/common/components/ShowMessage";
import { schedule_intervals } from "@/common/utils/processs";
import {
  useCreateProcessMutation,
  useFindOneQuery,
} from "@/modules/process/process";
import { Button, Form, Input, Select, Steps, message, theme } from "antd";
import { useState } from "react";
import { EditAirflowProcess } from "./airflow";
import { EditHopProcess } from "./hop";
import { EditDruidProcess } from "./druid";
import { EditSupersetProcess } from "./superset";
import Router, { useRouter } from "next/router";

export const EditProcess = () => {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const id = router.query?.id || "";

  const { data: process, isLoading: loading } = useFindOneQuery(`${id}`);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const back = () => {
    Router.back();
  };

  const steps = [
    {
      title: "Orchestration",
    },
    {
      title: "Integration"
    },
    {
      title: "Data Source"
    },
    {
      title: "Analytics"
    },
  ];

  const viewState = () => {
    switch (current) {
      case 0:
        return <EditAirflowProcess process={process?.dag} />;
      case 1:
        return <EditHopProcess />;
      case 2:
        return <EditDruidProcess />;
      case 3:
        return <EditSupersetProcess />;
    }
  };

  const items = steps.map((item) => ({ ...item, key: item.title }));

  return (
    <div className="mt-2 bg-white rounded-md border p-5">
      <div className="border-b pb-5 pt-5">
        <Steps progressDot current={current} items={items} />
      </div>
      <div className="p-5 w-full">{viewState()}</div>
      <div className="border-t pt-5">
        {current > 0 && (
          <Button
            size="large"
            style={{ margin: "0 8px" }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
        {current == 0 && (
          <Button
            size="large"
            style={{ margin: "0 8px" }}
            onClick={() => back()}
          >
            Back
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button size="large" type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button size="large" onClick={() => back()}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};
