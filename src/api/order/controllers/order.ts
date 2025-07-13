/**
 * order controller
 */

import { factories } from "@strapi/strapi";

const table = "api::order.order";
export default factories.createCoreController(table, ({ strapi }) => ({
  // GET
  async getSendMail(ctx) {
    const { params } = ctx;
    return await strapi.service(table).getSendMail({ params });
  },
  async getMyOrders(ctx) {
    const {
      state: { user },
    } = ctx;
    return await strapi.service(table).getMyOrders({ user });
  },
  async getAllOrdersList(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi.service(table).getAllOrdersList({ user, params });
  },
  async getAllOrders(ctx) {
    const {
      state: { user },
      params,
      request: { query },
    } = ctx;
    return await strapi.service(table).getAllOrders({ user, params, query });
  },
  async getAllOrdersFree(ctx) {
    const {
      state: { user },
      params,
      request: { query },
    } = ctx;
    return await strapi
      .service(table)
      .getAllOrdersFree({ user, params, query });
  },
  async getRefundOrder(ctx) {
    const {
      state: { user },
      params,
    } = ctx;
    return await strapi.service(table).getRefundOrder({ user, params });
  },
  async postCreatePayment(ctx) {
    const {
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreatePayment({ body });
  },
  async postCreatePaymentFree(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreatePaymentFree({ user, body });
  },
  async postCreateOrder(ctx) {
    const {
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreateOrder({ body });
  },
  async postCreateOrderFree(ctx) {
    const {
      state: { user },
      request: { body },
    } = ctx;
    return await strapi.service(table).postCreateOrderFree({ user, body });
  },
  async postSendMail(ctx) {
    const {
      params,
      request: { body },
    } = ctx;
    return await strapi.service(table).postSendMail({ params, body });
  },
}));
