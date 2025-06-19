module.exports = {
  routes: [
    {
      method: "GET",
      path: "/team-access/getListTeamAccess/:eventId",
      handler: "team-access.getListTeamAccess",
    },
    {
      method: "GET",
      path: "/team-access/getTeamAccess/:eventId",
      handler: "team-access.getTeamAccess",
    },
    {
      method: "POST",
      path: "/team-access/postCreateTeamAccess/:eventId",
      handler: "team-access.postCreateTeamAccess",
    },
    {
      method: "PUT",
      path: "/team-access/putUpdateTeamAccess/:eventId",
      handler: "team-access.putUpdateTeamAccess",
    },
  ],
};
