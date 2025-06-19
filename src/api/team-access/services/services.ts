import { AdminFindMany } from "../../admin/services/services";

export const populateTeamAccess: any = {
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

export const onValidateTeamAccess = async ({ user, eventData }) => {
  if (user.id != eventData?.users_id.id) {
    const serviceTeam:any = await TeamAccessFindOne({
      user_id: {
        id: user.id,
      },
      event_id: {
        id: eventData.id,
      },
    });

    if (serviceTeam && serviceTeam?.isAdmin) {
      return {
        status: true,
      };
    }

    return {
      status: false,
      message: "You are not the owner of this event",
    };
  }

  return {
    status: true,
    message: "",
  };
};

export const TeamAccessFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::team-access.team-access", {
    populate: populateTeamAccess,
    filters: {
      ...filters,
      isVisible: true,
    },
    sort: sort,
  });
};

export const TeamAccessFindPage = async (
  populate = {},
  filters = {},
  sizePage = {
    page: 1,
    pageSize: 10,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage("api::team-access.team-access", {
    populate: populate || populateTeamAccess,
    filters: {
      ...filters,
    },
    ...sizePage,
    sort,
  });
};

export const TeamAccessFindOne = async (filters = {}) => {
  return (
    await strapi.entityService.findMany("api::team-access.team-access", {
      populate: populateTeamAccess || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};

export const TeamAccessUpdate = async (
  id = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update("api::team-access.team-access", id, {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const TeamAccessCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create("api::team-access.team-access", {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};
