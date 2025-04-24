export const EventFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::event-ticket.event-ticket", {
    populate: {},
    filters: {
      ...filters,
      isVisible: true,
    },
    sort: { ...sort, order: "asc" },
  });
};
