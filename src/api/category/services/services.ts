export const CategoriesFindMany = async (populate = null, filters = {}) => {
  return await strapi.entityService.findMany("api::category.category", {
    populate: populate || {
      events_ids: true,
    },
    filters: {
      ...filters,
      isVisible: true,
    },
    fields: ["title", "slug", "url_image"],
  });
};
