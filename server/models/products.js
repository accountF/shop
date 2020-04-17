const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const ProductsScheme = new Scheme({
	image: String,
	name: String,
	price: Number,
	rating: String,
	amount: Number,
	categoryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "categories"
	}
}, {versionKey: false});

const Products = mongoose.model("products", ProductsScheme);

module.exports = Products;
