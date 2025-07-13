module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event-affiliate/getListEventAffiliate/:eventId",
      handler: "event-affiliate.getListEventAffiliate",
    },
    {
      method: "POST",
      path: "/event-affiliate/postCreateEventAffiliate/:eventId",
      handler: "event-affiliate.postCreateEventAffiliate",
    },
    {
      method: "PUT",
      path: "/event-affiliate/putUpdateEventAffiliate/:eventId",
      handler: "event-affiliate.putUpdateEventAffiliate",
    },
  ],
};
