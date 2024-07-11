import express from "express";
import config from "./config.js";
import { printWelcome, logger } from "./utils/log.js";

const server = express();

server.listen(config.SERVER.PORT, config.SERVER.HOST, () => {
    printWelcome();
    logger.info(`Server is running on ${config.SERVER.HOST}:${config.SERVER.PORT}`);
});
