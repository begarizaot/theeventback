/**
 * `global-populate` middleware
 */

import type { Core } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    const token = ctx.request.header.authorization;

    ctx.query.populate = {
      header: {
        populate: ["logo", "navItems"],
      },
      footer: {
        populate: {
          logo: true,
          navItems: true,
          socialLinks: true,
        },
      },
      metas: true,
      colors: true,
    };

    await next();

    if (!user && !token && ctx.response?.body?.data?.footer?.navItems) {
      ctx.response.body.data.footer.navItems =
        ctx.response.body.data.footer.navItems.filter(
          (item: any) => item.isLogin !== true
        );
    }
  };
};
