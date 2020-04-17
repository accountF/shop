import {JetView} from "webix-jet";

export default class Authorization extends JetView {
	config() {
		return {
			view: "window",
			localId: "descriptionWindow",
			position: "center",
			width: 400,
			height: 300,
			head: {
				cols: [
					{
						template: "#productName#",
						localId: "windowHeader",
						type: "header",
						borderless: true
					},
					{
						view: "icon",
						icon: "wxi-close",
						tooltip: "Close window",
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				localId: "productsDescription",
				template: obj => `<div>
					<img src=${obj.image} class="descriptionImage"/>
					<p>Name: ${obj.name}</p>
					<p>Price: ${obj.price}$</p>
					<p>Rating: ${obj.rating} <span class="mdi mdi-star-outline"></span></p>
				</div>`,
				onClick: {
					"mdi-star-outline": () => this.changeRating()
				}
			}
		};
	}

	init() {
		this.windowComponent = this.$$("descriptionWindow");
		this.templateComponent = this.$$("productsDescription");
		this.data = null;
	}

	showWindow(id) {
		this.getRoot().show();
		webix.ajax().get(`http://localhost:3000/products/description/${id.row}`).then((data) => {
			this.templateComponent.parse(data);
			this.data = data.json();
			this.$$("windowHeader").setValues({productName: this.data.name});
		});
	}

	closeWindow() {
		this.windowComponent.hide();
	}

	changeRating() {
		let newRating = +this.data.rating + 1;
		webix.ajax().put(`http://localhost:3000/products/changeRating/${this.data._id}`, {rating: newRating}).then((data) => {
			this.data = data.json();
			this.templateComponent.parse(data);
			this.app.callEvent("onRatingChange", []);
		});
	}
}
