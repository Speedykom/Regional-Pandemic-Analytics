import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const ShowMessage = (type: NotificationType, message: string) => {
  notification[type]({
    message: "RePAN",
    description: message
  });
};