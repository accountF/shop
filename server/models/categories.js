const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const CategoriesScheme = new Scheme({
	name: String,
	parentId: mongoose.Schema.Types.ObjectId
}, {versionKey: false});

const Categories = mongoose.model("categories", CategoriesScheme);

module.exports = Categories;
