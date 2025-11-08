const express = require("express");

const routes = express.Router();

routes.get("/reviews");
routes.get("/reviews/{id}");
routes.post("/reviews/{id}");
routes.put("/reviews/{id}");
routes.delete("/reviews/{id}");

module.exports = routes;
