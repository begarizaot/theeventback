module.exports = {
  routes: [
    {
      method: "GET",
      path: "/order/getSendMail/:orderId",
      handler: "order.getSendMail",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order/postCreatePayment",
      handler: "order.postCreatePayment",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/order/postCreateOrder",
      handler: "order.postCreateOrder",
      config: {
        auth: false,
      },
    },
  ],
};
