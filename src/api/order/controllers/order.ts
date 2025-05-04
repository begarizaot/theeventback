/**
 * order controller
 */

import { factories } from "@strapi/strapi";

const table = "api::order.order";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getSendMail(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getSendMail({ params });
  },
  async postCreatePayment(ctx) {
    const {
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreatePayment({ body });
  },
  async postCreateOrder(ctx) {
    const {
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreateOrder({ body });
  },
}));
