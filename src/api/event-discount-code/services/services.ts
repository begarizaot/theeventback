import { useMoment } from "../../../hooks";

export const EventDiscountCodeFindOne = async (filters = {}, fields = null) => {
  return (
    await strapi.entityService.findMany(
      "api::event-discount-code.event-discount-code",
      {
        populate: "*",
        filters: {
          ...filters,
          isVisible: true,
          start_date: {
            $lte: useMoment().format("YYYY-MM-DD HH:mm:ss"),
          },
          end_date: {
            $gte: useMoment().format("YYYY-MM-DD HH:mm:ss"),
          },
        },
        fields: fields,
      }
    )
  )[0];
};
