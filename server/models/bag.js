const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const BagScheme = new Scheme({
	productId: mongoose.Schema.Types.ObjectId,
	numberOfProducts: Number,
	orderId: mongoose.Schema.Types.ObjectId,
	userId: mongoose.Schema.Types.ObjectId
}, {versionKey: false});

const Bag = mongoose.model("bag", BagScheme);

module.exports = Bag;
