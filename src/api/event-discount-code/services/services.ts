import { useMoment } from "../../../hooks";

export const EventDiscountCodeFindOneGeneral = async (
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
        },
        fields: fields,
      }
    )
  )[0];
};

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
            $lte: useMoment().format("YYYY-MM-DD hh:mm:ss"),
          },
          end_date: {
            $gte: useMoment().format("YYYY-MM-DD hh:mm:ss"),
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

export const EventDiscountCodeFindPage = async (
  populate = {},
  filters = {},
  sizePage = {
    page: 1,
    pageSize: 10,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage(
    "api::event-discount-code.event-discount-code",
    {
      populate: populate,
      filters: {
        ...filters,
      },
      ...sizePage,
      sort,
    }
  );
};

export const DiscountCodeUpdate = async (
  id = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update(
    "api::event-discount-code.event-discount-code",
    id,
    {
      populate: populate || "*",
      data: data,
      fields: fields,
    }
  );
};

export const DiscountCodeCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create(
    "api::event-discount-code.event-discount-code",
    {
      populate: populate || "*",
      data: data,
      fields: fields,
    }
  );
};
