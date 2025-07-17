/**
 * artist service
 */

import { factories } from "@strapi/strapi";
import {
  ArtistCreate,
  ArtistFindMany,
  ArtistFindOne,
  ArtistFindPage,
  ArtistUpdate,
  filterGeneral,
} from "./services";
import { useCrypto } from "../../../hooks/useCrypto";
import { useMoment } from "../../../hooks";

const { encrypt } = useCrypto();

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
  async getListArtist() {
    try {
      const service = await ArtistFindMany();
      return { data: service, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async getArtistAllPage({ query }) {
    const { search, page, size } = query;

    try {
      const service = await ArtistFindPage(
        null,
        {
          ...filterGeneral,
          ...(search?.length > 2 && {
            $or: [{ name: { $containsi: search || "" } }],
          }),
        },
        {
          pageSize: size,
          page: page,
        }
      );
      return {
        data: service.results,
        pagination: service.pagination,
        status: true,
      };
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
  async postCreateArtist({ body }) {
    try {
      const artist = await ArtistCreate({ ...body });
      if (!artist) {
        return {
          status: false,
          message: "Failed to create artist",
        };
      }

      const dateString = useMoment().format("DDMMYYYY");
      const artistEncrypt = encrypt(`artistId${artist.id}${dateString}`);
      ArtistUpdate(artist.id, {
        id_artist: artistEncrypt,
      });

      return {
        data: artistEncrypt,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
}));
