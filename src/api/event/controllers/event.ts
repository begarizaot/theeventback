/**
 * event controller
 */

import { factories } from "@strapi/strapi";

const table = "api::event.event";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getEventsHome() {
    return await strapi.service(table).getEventsHome();
  },
  async getEventDetail(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getEventDetail({ params });
  },
  async getEventMeta(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getEventMeta({ params });
  },
  async getMyEvents(ctx) {
    const {
      state: { user },
    } = ctx;
    return await strapi.service(table).getMyEvents({ user });
  },
  async getSharedEvents(ctx) {
    const {
      state: { user },
    } = ctx;
    return await strapi.service(table).getSharedEvents({ user });
  },
  async getAdminEventDetail(ctx) {
    const {
      params,
      state: { user },
    } = ctx;
    return await strapi.service(table).getAdminEventDetail({ params, user });
  },
  async getAdminEventAnality(ctx) {
    const {
      params,
      state: { user },
    } = ctx;
    return await strapi.service(table).getAdminEventAnality({ params, user });
  },
}));
