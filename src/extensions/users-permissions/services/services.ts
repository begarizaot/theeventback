interface User {
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  confirmed?: boolean;
  password?: string;
  blocked?: boolean;
  provider?: string;
}

const populateReq = {
  country_id: {
    fields: ["id", "name", "code", "flag"],
  },
};

const fieldsReq: any = ["email", "firstName", "lastName", "phoneNumber"];

export const validateUser = async (body: User) => {
  let userData: any = (
    await strapi.entityService.findMany("plugin::users-permissions.user", {
      populate: "*",
      filters: {
        $or: [
          { email: { $eqi: body.email || "" } },
          { phoneNumber: { $eqi: body.phoneNumber || "" } },
        ],
      },
    })
  )[0];

  if (!userData) {
    userData = strapi.entityService.create("plugin::users-permissions.user", {
      data: {
        ...body,
        username: `${body.email}`.toLocaleLowerCase(),
        email: `${body.email}`.toLocaleLowerCase(),
        confirmed: true,
        publishedAt: new Date(),
        role: {
          id: 2,
        },
      },
    });
  }

  return userData;
};

export const UserFindOne = async (filters = {}, populate?) => {
  return (
    await strapi.entityService.findMany("plugin::users-permissions.user", {
      populate: populate || populateReq || "*",
      filters: {
        ...filters,
      },
      fields: fieldsReq,
    })
  )[0];
};

export const UserUpdate = async (
  id = null,
  data = {},
  populate?,
  fields = null
) => {
  return await strapi.entityService.update(
    "plugin::users-permissions.user",
    id,
    {
      populate: populate || populateReq || "*",
      data: data,
      fields: fieldsReq,
    }
  );
};

export const UserCreate = async (dataRes: any = {}, populate?) => {
  return await strapi.entityService.create("plugin::users-permissions.user", {
    populate: populate || populateReq || "*",
    data: {
      ...dataRes,
      username: `${dataRes.email}`.toLocaleLowerCase(),
      email: `${dataRes.email}`.toLocaleLowerCase(),
      confirmed: true,
      role: {
        id: 2,
      },
    },
    fields: fieldsReq,
  });
};
