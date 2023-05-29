import { Drawer } from "antd";
import { ReactNode } from "react";

interface prop {
  onClose: () => void;
  state: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AppDrawer = ({ state, onClose, title, children, footer }: prop) => {
  return (
    <Drawer footer={footer} title={title} width={500} maskClosable={false} open={state} onClose={onClose}>
      {children}
    </Drawer>
  );
};