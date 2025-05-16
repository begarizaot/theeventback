module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event/getEventsHome",
      handler: "event.getEventsHome",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/event/getEventDetail/:id",
      handler: "event.getEventDetail",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/event/getEventMeta/:id",
      handler: "event.getEventMeta",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/event/getMyEvents",
      handler: "event.getMyEvents",
    },
    {
      method: "GET",
      path: "/event/getSharedEvents",
      handler: "event.getSharedEvents",
    },
    // *admin
    {
      method: "GET",
      path: "/event/getAdminEventDetail/:id",
      handler: "event.getAdminEventDetail",
    },
    {
      method: "GET",
      path: "/event/getAdminEventAnality/:id",
      handler: "event.getAdminEventAnality",
    },
  ],
};
