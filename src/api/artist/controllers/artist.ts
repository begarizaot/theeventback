/**
 * artist controller
 */

import { factories } from "@strapi/strapi";

const table = "api::artist.artist";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getArtist() {
    return await strapi.service(table).getArtist();
  },
}));
