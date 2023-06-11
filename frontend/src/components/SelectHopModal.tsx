import React, { useState } from "react";
import { Button, Modal } from "antd";

const SelectHop = ({ openModal, parentCallback }: any) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    parentCallback(true); // send true to the parent to continue to the process chain the modal
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    parentCallback(false); // send false to the parent to close the modal
  };

  return (
    <>
      <Modal
        open={openModal}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Continue
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default SelectHop;
