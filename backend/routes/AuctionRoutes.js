const express = require("express");

const routes = express.Router();

routes.get("/auctions");
routes.get("/auctions/{id}");
routes.post("/auctions/{id}");
routes.put("/auctions/{id}");
routes.delete("/auctions/{id}");
routes.post("/auctions/{id}/join");
routes.get("/auctions/{id}/bids");
routes.post("/auctions/{id}/bids");

module.exports = routes;
