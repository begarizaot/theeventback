/**
 * category service
 */

import { factories } from "@strapi/strapi";
import { CategoriesFindMany } from "./services";

const table = "api::category.category";
export default factories.createCoreService(table, () => ({
  async getListCategories() {
    try {
      const categories = await CategoriesFindMany({});
      return {
        data: categories,
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
