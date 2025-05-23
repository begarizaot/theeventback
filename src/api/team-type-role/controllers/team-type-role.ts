/**
 * team-type-role controller
 */

import { factories } from "@strapi/strapi";

const table = "api::team-type-role.team-type-role";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getTeamTypeRol(ctx) {
    return await strapi.service(table).getTeamTypeRol();
  },
}));
