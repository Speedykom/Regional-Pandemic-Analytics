import { Popover } from "antd";
import { ReactNode } from "react";
import { FiMoreVertical } from "react-icons/fi";

interface prop {
    children: ReactNode;
}

export const Action = ({ children }: prop) => {
  return (
    <Popover content={children} trigger="click" placement="left">
      <button>
        <FiMoreVertical className="text-xl" />
      </button>
    </Popover>
  );
};
