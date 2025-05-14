export const AdminFindMany = async (
  populate = {},
  filters = {},
  fields = null
) => {
  return await strapi.entityService.findMany("api::admin.admin", {
    populate: populate || "*",
    filters: {
      ...filters,
    },
    fields: fields,
  });
};
