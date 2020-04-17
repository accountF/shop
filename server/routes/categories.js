const express = require("express");
const Categories = require("../models/categories");

const router = express.Router();

router.get("/menu", (req, res) => {
	let promises = [];
	let result = [];
	Categories.find({parentId: null}).then((categories) => {
		categories.map((category) => {
			let parentCategory = {
				id: category._id,
				value: category.name
			};
			let data = [];
			promises.push(Categories.find({parentId: category._id}).then((categories) => {
				categories.map((category) => {
					let childCategory = {
						id: category._id,
						value: category.name
					};
					data.push(childCategory);
				});

				parentCategory.data = data;
				result.push(parentCategory);
			}));
		});
		Promise.all(promises).then(() => {
			res.send(result);
		});
	});
});

module.exports = router;
