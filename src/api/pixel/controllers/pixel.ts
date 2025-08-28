/**
 * pixel controller
 */

import { factories } from "@strapi/strapi";

const table = "api::pixel.pixel";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async postCreatePixel(ctx) {
    const {
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreatePixel({ params, body });
  },
  async putUpdatePixel(ctx) {
    const {
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).putUpdatePixel({ params, body });
  },
}));
