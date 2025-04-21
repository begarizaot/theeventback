import { useMoment } from "../../../hooks";

const populate: any = {
  event_tickets_ids: {
    fields: [
      "id",
      "title",
      "description",
      "price",
      "isTable",
      "start_date",
      "end_date",
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
};

export const filterGeneral = {
  event_tickets_ids: {
    id: {
      $notNull: true,
    },
  },
  $or: [
    {
      start_date: {
        $gte: useMoment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
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
};

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
