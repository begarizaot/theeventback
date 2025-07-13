/**
 * event-affiliate controller
 */

import { factories } from "@strapi/strapi";

const table = "api::event-affiliate.event-affiliate";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getListEventAffiliate(ctx) {
    const {
      params,
      state: { user },
      request: { query },
    } = ctx;
    return await strapi
      .service(table)
      .getListEventAffiliate({ params, user, query });
  },
  async postCreateEventAffiliate(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .postCreateEventAffiliate({ user, params, body });
  },
  async putUpdateEventAffiliate(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .putUpdateEventAffiliate({ user, params, body });
  },
}));
