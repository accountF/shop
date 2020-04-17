import {JetView} from "webix-jet";

export default class DescriptionForm extends JetView {
	config() {
		return {
			view: "window",
			localId: "window",
			position: "center",
			head: {
				cols: [
					{template: "Order description", type: "header", borderless: true},
					{
						view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				template: "why?"
			}
		};
	}

	showWindow() {
		this.getRoot().show();
	}

	closeWindow() {
		this.getRoot().hide();
	}
}
