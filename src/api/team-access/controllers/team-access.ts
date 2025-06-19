/**
 * team-access controller
 */

import { factories } from "@strapi/strapi";

const table = "api::team-access.team-access";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getListTeamAccess(ctx) {
    const {
      state: { user },
      params,
      request: { query },
    } = ctx;
    return await strapi
      .service(table)
      .getListTeamAccess({ user, params, query });
  },
  async getTeamAccess(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi
      .service(table)
      .getTeamAccess({ user, params });
  },
  async postCreateTeamAccess(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .postCreateTeamAccess({ user, params, body });
  },
  async putUpdateTeamAccess(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .putUpdateTeamAccess({ user, params, body });
  },
}));
