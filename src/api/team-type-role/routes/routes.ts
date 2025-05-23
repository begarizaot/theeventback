module.exports = {
  routes: [
    {
      method: "GET",
      path: "/team-type-role/getTeamTypeRol",
      handler: "team-type-role.getTeamTypeRol",
      config: {
        auth: false,
      },
    },
  ],
};
