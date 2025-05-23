/**
 * team-type-role service
 */

import { factories } from "@strapi/strapi";
import { TeamTypeRoleFindMany } from "./services";

const table = "api::team-type-role.team-type-role";
export default factories.createCoreService(table, () => ({
  async getTeamTypeRol() {
    try {
      const typeRole = await TeamTypeRoleFindMany();
      return {
        data: typeRole,
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
