import { ColumnsType } from "antd/es/table";
import { Button } from "antd";
import { useEditAccessMutation, useFindAllQuery } from "./pipeline";
import { useState } from "react";
import { ShowMessage } from "@/common/components/ShowMessage";

const ViewButton = ({ id }: { id: string }) => {
  const [editAccess] = useEditAccessMutation();

  const [loading, setLoading] = useState(false);

  const edit = () => {
    setLoading(true);
    editAccess(id).then((res: any) => {
      if (res.error) {
        ShowMessage("error", res.error.message);
        return;
      }

      window.open("http://localhost:8882", "_blank");
      setLoading(false);
    });
  };

  return (
    <Button
      loading={loading}
      onClick={() => edit()}
      className="dag-btn border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:bg-blue-500 focus:text-white"
    >
      View
    </Button>
  );
};

export const useTemplate = () => {
  const { data: res, isLoading: loading } = useFindAllQuery();

  const rows = res?.data;

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      key: "action",
      render: (pipeline) => (
        <div className="flex space-x-2 justify-end">
          <ViewButton id={pipeline.id} />
        </div>
      ),
    },
  ];

  return { columns, loading, rows: rows };
};
