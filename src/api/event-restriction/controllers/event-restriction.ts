/**
 * event-restriction controller
 */

import { factories } from '@strapi/strapi'

const table = "api::event-restriction.event-restriction";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getListRestrictions() {
    return await strapi.service(table).getListRestrictions();
  },
}));
