export const PixelUpdate = async (
  id = null,
  data = {},
  populateRes?,
  fields = null
) => {
  return await strapi.entityService.update("api::pixel.pixel", id, {
    populate: populateRes || "*",
    data: data,
    fields: fields,
  });
};

export const PixelCreate = async (data = {}, populateRes?, fields = null) => {
  return await strapi.entityService.create("api::pixel.pixel", {
    populate: populateRes || "*",
    data: { ...data },
    fields: fields,
  });
};
