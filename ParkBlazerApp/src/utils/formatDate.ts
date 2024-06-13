// utils/formatDate.ts
import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const formattedDate = format(date, 'yyyy-MM-dd', { locale: enUS });
  const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: enUS });
  return `${relativeTime}`;
};
