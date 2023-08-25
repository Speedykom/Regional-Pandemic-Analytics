import { notification } from 'antd';
import {
  NotificationPlacement,
  IconType,
} from 'antd/es/notification/interface';

export const OpenNotification = (
  text: string,
  placement: NotificationPlacement,
  type: IconType
) => {
  notification[type]({
    message: 'Regional Pandemic',
    description: text,
    placement,
    duration: 5,
  });
};
