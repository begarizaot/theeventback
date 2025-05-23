/**
 * admin service
 */

import { factories } from "@strapi/strapi";
import { AdminFindMany } from "./services";
import { EventFindOne } from "../../event/services/services";
import { TeamAccessFindOne } from "../../team-access/services/services";
import { fileURLToPath } from "url";

const table = "api::admin.admin";

export default factories.createCoreService(table, () => ({
  async getAdmin({ params, user }) {
    try {
      const event: any = await EventFindOne(null, { id_event: params.id });
      if (!event) {
        return {
          status: false,
          message: "Event not found",
        };
      }

      const userAdmin = event?.users_id?.id == user?.id;

      const team: any = await TeamAccessFindOne({
        event_id: event?.id,
        user_id: user?.id,
      });

      const service = await AdminFindMany({
        Nav: {
          populate: "*",
          filters: {
            menu: {
              $or: [
                {
                  type_roles_ids: {
                    id: !userAdmin ? team.type_role_id.id : 3,
                  },
                },
                {
                  isAll: true,
                },
              ],
            },
          },
        },
      });
      return { data: { ...service, id_event: params.id }, status: true };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
}));
