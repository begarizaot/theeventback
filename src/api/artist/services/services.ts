import { useMoment } from "../../../hooks";

const populate: any = {
  events_ids: {
    fields: ["id", "id_event", "name", "url_image", "start_date"],
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
              .format("YYYY-MM-DD HH:mm:ss"),
          },
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
    },
  },
};

export const filterGeneral = {
  events_ids: {
    isVisible: true,
    start_date: {
      $gte: useMoment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
    },
  },
};

export const ArtistFindPage = async (
  filters = {},
  pageData = {
    pageSize: 10,
    page: 1,
  },
  sort = {}
) => {
  return await strapi.entityService.findPage("api::artist.artist", {
    populate: populate,
    filters: {
      ...filters,
    },
    sort: sort,
    ...pageData,
  });
};
