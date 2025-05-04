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
