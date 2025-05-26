export const TicketFindOne = async (
  populateRes = null,
  filters = {},
  fields = null
) => {
  return (
    await strapi.entityService.findMany("api::ticket.ticket", {
      populate: populateRes || "*",
      filters: {
        ...filters,
      },
      fields: fields,
    })
  )[0];
};

export const TicketCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create("api::ticket.ticket", {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const TicketUpdate = async (
  idTicket = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update("api::ticket.ticket", idTicket, {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};
