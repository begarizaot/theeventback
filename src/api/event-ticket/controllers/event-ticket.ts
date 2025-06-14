/**
 * event-ticket controller
 */

import { factories } from "@strapi/strapi";

const table = "api::event-ticket.event-ticket";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getTicketEvents(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getTicketEvents({ params });
  },
  async createTicketEvents(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).createTicketEvents({ user, params, body });
  },
  async editTicketEvents(ctx) {
    const {
      state: { user },
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).editTicketEvents({ user, params, body });
  },
}));
