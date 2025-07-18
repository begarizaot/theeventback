import { useMoment } from "../../../hooks";

export const populate: any = {
  event_tickets_ids: {
    fields: [
      "id",
      "title",
      "description",
      "price",
      "isTable",
      "start_date",
      "limit",
      "end_date",
      "stock",
      "quantity",
      "isVisible",
      "codePassword",
    ],
    filters: {
      isVisible: true,
    },
  },
  categories_id: {
    fields: ["id", "title"],
  },
  event_locations_id: true,
  event_restriction_id: {
    fields: ["id", "title", "order"],
  },
  event_status_id: {
    fields: ["id", "title"],
    filters: {
      isVisible: true,
    },
  },
  artists_ids: {
    fields: ["id", "name"],
    filters: {
      isVisible: true,
    },
  },
  users_id: {
    populate: {
      country_id: {
        fields: ["id", "name", "code"],
      },
    },
    fields: ["id", "phoneNumber", "email"],
  },
};

export const filterGeneral = {
  isVisible: true,
  event_tickets_ids: {
    id: {
      $notNull: true,
    },
  },
  $or: [
    {
      $and: [
        {
          opening_extension_date: {
            $notNull: true,
          },
        },
        {
          opening_extension_date: {
            $gte: useMoment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      ],
    },
    {
      $and: [
        {
          opening_extension_date: {
            $null: true,
          },
        },
        {
          start_date: {
            $gte: useMoment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      ],
    },
    {
      $and: [
        { isEndDate: true },
        {
          end_date: {
            $gte: useMoment().format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      ],
    },
  ],
}

export const EventFindPage = async (
  filters = {},
  pageData = {
    pageSize: 10,
    page: 1,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage("api::event.event", {
    populate: populate,
    filters: {
      ...filters,
      isVisible: true,
    },
    sort: sort,
    ...pageData,
  });
};

export const EventFindMany = async (filters = {}, sort = {}) => {
  return await strapi.entityService.findMany("api::event.event", {
    populate: populate,
    filters: {
      ...filters,
    },
    sort: sort,
  });
};

export const EventFindOne = async (
  populateRes = null,
  filters = {},
  fields = null
) => {
  return (
    await strapi.entityService.findMany("api::event.event", {
      populate: populateRes || populate,
      filters: {
        ...filters,
      },
      fields: fields,
    })
  )[0];
};

export const EventUpdate = async (
  id = null,
  data = {},
  populateRes?,
  fields = null
) => {
  return await strapi.entityService.update("api::event.event", id, {
    populate: populateRes || populate || "*",
    data: data,
    fields: fields,
  });
};

export const EventCreate = async (data = {}, populateRes?, fields = null) => {
  return await strapi.entityService.create("api::event.event", {
    populate: populateRes || populate || "*",
    data: { ...data, isVisible: true, isEndDate: false },
    fields: fields,
  });
};
