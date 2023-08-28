import dayjs from 'dayjs';

export const CovertFromTimestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toDateString();
};

export const ToMonthDayYear = (date: string): string => {
  return dayjs(date).format('MMMM DD, YYYY');
};

export const ToMonthDayYearTime = (date: string): string => {
  return dayjs(date).format('MMMM DD, YYYY');
};
