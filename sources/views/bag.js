import {JetView} from "webix-jet";
import BagStorage from "../models/bagStorage";


export default class Bag extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "bagTable",
					rowHeight: 80,
					footer: true,
					columns: [
						{
							id: "image",
							header: "Image",
							template: obj => `<img src=${obj.image} class="product-image" />`
						},
						{id: "name", header: "Name", fillspace: true},
						{id: "amount", header: "Amount", fillspace: true},
						{id: "price", header: "Price"},
						{footer: "Total: "},
						{id: "sum", header: "Sum", width: 250, footer: {content: "summColumn"}},
						{id: "del", header: "", template: "{common.trashIcon()}", width: 70}
					],
					onClick: {
						"wxi-trash": (e, id) => this.deleteItem(id)
					}
				},
				{
					cols: [
						{
							view: "button",
							value: "Make Order",
							css: "webix_primary",
							click: () => this.show("./makeOrder"),
							width: 250
						},
						{}
					]
				}

			]
		};
	}

	init() {
		window.BagStorage = BagStorage;
		this.tableComponent = this.$$("bagTable");
		this.updateBag();

		this.on(this.app, "onBagChanged", () => {
			this.tableComponent.clearAll();
			this.updateBag();
		});
	}

	updateBag() {
		this.tableComponent.parse(BagStorage.getProducts());
	}

	deleteItem(id) {
		BagStorage.deleteProduct(id.row);
	}
}
