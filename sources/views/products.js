import {JetView} from "webix-jet";
import productsDescription from "./products/productsDescription";
import BagStorage from "../models/bagStorage";

export default class Products extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "products",
			rowHeight: 80,
			type: {
				myCounter: (obj, common, value, column, index) => {
					let html = "<div class='webix_el_group' style='width:92px; height:32px;'>";
					html += "<button type='button' class='webix_inp_counter_prev' tabindex='-1' >-</button>";
					html += `<input type='text' readonly class='webix_inp_counter_value' style='height:28px;' value='${value}'></input>`;
					html += "<button type='button' class='webix_inp_counter_next' tabindex='-1'>+</button></div>";
					return html;
				}
			},
			columns: [
				{
					id: "image",
					header: "Image",
					template: obj => `<img src=${obj.image} class="product-image" />`
				},
				{id: "name", header: ["Name", {content: "textFilter"}], fillspace: true},
				{id: "price", header: "Price", fillspace: true},
				{id: "rating", header: "Rating", fillspace: true},
				{id: "amount", header: "Amount", template: "{common.myCounter()}", width: 200},
				{id: "buy", header: "Buy", template: "<span class='mdi mdi-cart'></span>"}
			],
			onClick: {
				"mdi-cart": (e, id) => this.addInBag(id),
				"webix_inp_counter_prev": function (e, id) {
					let item = this.getItem(id.row);
					if (item[id.column] > 0) {
						item[id.column] -= 1;
						this.updateItem(id.row);
					}
				},
				"webix_inp_counter_next": function (e, id) {
					let item = this.getItem(id.row);
					if (item[id.column] >= 0) {
						item[id.column] += 1;
						this.updateItem(id.row);
					}
				}
			}
		};
	}

	loadProductsForTable(categoryId) {
		webix.ajax().get(`http://localhost:3000/products/forTable/${categoryId}`).then((data) => {
			this.tableComponent.clearAll();
			this.tableComponent.parse(data);
		});
	}

	init() {
		this.tableComponent = this.$$("products");
		this.window = this.ui(productsDescription);

		this.on(this.app, "onUserChangeMenuItem", (categoryId) => {
			this.categoryId = categoryId;
			this.loadProductsForTable(this.categoryId);
		});

		this.tableComponent.attachEvent("onItemDblClick", (id) => {
			this.window.showWindow(id);
		});

		this.on(this.app, "onRatingChange", () => {
			this.loadProductsForTable(this.categoryId);
		});
	}

	addInBag(id) {
		let product = this.tableComponent.getItem(id.row);
		if (product.amount !== 0) {
			webix.message(`${product.amount} ${product.name} has been added to you bag`);
			BagStorage.addProduct(product.id, product.amount);
		}
		else {
			webix.message("Before add item in bag change amount of products");
		}
	}
}
