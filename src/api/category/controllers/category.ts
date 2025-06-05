/**
 * category controller
 */

import { factories } from '@strapi/strapi'

const table = "api::category.category";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getListCategories() {
    return await strapi.service(table).getListCategories();
  },
}));
