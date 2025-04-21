/**
 * artist service
 */

import { factories } from "@strapi/strapi";
import { ArtistFindPage, filterGeneral } from "./services";

const table = "api::artist.artist";

export default factories.createCoreService(table, () => ({
  async getArtist() {
    try {
      const service = await ArtistFindPage(filterGeneral, {
        pageSize: 8,
        page: 1,
      });
      return { data: service.results, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
}));
