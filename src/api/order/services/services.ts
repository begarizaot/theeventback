export const onGroupTickets = (data) => {
  const agrupado = data.reduce((acc, item) => {
    const id = item.event_ticket_id.id;
    if (!acc[id]) {
      acc[id] = {
        ticketId: id,
        title: item.event_ticket_id.title,
        select: 0,
        price: item.value,
      };
    }
    acc[id].select += 1;
    return acc;
  }, {});
  return Object.values(agrupado).map((item: any) => ({
    ticketId: item.ticketId,
    title: item.title,
    select: item.select,
    price: (item.price || 0).toFixed(2),
  }));
};

export const OrderFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("api::order.order", {
      populate: populate || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};

export const OrderFindMany = async (filters = {}, populate?) => {
  return await strapi.entityService.findMany("api::order.order", {
    populate: populate || "*",
    filters: {
      ...filters,
    },
  });
};

export const OrderCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create("api::order.order", {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const OrderUpdate = async (
  idOrder = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update("api::order.order", idOrder, {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};
