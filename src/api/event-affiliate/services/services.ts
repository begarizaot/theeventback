const populateDefault = {
  user_id: {
    populate: {
      country_id: {
        fields: ["id", "name", "code", "flag"],
      },
    },
    fields: ["email", "firstName", "lastName", "phoneNumber"],
  },
  event_id: {
    fields: ["id", "name"],
  },
  orders_id: {
    fields: ["id", "base_price"],
  },
};

export const calculateTotal = (item) => {
  const totalBase = item.orders_id.reduce(
    (sum, order) => sum + order.base_price,
    0
  );
  const numberOfOrders = item.orders_id.length;
  const value = item.value;

  if (item.state === "por") {
    return (totalBase * value) / 100;
  } else if (item.state === "val") {
    return value * numberOfOrders;
  }

  return 0;
};

export const EventAffiliateFindOne = async (
  populate,
  filters = {},
  fields = null
) => {
  return (
    await strapi.entityService.findMany(
      "api::event-affiliate.event-affiliate",
      {
        populate: populate || populateDefault || "*",
        filters: {
          ...filters,
        },
        fields: fields,
      }
    )
  )[0];
};

export const EventAffiliateUpdate = async (
  id,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update(
    "api::event-affiliate.event-affiliate",
    id,
    {
      populate: populate || populateDefault || "*",
      data: data,
      fields: fields,
    }
  );
};

export const EventAffiliateFindPage = async (
  populate = {},
  filters = {},
  sizePage = {
    page: 1,
    pageSize: 10,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage(
    "api::event-affiliate.event-affiliate",
    {
      populate: populate || populateDefault || "*",
      filters: {
        ...filters,
      },
      ...sizePage,
      sort,
    }
  );
};

export const EventAffiliateCreate = async (
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.create(
    "api::event-affiliate.event-affiliate",
    {
      populate: populate || populateDefault || "*",
      data: data,
      fields: fields,
    }
  );
};
