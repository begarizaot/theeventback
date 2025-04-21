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
  async getArtistDetail(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getArtistDetail({ params });
  },
  async getArtistMeta(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getArtistMeta({ params });
  },
}));
