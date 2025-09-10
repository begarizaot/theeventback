/**
 * event-discount-code service
 */

import { factories } from "@strapi/strapi";
import { EventFindOne } from "../../event/services/services";
import {
  calculateTotal,
  EventAffiliateCreate,
  EventAffiliateFindPage,
  EventAffiliateUpdate,
} from "./services";
import { UserFindOne } from "../../../extensions/users-permissions/services/services";
import { useCrypto } from "../../../hooks/useCrypto";
import { useMoment } from "../../../hooks";

const { encrypt } = useCrypto();

const table = "api::event-affiliate.event-affiliate";

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
  async getListEventAffiliate({ params, user, query }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const { search, page, size } = query;

      const listCode = await EventAffiliateFindPage(
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
        data: listCode.results.map((item: any) => {
          item.totalSales = calculateTotal(item);
          return item;
        }),
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
  async postCreateEventAffiliate({ user, params, body }) {
    try {
      const eventData: any = await onValidateData(user, params.eventId);

      if (!eventData?.status) {
        return {
          status: false,
          message: eventData?.message,
        };
      }

      const userData = await UserFindOne({
        $or: [
          { email: { $eqi: body.email || "" } },
          { phoneNumber: { $eqi: String(body.phoneNumber) || "" } },
        ],
      });

      const affiliate = await EventAffiliateCreate({
        ...body,
        event_id: eventData?.data?.id,
        user_id: userData?.id,
        expiration_date: body?.expirationDate,
      });

      const dateString = useMoment().format("DDMMYYYY");
      const affiliateEncrypt = encrypt(`affiliateId${affiliate.id}${dateString}`);
      await EventAffiliateUpdate(affiliate.id, {
        id_affiliate: affiliateEncrypt,
      });

      return {
        message: "Create affiliate successfully",
        status: true,
      };
    } catch (e) {
      return {
        status: false,
        message: `${e?.message || ""}`,
      };
    }
  },
  async putUpdateEventAffiliate({ user, params, body }) {
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

      await EventAffiliateUpdate(id, {
        ...body,
        ...(body?.expirationDate && {
          expiration_date: body?.expirationDate,
        }),
      });

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
