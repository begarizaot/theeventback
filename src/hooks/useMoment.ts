// hooks/useBogotaTime.ts
import moment from "moment-timezone";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const useMoment = (date?: any) => {

  const bogotaTime = dayjs(date || new Date()).tz('America/Bogota')
  return bogotaTime;
};
