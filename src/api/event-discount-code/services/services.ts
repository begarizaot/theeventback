import { useMoment } from "../../../hooks";

export const EventDiscountCodeFindOne = async (
  populate,
  filters = {},
  fields = null
) => {
  return (
    await strapi.entityService.findMany(
      "api::event-discount-code.event-discount-code",
      {
        populate: populate || "*",
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

export const EventDiscountCodeUpdate = async (
  idEventDiscountCode,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update(
    "api::event-discount-code.event-discount-code",
    idEventDiscountCode,
    {
      populate: populate || "*",
      data: data,
      fields: fields,
    }
  );
};
