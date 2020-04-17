class BagStorage {
	constructor() {
		this.products = [];
	}

	addProduct(id, amount) {
		webix.ajax().post("/bag/", {productId: id, numberOfProducts: amount}).then(() => {
			this.pullProductsAndRender();
		});
	}

	deleteProduct(id) {
		webix.ajax().del(`/bag/${id}`).then(() => {
			this.pullProductsAndRender();
		});
	}

	setRenderFunction(func) {
		this.renderFunction = func;
	}

	getProducts() {
		return this.products;
	}

	render() {
		this.renderFunction(this.products);
	}

	init() {
		this.pullProductsAndRender();
	}

	pullProductsAndRender() {
		webix.ajax().get("/bag/").then((products) => {
			this.products = products.json();
			this.render();
		});
	}

	getTotalAmount() {
		let numberOfProducts = this.products.map(product => product.amount);
		numberOfProducts = numberOfProducts.reduce((a, b) => a + b, 0);
		return numberOfProducts;
	}

	order(orderInfo) {
		webix.ajax().post("/bag/makeOrder", orderInfo).then(() => {
			this.pullProductsAndRender();
		});
	}
}

export default new BagStorage();
