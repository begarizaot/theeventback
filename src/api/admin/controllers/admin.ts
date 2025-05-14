/**
 * admin controller
 */

import { factories } from "@strapi/strapi";
import { AdminFindMany } from "../services/services";

const table = "api::admin.admin";

export default factories.createCoreController(table, {
  async getAdmin(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi.service(table).getAdmin({ params, user });
  },
});
