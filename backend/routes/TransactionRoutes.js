const express = require("express");

const routes = express.Router();

routes.get("/transactions");
routes.get("/transactions/{id}");
routes.post("/transactions/{id}");
routes.put("/transactions/{id}");
routes.delete("/transactions/{id}");

module.exports = routes;
