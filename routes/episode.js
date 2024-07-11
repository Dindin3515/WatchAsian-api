import { Router } from "express";
import * as controller from "../controllers/shows.js";

const episodeRouter = Router();

episodeRouter.get("/:id", controller.handleGetEpisodeById);

export default episodeRouter;