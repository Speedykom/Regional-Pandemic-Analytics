import { theme } from "antd";
import { useState } from "react";

export const EditHopProcess = () => {
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
    <div>
      <iframe style={{height: "700px", width: "100%"}} src={'/hop/ui'} />
    </div>
  );
};
