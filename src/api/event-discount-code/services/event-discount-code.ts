/**
 * event-discount-code service
 */

import { factories } from "@strapi/strapi";
import {
  DiscountCodeCreate,
  DiscountCodeUpdate,
  EventDiscountCodeFindOne,
  EventDiscountCodeFindOneGeneral,
  EventDiscountCodeFindPage,
} from "./services";
import { EventFindOne } from "../../event/services/services";

const table = "api::event-discount-code.event-discount-code";

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

export default factories.createCoreService(table, () => ({
  async getListDiscountCode({ params, user, query }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { search, page, size } = query;

      const listCode = await EventDiscountCodeFindPage(
        null,
        {
          event_id: {
            id: eventData?.data?.id,
          },
          ...(search?.length > 2 && {
            $or: [
              { name: { $containsi: search || "" } },
              { state: { $containsi: search || "" } },
            ],
          }),
        },
        {
          page: page || 1,
          pageSize: size || 10,
        }
      );

      return {
        data: listCode.results,
        pagination: listCode.pagination,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async postEventsDiscountCode({ params, body }) {
    try {
      const service = await EventDiscountCodeFindOne(null, {
        event_id: {
          id_event: params.id,
        },
        name: {
          $eqi: body.code ?? "",
        },
        isVisible: true,
      });
      let value = 0;
      let freeTicket = false;

      if (service) {
        const stock = service.stock <= service.stock_max;
        service.state == "val" &&
          (value = body.value - (stock ? service.value : 0));
        service.state == "por" &&
          (value = Number(
            (
              body.value -
              (body.value * (stock ? service.value : 0)) / 100
            ).toFixed(2)
          ));

        service.state == "por" &&
          stock &&
          service.value >= 100 &&
          (freeTicket = true);
      }

      return {
        data: value,
        message: value <= 0 ? "Discount code is not valid" : "",
        freeTicket,
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async postCreateDiscountCode({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const codeExict = await EventDiscountCodeFindOneGeneral(null, {
        event_id: {
          id: eventData?.data?.id,
        },
        name: {
          $eqi: body.name ?? "",
        },
      });

      if (codeExict) {
        return {
          status: false,
          message: "Code already exists",
        };
      }

      await DiscountCodeCreate({ ...body, event_id: eventData?.data?.id });

      return {
        message: "Create team access successfully",
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async putUpdateDiscountCode({ user, params, body }) {
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

      const codeExict = await EventDiscountCodeFindOneGeneral(null, {
        event_id: {
          id: eventData?.data?.id,
        },
        name: {
          $eqi: body?.name ?? "",
        },
      });

      if (codeExict && codeExict.id !== id) {
        return {
          status: false,
          message: "Code already exists",
        };
      }

      await DiscountCodeUpdate(id, body);

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
