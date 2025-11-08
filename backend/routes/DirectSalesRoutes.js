const express = require("express");

const routes = express.Router();

routes.get("/direct-sales");
routes.get("/direct-sales/{id}");
routes.post("/direct-sales");
routes.post("/direct-sales/{id}/buy");
routes.put("/direct-sales/{id}");
routes.delete("/direct-sales/{id}");

module.exports = routes;
