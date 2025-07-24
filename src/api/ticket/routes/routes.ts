module.exports = {
  routes: [
    {
      method: "GET",
      path: "/ticket/getTicketData/:eventId/:ticketId",
      handler: "ticket.getTicketData",
    },
    {
      method: "GET",
      path: "/ticket/getScannerTicket/:eventId/:ticketId",
      handler: "ticket.getScannerTicket",
    },
    {
      method: "POST",
      path: "/ticket/postCreateTicket/:orderId",
      handler: "ticket.postCreateTicket",
      config: {
        auth: false,
      },
    },
  ],
};
