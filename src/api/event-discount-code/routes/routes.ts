module.exports = {
  routes: [
    {
      method: "POST",
      path: "/event-discount-code/postEventsDiscountCode/:id",
      handler: "event-discount-code.postEventsDiscountCode",
      config: {
        auth: false,
      },
    },
  ],
};
