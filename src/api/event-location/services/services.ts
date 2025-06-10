export const EventLocationFindCreate = async (place: any, event_id: any) => {
  const location = {
    title: place?.name,
    formatted_address: place?.formatted_address,
    place_id: place?.place_id,
    url: place?.url,
    location: {
      lat: place?.geometry?.location?.lat,
      lng: place?.geometry?.location?.lng,
    },
    vicinity: place?.vicinity,
    events_id: event_id,
  };

  let locationDate = null;

  locationDate = await EventLocationFindOne({
    place_id: place?.place_id,
  });

  if (!locationDate) {
    locationDate = await EventLocationCreate(location);
  }

  return locationDate;
};

export const EventLocationFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("api::event-location.event-location", {
      populate: populate || "*",
      filters: {
        ...filters,
      },
    })
  )[0];
};

export const EventLocationCreate = async (
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.create(
    "api::event-location.event-location",
    {
      populate: populate || "*",
      data: { ...data },
      fields: fields,
    }
  );
};
