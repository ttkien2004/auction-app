const express = require("express");

const routes = express.Router();

routes.get("/users");
routes.get("/users/{userId}");
routes.put("/users/{userId}");
routes.delete("/users/{userId}");
routes.get("/users/{id}/bids");

module.exports = routes;
