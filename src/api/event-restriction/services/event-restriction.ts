/**
 * event-restriction service
 */

import { factories } from "@strapi/strapi";
import { EventRestrictionFindMany } from "./services";

const table = "api::event-restriction.event-restriction";
export default factories.createCoreService(table, () => ({
  async getListRestrictions() {
    try {
      const restrictions = await EventRestrictionFindMany();
      return {
        data: restrictions,
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
