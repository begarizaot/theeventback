const populate: any = {
  eventCarruselItem: {
    populate: {
      btn: true,
      event_id: {
        filters: {
          isVisible: true,
        },
      },
    },
  },
  categories: {
    populate: {
      category_id: {
        fields: ["id", "title", "url_image", "slug"],
      },
    },
    filters: {
      isVisible: true,
    },
  },
};

export const HomeFindMany = async () => {
  return await strapi.entityService.findMany("api::home.home", {
    populate: populate,
  });
};
