const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const MoMoController = require("../controller/MoMoController");

const routes = express.Router();

routes.post("/create", MoMoController.createMoMoTransaction);

routes.get("/result", MoMoController.getResultFromTransaction);

module.exports = routes;
