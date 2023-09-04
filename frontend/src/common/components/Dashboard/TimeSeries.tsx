import { Card, Title, LineChart } from '@tremor/react';

const chartdata = [
  {
    month: 'January',
    'Ebola Confirmed Cases': 30,
  },
  {
    month: 'February',
    'Ebola Confirmed Cases': 21,
  },
  {
    month: 'March',
    'Ebola Confirmed Cases': 19,
  },
  {
    month: 'April',
    'Ebola Confirmed Cases': 50,
  },
  {
    month: 'May',
    'Ebola Confirmed Cases': 62,
  },
];

export default function TimeSeries() {
  return (
    <Card>
      <Title>Ebola Outbreak (2023)</Title>
      <LineChart
        className="mt-6"
        data={chartdata}
        index="month"
        categories={['Ebola Confirmed Cases']}
        colors={['blue']}
        yAxisWidth={40}
      />
    </Card>
  );
}
