// routes/ShippingRoutes.js
const express = require("express");
const ShippingController = require("../controller/ShippingController");

const routes = express.Router();

// API lấy địa chính (Public)
// Ví dụ: GET /api/shipping/location?type=province
// Ví dụ: GET /api/shipping/location?type=district&parentId=201
routes.get("/location", ShippingController.getLocationData);

// API tính phí (Public hoặc cần Token tùy bạn)
routes.post("/calculate-fee", ShippingController.calculateShippingFee);

module.exports = routes;
