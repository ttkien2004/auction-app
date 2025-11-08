const express = require("express");

const routes = express.Router();

routes.post("/seller/{id}/products");
routes.get("/seller/{id}/products");
routes.get("/seller/{id}/reviews");

module.exports = routes;
