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
  ],
};
