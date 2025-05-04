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
        username: body.email,
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
