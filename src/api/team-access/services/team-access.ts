/**
 * team-access service
 */

import { factories } from "@strapi/strapi";
import {
  onValidateTeamAccess,
  populateTeamAccess,
  TeamAccessCreate,
  TeamAccessFindOne,
  TeamAccessFindPage,
  TeamAccessUpdate,
} from "./services";
import { EventFindOne } from "../../event/services/services";
import {
  UserCreate,
  UserFindOne,
} from "../../../extensions/users-permissions/services/services";
import { CountryFindOne } from "../../country/services/services";
import { SuperAdminFindMany } from "../../super-admin/services/services";

const onValidateData = async (user: any, eventId: any) => {
  if (!user) {
    return {
      status: false,
      message: "User not found",
    };
  }
  const eventData: any = await EventFindOne(
    null,
    {
      id_event: eventId,
    },
    ["id"]
  );

  if (!eventData) {
    return {
      status: false,
      message: "Event not found",
    };
  }

  // const resTeam = await onValidateTeamAccess({user, eventData});

  // if (!resTeam?.status) {
  //   return {
  //     status: false,
  //     message: resTeam?.message,
  //   };
  // }

  return {
    status: true,
    data: eventData,
  };
};

const table = "api::team-access.team-access";
export default factories.createCoreService(table, () => ({
  async getTeamAccess({ user, params }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const serviceTeam: any = await TeamAccessFindOne({
        user_id: {
          id: user.id,
        },
        event_id: {
          id: eventData?.data?.id,
        },
      });

      return {
        data: serviceTeam && serviceTeam?.isAdmin,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async getListTeamAccess({ user, params, query }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { search, page, size } = query;

      const superAdmins = await SuperAdminFindMany();

      const team = await TeamAccessFindPage(
        {
          ...populateTeamAccess,
          user_id: {
            populate: {
              country_id: {
                fields: ["id", "name", "code", "flag"],
              },
            },
            fields: ["email", "firstName", "lastName", "phoneNumber"],
          },
          event_id: {
            fields: ["id", "name"],
          },
        },
        {
          event_id: {
            id: eventData?.data?.id,
          },
          ...(search?.length > 2 && {
            $or: [
              { user_id: { email: { $containsi: search || "" } } },
              { user_id: { firstName: { $containsi: search || "" } } },
              { user_id: { lastName: { $containsi: search || "" } } },
              { user_id: { phoneNumber: { $containsi: search || "" } } },
              { event_id: { name: { $containsi: search || "" } } },
            ],
          }),
          user_id: {
            $notIn: superAdmins.map((item) => item.id),
          },
        },
        {
          page: page || 1,
          pageSize: size || 10,
        }
      );

      return {
        data: team.results,
        pagination: team.pagination,
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async postCreateTeamAccess({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { email, country, phone } = body;

      let userData: any = await UserFindOne({ email: { $eqi: email || "" } });

      if (user.id == userData?.id) {
        return {
          status: false,
          message: "You are the owner of this event",
        };
      }

      if (!userData) {
        let phoneData: any = await UserFindOne({
          phoneNumber: { $eqi: phone || "" },
        });

        if (phoneData) {
          return {
            status: false,
            message: "Phone number already exists",
          };
        }

        const countryReq = await CountryFindOne({
          code: { $eqi: country },
        });

        userData = await UserCreate({
          ...body,
          phoneNumber: phone,
          country_id: countryReq.id,
        });
      }

      await TeamAccessCreate({
        user_id: userData?.id,
        event_id: eventData?.data?.id,
        type_role_id: body?.typeRol,
      });

      return {
        message: "Create team access successfully",
        status: true,
        data: userData,
      };
    } catch (error) {
      return {
        status: false,
        message: `${error?.message || ""}`,
      };
    }
  },
  async putUpdateTeamAccess({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { id } = body;

      if (!id) {
        return {
          status: false,
          message: "Id not found",
        };
      }

      await TeamAccessUpdate(id, body);

      return {
        message: "Update team access successfully",
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
