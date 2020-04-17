import {JetView} from "webix-jet";
import BagStorage from "../models/bagStorage";

export default class TopView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					padding: 3,
					css: "webix_dark",
					elements: [
						{view: "label", label: "Shop"},
						{view: "button", value: "Logout", width: 150, css: "webix_transparent"},
						{view: "button", value: "History", width: 150, css: "webix_transparent", click: () => this.show("./orders")},
						{view: "button", localId: "btnBag", value: "Bag", width: 150, css: "webix_transparent", click: () => this.show("./bag")}
					]
				},
				{
					cols: [
						{
							view: "tree",
							localId: "menu",
							select: true,
							width: 200
						},
						{$subview: true}
					]
				}
			]
		};
	}

	init() {
		this.menuComponent = this.$$("menu");
		this.btnBag = this.$$("btnBag");

		webix.ajax().get("http://localhost:3000/categories/menu").then((data) => {
			this.menuComponent.parse(data);
		});

		this.menuComponent.attachEvent("onItemClick", (newValue) => {
			this.show("./products");
			this.app.callEvent("onUserChangeMenuItem", [newValue]);
		});

		BagStorage.init();
		BagStorage.setRenderFunction((products) => {
			let numberOfProducts = BagStorage.getTotalAmount();
			window.btnBag = this.btnBag;
			if (numberOfProducts === 0) {
				this.btnBag.setValue("Bag");
			}
			else {
				this.btnBag.setValue(`Bag (${numberOfProducts})`);
			}

			this.app.callEvent("onBagChanged", []);
		});
	}
}
