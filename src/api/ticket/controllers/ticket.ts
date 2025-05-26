/**
 * order controller
 */

import { factories } from "@strapi/strapi";

const table = "api::ticket.ticket";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getTicketData(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi.service(table).getTicketData({ user, params });
  },
  async getScannerTicket(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi.service(table).getScannerTicket({ user, params });
  },
}));
