//To demonstrate Versioning
const express = require("express");
const planetRoute = require("./planets/planets.router");
const launchRoute = require("./launches/launches.router");
const api = express.Router();

api.use(planetRoute);
api.use(launchRoute);

module.exports = api;
