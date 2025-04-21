/**
 * artist service
 */

import { factories } from "@strapi/strapi";
import { ArtistFindOne, ArtistFindPage, filterGeneral } from "./services";

const table = "api::artist.artist";

export default factories.createCoreService(table, () => ({
  async getArtist() {
    try {
      const service = await ArtistFindPage(null, filterGeneral, {
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
  async getArtistDetail({ params }) {
    try {
      const service = await ArtistFindOne(null, { id_artist: params.id });
      return { data: service, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getArtistMeta({ params }) {
    try {
      const service = await ArtistFindOne({}, { id_artist: params.id }, [
        "id_artist",
        "name",
        "url_image",
      ]);
      return {
        data: {
          id: service.id_artist ?? "",
          title: service.name ?? "",
          urlImage: service.url_image ?? "",
        },
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
}));
