// controllers/DirectSalesController.js
const DirectSalesService = require("../services/DirectSalesService");

const getAllDirectSalesController = async (req, res, next) => {
	try {
		const sales = await DirectSalesService.getAllDirectSales();
		res.status(200).json(sales);
	} catch (error) {
		next(error);
	}
};

const getDirectSaleByIdController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const sale = await DirectSalesService.getDirectSaleById(Number(id));
		res.status(200).json(sale);
	} catch (error) {
		next(error);
	}
};

const createDirectSaleController = async (req, res, next) => {
	try {
		const saleData = req.body;
		const newSale = await DirectSalesService.createDirectSale(saleData);
		res.status(201).json(newSale);
	} catch (error) {
		next(error);
	}
};

const buyDirectSaleController = async (req, res, next) => {
	try {
		const { directSaleId } = req.query; // sale ID
		const userId = req.user.id; // Lấy từ auth middleware
		const transaction = await DirectSalesService.buyDirectSale(
			Number(directSaleId),
			Number(userId)
		);
		res
			.status(200)
			.json({ message: "Buy new product successfully!", transaction });
	} catch (error) {
		next(error);
	}
};

const updateDirectSaleController = async (req, res, next) => {
	try {
		const { id } = req.params;
		const updateData = req.body;
		const updatedSale = await DirectSalesService.updateDirectSale(
			Number(id),
			updateData
		);
		res.status(200).json(updatedSale);
	} catch (error) {
		next(error);
	}
};

const deleteDirectSaleController = async (req, res, next) => {
	try {
		const { id } = req.params;
		await DirectSalesService.deleteDirectSale(Number(id));
		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllDirectSalesController,
	getDirectSaleByIdController,
	createDirectSaleController,
	buyDirectSaleController,
	updateDirectSaleController,
	deleteDirectSaleController,
};
