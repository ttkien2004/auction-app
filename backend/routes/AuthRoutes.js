const express = require("express");

const routes = express.Router();

routes.post("/sign-in");

routes.post("/sign-up");

module.exports = routes;
