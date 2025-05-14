const populate: any = {
  event_id: {
    populate: {
      event_tickets_ids: true,
      event_locations_id: true,
      event_restriction_id: {
        fields: ["title"],
      },
      event_status_id: {
        fields: ["title"],
      },
      users_id: {
        fields: ["email", "firstName", "lastName", "phoneNumber"],
      },
    },
  },
  type_role_id: {
    fields: ["name"],
  },
};

export const TeamAccessFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::team-access.team-access", {
    populate: populate,
    filters: {
      ...filters,
      isVisible: true,
    },
    sort: sort,
    fields: ["id"],
  });
};

export const TeamAccessFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("api::team-access.team-access", {
      populate: populate || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};

