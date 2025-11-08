const express = require("express");

const routes = express.Router();

routes.get("/buyer/{id}/transactions");
routes.get("/buyer/{id}/bids");
routes.get("/buyer/{id}/reviews");

module.exports = routes;
