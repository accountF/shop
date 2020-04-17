import {JetView} from "webix-jet";
import BagStorage from "../models/bagStorage";

export default class MakeOrder extends JetView {
	config() {
		return {
			view: "form",
			localId: "form",
			elements: [
				{
					view: "text",
					label: "Your name",
					name: "userName",
					labelWidth: 150,
					required: true,
					invalidMessage: "Name can not be empty"
				},
				{
					view: "text",
					label: "Email",
					name: "userEmail",
					labelWidth: 150,
					required: true,
					invalidMessage: "Incorrect email"
				},
				{
					view: "text",
					label: "Phone",
					name: "phone",
					labelWidth: 150,
					required: true,
					invalidMessage: "Incorrect phone",
					pattern: {mask: "+###(##)###-##-##", allow: /[0-9]/g}
				},
				{
					view: "select",
					label: "Delivery type",
					name: "deliveryType",
					labelWidth: 150,
					options: ["Master", "Ne Master"]
				},
				{
					view: "text",
					label: "Delivery address",
					name: "address",
					labelWidth: 150,
					required: true,
					invalidMessage: "Address can not be empty"
				},
				{
					view: "select",
					label: "Payment type",
					name: "payment",
					labelWidth: 150,
					options: ["Card", "Cash"]
				},
				{view: "button", value: "Checkout", css: "webix_primary", click: () => this.checkout()},
				{}
			],
			rules: {
				userName: webix.rules.isNotEmpty,
				userEmail: value => webix.rules.isNotEmpty(value) && webix.rules.isEmail(value),
				phone: webix.rules.isNotEmpty,
				address: webix.rules.isNotEmpty
			}
		};
	}


	init() {
		this.formComponent = this.$$("form");
	}

	checkout() {
		if (!this.formComponent.validate()) {
			webix.message("Please check fields");
		}
		else {
			let dataFromUser = this.formComponent.getValues();
			dataFromUser.orderDate = new Date().toISOString().slice(0, 10);
			dataFromUser.status = "In process";
			BagStorage.order(dataFromUser);
			webix.message("Order is successfully saved");
			this.show("./orders");
		}
	}
}
