const express = require("express");
const Bag = require("../models/bag");
const Orders = require("../models/orders");

const router = express.Router();

router.post("/", (req, res) => {
	Bag.remove({orderId: null, productId: req.body.productId}).then(() => {
		Bag.create(req.body).then((productInfo) => {
			res.send(productInfo);
		});
	});
});

router.get("/", (req, res) => {
	Bag.aggregate([
		{
			$match: {orderId: undefined}
		},
		{
			$lookup: {
				from: "products",
				localField: "productId",
				foreignField: "_id",
				as: "productInfo"
			}
		},
		{
			$unwind: {path: "$productInfo"}
		},
		{
			$project: {
				id: "$_id",
				name: "$productInfo.name",
				image: "$productInfo.image",
				amount: "$numberOfProducts",
				price: "$productInfo.price",
				sum: {$multiply: ["$productInfo.price", "$numberOfProducts"]}
			}
		}
	]).then((products) => {
		res.send(products);
	});
});

router.delete("/:id", (req, res) => {
	Bag.findByIdAndRemove({_id: req.params.id}).then(() => {
		res.send("Deleted");
	});
});

router.post("/makeOrder", (req, res) => {
	Orders.create(req.body).then((order) => {
		Bag.find({orderId: undefined}).updateMany({orderId: order._id}).then(() => {
			res.send([]);
		});
	});
});


module.exports = router;
