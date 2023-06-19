import { theme } from "antd";
import { useState } from "react";

export const EditDruidProcess = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Orchestration",
      content: "First-content",
    },
    {
      title: "Integration",
      content: "Second-content",
    },
    {
      title: "Data Source",
      content: "Last-content",
    },
    {
      title: "Analytics",
      content: "Last-content",
    },
  ];

  const items = steps.map((item) => ({ ...item, key: item.title }));

  return (
    <div className="flex items-center justify-center h-96">
      <p>Druid Integration</p>
    </div>
  );
};
