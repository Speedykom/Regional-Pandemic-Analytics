import React, { useState } from "react";
import { Button, Modal, Card, Col, Row } from "antd";

const SelectHop = ({ openModal, parentCallback, hopData }: any) => {
  const [open, setOpen] = useState(true);

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
        title="Select an hop template to continue"
        width={800}
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
        <Row gutter={[16, 16]} className="my-5">
          <Col span={8}>
            <Card
              title="Card title"
              bordered={true}
              headStyle={{ color: "#16a34a" }}
              hoverable
              size="small"
              className="border-2 border-gray-300 hover:border-green-800 cursor-pointer"
            >
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Card title"
              bordered={true}
              headStyle={{ color: "#16a34a" }}
              hoverable
              size="small"
              className="border-2 border-gray-300 hover:border-green-800 cursor-pointer"
            >
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Card title"
              bordered={true}
              headStyle={{ color: "#16a34a" }}
              hoverable
              size="small"
              className="border-2 border-gray-300 hover:border-green-800 cursor-pointer"
            >
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Card title"
              bordered={true}
              headStyle={{ color: "#16a34a" }}
              hoverable
              size="small"
              className="border-2 border-gray-300 hover:border-green-800 cursor-pointer"
            >
              Card content
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Card title"
              bordered={true}
              headStyle={{ color: "#16a34a" }}
              hoverable
              size="small"
              className="border-2 border-gray-300 hover:border-green-800 cursor-pointer"
            >
              Card content
            </Card>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default SelectHop;
