export const EventTicketFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::event-ticket.event-ticket", {
    populate: {},
    filters: {
      ...filters,
      isVisible: true,
    },
    sort: { ...sort, order: "asc" },
  });
};

export const EventTicketFindOne = async (filters = {}) => {
  return (
    await strapi.entityService.findMany("api::event-ticket.event-ticket", {
      populate: {},
      filters: {
        ...filters,
        isVisible: true,
      },
    })
  )[0];
};

export const EventTickettUpdate = async (
  id = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update(
    "api::event-ticket.event-ticket",
    id,
    {
      populate: populate || "*",
      data: data,
      fields: fields,
    }
  );
};
