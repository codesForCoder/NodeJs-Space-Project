const express = require("express");
const { getAllLaunchesFromDB , httpAddNewLaunches ,httpAbortLaunches } = require("./launches.controller.js");
const launchesRouter = express.Router();

launchesRouter.get("/launches", getAllLaunchesFromDB);
launchesRouter.post("/launches", httpAddNewLaunches);
launchesRouter.delete("/launches/:id",async (req , resp) => httpAbortLaunches(req , resp));
module.exports = launchesRouter;
