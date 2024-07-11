import { Router } from "express";
import * as controller from "../controllers/shows.js";

const showsRouter = Router();

showsRouter.get("/", controller.handleGetAllShows);

showsRouter.get("/:id", controller.handleGetShowById);

showsRouter.get("/episode/:id", controller.handleGetEpisodeById);

export default showsRouter;