// hooks/useBogotaTime.ts
import moment from "moment-timezone";

export const useMoment = (date?: any) => {
  // Si se pasa una fecha, úsala. Si no, usa el momento actual
  const bogotaTime = date
    ? moment.tz(date, "America/Bogota")
    : moment.tz("America/Bogota");

  return bogotaTime;
};
