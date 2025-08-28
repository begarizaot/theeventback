/**
 * pixel service
 */

import { factories } from "@strapi/strapi";
import { PixelCreate, PixelUpdate } from "./services";

const table = "api::pixel.pixel";

export default factories.createCoreService(table, () => ({
  async postCreatePixel({ params, body }) {
    try {
      await PixelCreate({
        ...body,
        event_id: params.id,
      });
      return {
        message: "Create pixel successfully",
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async putUpdatePixel({ params, body }) {
    try {
      await PixelUpdate(params.id, body);
      return {
        message: "Update pixel successfully",
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
