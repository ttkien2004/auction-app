const express = require("express");

const routes = express.Router();

routes.get("/buyer/{id}/orders");
routes.get("/buyer/{id}/orders/{orderId}");

module.exports = routes;
