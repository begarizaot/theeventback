const populate:any = {
  eventCarruselItem: {
    populate: {
      btn: true,
      event_id: true,
    },
  },
};

export const HomeFindMany = async () => {
  return await strapi.entityService.findMany("api::home.home", {
    populate: populate,
  });
};
