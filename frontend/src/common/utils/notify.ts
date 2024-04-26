import { useToast } from '../hooks/useToast';

export const OpenNotification = (
  text: any,
  // placement: NotificationPlacement,
  type: any
) => {
  const { toast } = useToast();
  toast({
    title: 'Regional Pandemic',
    description: text,
    variant: type,
    duration: 5000,
  });
};
