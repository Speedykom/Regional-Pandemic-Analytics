import {
  Card,
  Metric,
  Text,
  AreaChart,
  BadgeDelta,
  Flex,
  Grid,
} from '@tremor/react';
import { useTranslation } from 'react-i18next';

interface AnalyticsType {
  title: string;
  metric: string;
  metricPrev: string;
  delta: string;
  deltaType:
    | 'moderateIncrease'
    | 'moderateDecrease'
    | 'increase'
    | 'decrease'
    | 'unchanged'
    | undefined;
}

const data = [
  {
    Month: 'Jan 2023',
    'Covid19 - New Confirmed Cases': 2890,
    'Covid19 - New Deaths': 2400,
    'Covid19 - New Recovered': 4938,
  },
  {
    Month: 'Feb 2023',
    'Covid19 - New Confirmed Cases': 1890,
    'Covid19 - New Deaths': 1400,
    'Covid19 - New Recovered': 3938,
  },
  // ...
  {
    Month: 'Jul 2023',
    'Covid19 - New Confirmed Cases': 4890,
    'Covid19 - New Deaths': 3400,
    'Covid19 - New Recovered': 2938,
  },
];

const categories: Array<AnalyticsType> = [
  {
    title: 'Covid19 - New Confirmed Cases',
    metric: '12,699',
    metricPrev: '9,456',
    delta: '34.3%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Covid19 - New Deaths',
    metric: '10,348',
    metricPrev: '8,456',
    delta: '18.1%',
    deltaType: 'moderateIncrease',
  },
  {
    title: 'Covid19 - New Recovered',
    metric: '7000',
    metricPrev: '8,082',
    delta: '12.3%',
    deltaType: 'moderateDecrease',
  },
];

export default function AnalyticsCard() {
  const { t } = useTranslation();
  return (
    <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
      {categories.map((item) => (
        <Card key={item.title}>
          <Flex alignItems="start">
            <Text>{item.title}</Text>
            <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
          </Flex>
          <Flex
            className="space-x-3 truncate"
            justifyContent="start"
            alignItems="baseline"
          >
            <Metric>{item.metric}</Metric>
            <Text>
              {t('from')} {item.metricPrev}
            </Text>
          </Flex>
          <AreaChart
            className="mt-6 h-28"
            data={data}
            index="Month"
            categories={[item.title]}
            colors={['blue']}
            showXAxis
            showGridLines={false}
            startEndOnly
            showYAxis={false}
            showLegend={false}
          />
        </Card>
      ))}
    </Grid>
  );
}
