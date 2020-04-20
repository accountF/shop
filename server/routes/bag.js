const express = require("express");
const Bag = require("../models/bag");
const Orders = require("../models/orders");

const router = express.Router();

router.post("/", (req, res) => {
	console.log(req.user);
	let userId = req.user._id;
	Bag.remove({orderId: null, productId: req.body.productId}).then(() => {
		let bag = {
			productId: req.body.productId,
			numberOfProducts: req.body.numberOfProducts,
			userId: userId
		};
		Bag.create(bag).then((productInfo) => {
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
	let userId = req.user._id;
	let order = {
		userId: userId,
		userName: req.body.userName,
		userEmail: req.body.userEmail,
		phone: req.body.phone,
		deliveryType: req.body.deliveryType,
		address: req.body.address,
		payment: req.body.payment,
		orderDate: req.body.orderDate,
		status: req.body.status
	};
	Orders.create(order).then((order) => {
		Bag.find({orderId: undefined}).updateMany({orderId: order._id}).then(() => {
			res.send([]);
		});
	});
});


module.exports = router;
