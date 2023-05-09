import { Card, Metric, Text } from '@tremor/react';

interface IProp {
  title: string;
  count: string;
}

export default function MetricsCards(props: IProp) {
  return (
    <Card
      className="max-w-xs mx-auto"
      decoration="top"
      decorationColor="indigo"
    >
      <Text>{props.title}</Text>
      <Metric>{props.count}</Metric>
    </Card>
  );
}
