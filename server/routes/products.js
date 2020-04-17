const express = require("express");
const Products = require("../models/products");
const Categories = require("../models/categories");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

function getParentPlusChildCategories(parentCategoryId, callback) {
	let promises = [];
	const result = [];
	result.push(parentCategoryId);
	Categories.find({_id: ObjectId(parentCategoryId)}).then((categories) => {
		categories.map((category) => {
			promises.push(Categories.find({parentId: category._id}).then((categories) => {
				categories.map((category) => {
					result.push(category._id);
				});
			}));
		});
		Promise.all(promises).then(() => {
			callback(result);
		});
	});
}

router.get("/forTable/:id", (req, res) => {
	getParentPlusChildCategories(req.params.id, (catIds) => {
		Products.find({categoryId: {$in: catIds}}).then((products) => {
			let results = [];
			products.map((product) => {
				let result = {
					id: product._id,
					image: product.image,
					name: product.name,
					price: product.price,
					rating: product.rating,
					amount: product.amount
				};
				results.push(result);
			});
			res.send(results);
		});
	});
});


router.get("/description/:id", (req, res) => {
	Products.findOne({_id: ObjectId(req.params.id)}).then((product) => {
		res.send(product);
	});
});

router.put("/changeRating/:id", (req, res) => {
	Products.findByIdAndUpdate({_id: ObjectId(req.params.id)}, req.body).then(() => {
		Products.findOne({_id: ObjectId(req.params.id)}).then((product) => {
			res.send(product);
		});
	});
});

module.exports = router;
