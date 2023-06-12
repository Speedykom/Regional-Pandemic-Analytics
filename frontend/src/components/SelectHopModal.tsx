import React, { useState } from "react";
import { Button, Modal, Card, Col, Row } from "antd";

type Props = {
  openModal: boolean;
  parentCallback: (value: any) => void;
  hopData: Array<any>;
};

const SelectHop = ({ openModal, parentCallback, hopData }: Props) => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const handleOk = () => {
    // only continue if the select exist
    if (selected != null) {
      parentCallback(selected); // return the select template to the process chain
      setOpen(false);
      setSelected(null); // clear the state and ready for incoming data
    }
  };

  const handleCancel = () => {
    setOpen(false);
    parentCallback(false); // send false to the parent to close the modal
  };

  const handleCardClick = (templateObject: any) => {
    setSelected(templateObject); // this keep track of the select only in this component to show it as active
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
          {hopData?.map((data: any, index: number) => (
            <Col key={index} span={8}>
              <Card
                title={data?.name}
                bordered={true}
                headStyle={{ color: "#16a34a" }}
                hoverable
                size="small"
                onClick={() => handleCardClick(data)}
                className={`border-2 ${
                  selected?.name === data?.name
                    ? `border-green-800`
                    : `border-gray-300 hover:border-green-800`
                } cursor-pointer`}
              >
                description...
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
};

export default SelectHop;
