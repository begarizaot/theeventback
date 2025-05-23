export const TeamTypeRoleFindMany = async (filters = {}) => {
  return await strapi.entityService.findMany(
    "api::team-type-role.team-type-role",
    {
      filters: {
        ...filters,
        isVisible: true,
      },
      fields: ["id", "name", "description"],
    }
  );
};
