import customUserRoutes from "./routes/custom-user";
import customUserController from "./controllers/custom-user";

export default (plugin) => {
  plugin.routes["content-api"].routes.push(...customUserRoutes);

  plugin.controllers["custom-user"] = customUserController;

  return plugin;
};
