/**
 * order controller
 */

import { factories } from "@strapi/strapi";

const table = "api::order.order";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async postCreatePayment(ctx) {
    const {
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreatePayment({ body });
  },
}));
