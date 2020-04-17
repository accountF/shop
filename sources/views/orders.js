import {JetView} from "webix-jet";
import DescriptionForm from "./orders/descriptionForm";

export default class Orders extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "orders",
			columns: [
				{id: "productName", header: ["Product", {content: "textFilter"}], fillspace: true},
				{id: "numberOfProducts", header: "Amount", width: 200},
				{id: "address", header: "Address", width: 200},
				{id: "deliveryType", header: "Delivery type", width: 200},
				{id: "payment", header: "Payment"},
				{
					id: "orderDate",
					header: "Order date",
					width: 150,
					format: webix.i18n.longDateFormatStr
				},
				{id: "status", header: "Status"}
			],
			on: {
				onItemClick: id => this.showWindow(id)
			}
		};
	}

	init() {
		this.tableComponent = this.$$("orders");
		this.window = this.ui(DescriptionForm);
		this.updateOrderList();
	}

	urlChange() {
		this.updateOrderList();
	}

	updateOrderList() {
		webix.ajax().get("http://localhost:3000/orders").then((order) => {
			this.tableComponent.clearAll();
			this.tableComponent.parse(order);
		});
	}

	showWindow(id) {
		let item = this.tableComponent.getItem(id.row);
		if (item.status === "Declined") {
			this.window.showWindow();
		}
	}
}
