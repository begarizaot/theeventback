export const SuperAdminFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::super-admin.super-admin", {
    populate: {
      users_id: {
        fields: ["id", "username", "email", "firstName", "lastName"],
      },
    },
    filters: {
      ...filters,
      isVisible: true,
    },
  });
};
