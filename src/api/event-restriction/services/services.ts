export const EventRestrictionFindMany = async (filters = {}) => {
  return await strapi.entityService.findMany(
    "api::event-restriction.event-restriction",
    {
      filters: {
        ...filters,
        isVisible: true,
      },
      sort: {
        order: "asc",
      },
    }
  );
};
