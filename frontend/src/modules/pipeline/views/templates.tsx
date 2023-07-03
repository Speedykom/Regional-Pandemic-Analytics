import React, { useState } from "react";
import { Button, Modal, Card, Col, Row } from "antd";
import { useTemplatesQuery } from "../pipeline";

type Props = {
  state: boolean;
  onSelect: (value: any) => void;
};

const TemplateModal = ({ state, onSelect }: Props) => {
  const { data: res } = useTemplatesQuery();

  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const handleOk = () => {
    // only continue if the select exist
    if (selected != null) {
      onSelect(selected); // return the select template to the process chain
      setOpen(false);
      setSelected(null); // clear the state and ready for incoming data
    }
  };

  const handleCancel = () => {
    setOpen(false);
    onSelect(false); // send false to the parent to close the modal
  };

  const handleCardClick = (templateObject: any) => {
    setSelected(templateObject); // this keep track of the select only in this component to show it as active
  };

  return (
    <>
      <Modal
        open={state}
        title="Hop Template"
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
        <div className="border-t border-b">
          <p className="bg-yellow-200 px-3 py-2 rounded-md mt-3 text-gray-500">Note: select your template you want to create from and press continue</p>
          <Row gutter={[16, 16]} className="my-3">
            {res?.data?.map((data: any, index: number) => (
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
                  <p>{data?.name}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default TemplateModal;
