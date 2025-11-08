const express = require("express");

const routes = express.Router();

routes.get("/categories");
routes.get("/categories/{id}");
routes.post("/categories");
routes.put("/categories/{id}");
routes.delete("/categories/{id}");

module.exports = routes;
