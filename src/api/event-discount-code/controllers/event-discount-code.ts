/**
 * event-discount-code controller
 */

import { factories } from "@strapi/strapi";

const table = "api::event-discount-code.event-discount-code";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getListDiscountCode(ctx) {
    const {
      params,
      state: { user },
      request: { query },
    } = ctx;
    return await strapi
      .service(table)
      .getListDiscountCode({ params, user, query });
  },
  async postEventsDiscountCode(ctx) {
    const {
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).postEventsDiscountCode({ params, body });
  },
  async postCreateDiscountCode(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .postCreateDiscountCode({ user, params, body });
  },
  async putUpdateDiscountCode(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi
      .service(table)
      .putUpdateDiscountCode({ user, params, body });
  },
}));
