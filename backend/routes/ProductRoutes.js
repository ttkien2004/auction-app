const express = require("express");

const routes = express.Router();

routes.get("/products");
routes.get("/products/{id}");
routes.post("/products");
routes.patch("/products/{id}");
routes.delete("/products/{id}");

module.exports = routes;
