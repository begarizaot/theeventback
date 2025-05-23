module.exports = {
  routes: [
    {
      method: "GET",
      path: "/team-access/getListTeamAccess/:eventId",
      handler: "team-access.getListTeamAccess",
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
