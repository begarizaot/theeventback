/**
 * event-discount-code controller
 */

import { factories } from "@strapi/strapi";

const table = "api::event-discount-code.event-discount-code";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async postEventsDiscountCode(ctx) {
    const {
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).postEventsDiscountCode({ params, body });
  },
}));
