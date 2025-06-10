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
      path: "/event/getEventAllPage",
      handler: "event.getEventAllPage",
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
    {
      method: "POST",
      path: "/event/postCreateEvent",
      handler: "event.postCreateEvent",
    },
    {
      method: "PUT",
      path: "/event/putUpdateEvent/:id",
      handler: "event.putUpdateEvent",
    },
    {
      method: "PUT",
      path: "/event/putUpdateEventImage/:id",
      handler: "event.putUpdateEventImage",
    },
    {
      method: "PUT",
      path: "/event/putUpdateEventFollowing/:id",
      handler: "event.putUpdateEventFollowing",
      config: {
        auth: false,
      },
    },
  ],
};
