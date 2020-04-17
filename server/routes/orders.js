const express = require("express");
const Orders = require("../models/orders");

const router = express.Router();

router.get("/", (req, res) => {
	Orders.aggregate([
		{
			$lookup: {
				from: "bags",
				localField: "_id",
				foreignField: "orderId",
				as: "bagsInfo"
			}
		},
		{
			$unwind: {path: "$bagsInfo"}
		},
		{
			$lookup: {
				from: "products",
				localField: "bagsInfo.productId",
				foreignField: "_id",
				as: "productsInfo"
			}
		},
		{
			$unwind: {path: "$productsInfo"}
		},
		{
			$project: {
				productName: "$productsInfo.name",
				numberOfProducts: "$bagsInfo.numberOfProducts",
				address: 1,
				deliveryType: 1,
				payment: 1,
				orderDate: 1,
				status: 1
			}
		}
	]).then((orderInfo) => {
		res.send(orderInfo);
	});
});

module.exports = router;
