const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const OrderScheme = new Scheme({
	userName: String,
	userEmail: String,
	phone: String,
	address: String,
	deliveryType: String,
	payment: String,
	orderDate: String,
	status: String,
	userId: mongoose.Schema.Types.ObjectId,
	bagId: mongoose.Schema.Types.ObjectId
}, {versionKey: false});

const Order = mongoose.model("order", OrderScheme);

module.exports = Order;
