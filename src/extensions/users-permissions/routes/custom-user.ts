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
  {
    method: "POST",
    path: "/postLogin",
    handler: "custom-user.postLogin",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/postValidateOTP",
    handler: "custom-user.postValidateOTP",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/postRegister",
    handler: "custom-user.postRegister",
    config: {
      policies: [],
      auth: false,
    },
  },
];
