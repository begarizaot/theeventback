export const CountryFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("api::country.country", {
      populate: populate || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};
