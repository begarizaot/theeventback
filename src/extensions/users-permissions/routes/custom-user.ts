export default [
  {
    method: "GET",
    path: "/getValidateEmail/:email",
    handler: "custom-user.getValidateEmail",
    config: {
      policies: [],
      auth: false,
    },
  },
];
