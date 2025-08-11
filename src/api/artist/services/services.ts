import { useMoment } from "../../../hooks";

const populate: any = {
  events_ids: {
    fields: [
      "id",
      "id_event",
      "name",
      "description",
      "url_image",
      "start_date",
      "end_date",
    ],
    populate: {
      event_locations_id: {
        fields: ["id", "vicinity"],
      },
    },
    filters: {
      isVisible: true,
      $or: [
        {
          start_date: {
            $gte: useMoment()
              .subtract(1, "hours")
              .format("YYYY-MM-DD hh:mm:ss"),
          },
        },
        {
          $and: [
            { isEndDate: true },
            {
              end_date: {
                $gte: useMoment().format("YYYY-MM-DD hh:mm:ss"),
              },
            },
          ],
        },
      ],
    },
  },
};

export const filterGeneral = {
  events_ids: {
    isVisible: true,
    start_date: {
      $gte: useMoment().subtract(1, "hours").format("YYYY-MM-DD hh:mm:ss"),
    },
  },
};

export const ArtistFindMany = async (filters = {}) => {
  return await strapi.entityService.findMany("api::artist.artist", {
    filters: {
      ...filters,
      isVisible: true,
    },
  });
};

export const ArtistFindPage = async (
  populateRes = null,
  filters = {},
  pageData = {
    pageSize: 10,
    page: 1,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage("api::artist.artist", {
    populate: populateRes || populate,
    filters: {
      ...filters,
    },
    sort: sort,
    ...pageData,
  });
};

export const ArtistFindOne = async (
  populateRes = null,
  filters = {},
  fields = null
) => {
  return (
    await strapi.entityService.findMany("api::artist.artist", {
      populate: populateRes || populate,
      filters: {
        ...filters,
      },
      fields: fields,
    })
  )[0];
};

export const ArtistCreate = async (data = {}, populate?, fields = null) => {
  return await strapi.entityService.create("api::artist.artist", {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};

export const ArtistUpdate = async (
  id = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update("api::artist.artist", id, {
    populate: populate || "*",
    data: data,
    fields: fields,
  });
};