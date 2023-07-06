import { ColumnsType } from "antd/es/table";
import { Popconfirm } from "antd";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Action } from "@/common/components/common/action";
import axios from "axios";
import { OpenNotification } from "@/common/utils/notify";
import { useFindAllQuery } from "./template";
import getConfig from 'next/config'
 
const { publicRuntimeConfig } = getConfig()
interface props {
  edit: (id: string, name: string, description: string) => void;
  del: () => void;
}

export const useTemplate = ({ edit, del }: props) => {
  const { data: res, isLoading: loading } = useFindAllQuery();

  const rows = res?.data;
  

  const action = (id: string, name: string, description: string) => {
    const deleteUser = async () => {
      await axios
        .delete(
          `${publicRuntimeConfig.NEXT_PUBLIC_BASE_URL}/api/account/roles/${id}/delete`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          OpenNotification(res.data?.message, "topRight", "success");
        })
        .catch((err) => {
          OpenNotification(
            err.response?.data?.errorMessage,
            "topRight",
            "error"
          );
        });
    };
    
    return (
      <Action>
        <ul>
          <li>
            <button
              onClick={(e) => {
                e.preventDefault();
                edit(id, name, description);
              }}
              className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white"
            >
              <FiEdit className="mt-1" /> <span>Edit</span>
            </button>
          </li>
          <li>
            <Popconfirm
              placement="left"
              title={"Delete User"}
              description={"Are you sure you want to delete this user"}
              onConfirm={deleteUser}
              okText="Yes"
              cancelText="No"
            >
              <button className="flex space-x-2 w-full py-1 px-3 hover:bg-orange-600 hover:text-white">
                <FiTrash className="mt-1" /> <span>Delete</span>
              </button>
            </Popconfirm>
          </li>
        </ul>
      </Action>
    );
  };

  const columns: ColumnsType<any> = [
    {
      // fixed: "left",
      title: "Template Name",
      key: "name",
      dataIndex: "name",
      ellipsis: true,
    },
  ];

  return { columns, loading, rows: rows };
};
