import { IGADTable } from "@/common/components/common/table";
import { DeleteColumnOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, message, Upload } from "antd";
import { useTemplate } from "../hooks";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import TemplateModal from "./templates";
import { AddPipeline } from "./add";

enum OPERATION_TYPES {
  CREATE,
  UPDATE,
  NONE,
}

export const MyPipelineList = () => {
  const [temp, setTemp] = useState<boolean>(false);
  const [template, setTemplate] = useState<any>();
  const [drawer, setDrawer] = useState<boolean>(false);

  const { columns, rows, loading } = useTemplate();

  const close = () => {
    setDrawer(false);
    setTemplate(null);
  };

  const open = () => {
    setDrawer(true);
  };

  const onSelect = (res: any) => {
    if (res) open();
    setTemplate(res);
    setTemp(false);
  };

  // @ts-ignore
  return (
    <div className="">
      <nav>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl">My Pipeline</h2>
            <p className="my-2 text-gray-600">Create your hop pipeline</p>
          </div>
          <div>
            <Button type="primary" size="large" onClick={() => setTemp(true)}>
              Create Pipeline
            </Button>
          </div>
        </div>
      </nav>
      <section className="mt-5">
        <div className="py-2">
          <IGADTable
            key={"id"}
            loading={loading}
            rows={rows}
            columns={columns}
          />
        </div>
      </section>
      <TemplateModal state={temp} onSelect={onSelect} />
      <AddPipeline state={drawer} template={template} onClose={close} />
    </div>
  );
};
