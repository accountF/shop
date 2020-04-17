import {JetView} from "webix-jet";

export default class Auth extends JetView {
	config() {
		return {
			rows: [
				{
					view: "toolbar",
					padding: 3,
					css: "webix_dark",
					elements: [
						{view: "label", label: "Shop"},
						{
							view: "button",
							value: "Sign in",
							width: 200,
							click: () => this.showFormsigninOrsignup("Sign in")
						},
						{
							view: "button",
							value: "Sign up",
							width: 200,
							click: () => this.showFormsigninOrsignup("Sign up")
						},
						{}
					]
				},
				{
					rows: [
						{},
						{
							cols: [
								{},
								{
									view: "form",
									localId: "form",
									elements: [
										{
											view: "text",
											name: "formType",
											localId: "formType",
											hidden: true
										},
										{
											view: "text",
											label: "Name",
											name: "name",
											localId: "userName",
											labelWidth: 150,
											width: 500
										},
										{
											view: "text",
											label: "Email",
											name: "email",
											labelWidth: 150,
											width: 500
										},
										{
											view: "text",
											label: "Password",
											name: "password",
											labelWidth: 150,
											width: 500
										},
										{
											view: "text",
											label: "Repeat password",
											name: "repeatedPassword",
											localId: "repeatedPassword",
											labelWidth: 150,
											width: 500
										},
										{
											cols: [
												{},
												{
													view: "button",
													value: "Sign in",
													localId: "btnLogin",
													width: 200,
													click: () => this.signinOrSignup()
												},
												{}
											]
										}
									],
									rules: {
										email: webix.rules.isEmail
									}
								},
								{}
							]
						},
						{}
					]

				}

			]
		};
	}

	init() {
		this.formComponent = this.$$("form");
		this.btnInForm = this.$$("btnLogin");
		this.btnRepeatedPassword = this.$$("repeatedPassword");
		this.formType = this.$$("formType");
		this.userName = this.$$("userName");

		this.formComponent.hide();
	}

	showFormsigninOrsignup(type) {
		this.formComponent.show();

		if (type === "Sign in") {
			this.btnRepeatedPassword.hide();
			this.userName.hide();
		}
		else {
			this.btnRepeatedPassword.show();
			this.userName.show();
		}

		this.formType.setValue(type);
		this.btnInForm.setValue(type);
	}

	signIn(userData) {
		webix.ajax().post("/users/signin", userData).then((data) => {
			let result = data.json();
			if (result) {
				this.formComponent.clear();
				this.show("/top");
			}
			else {
				webix.message("Sign up please or check your data");
			}
		});
	}

	signUp(userData) {
		if (userData.password === userData.repeatedPassword) {
			webix.ajax().post("/users/signup", userData).then((data) => {
				let result = data.text();
				if (result) {
					webix.message("Success");
					this.formComponent.clear();
					this.showFormsigninOrsignup("Sign in");
				}
				else {
					webix.message("Login existed");
				}
			});
		}
		else {
			webix.message("Please, check password");
		}
	}

	signinOrSignup() {
		if (this.formComponent.validate()) {
			let dataFromForm = this.formComponent.getValues();
			if (dataFromForm.formType === "Sign in") {
				this.signIn(dataFromForm);
			}
			else if (dataFromForm.formType === "Sign up") {
				this.signUp(dataFromForm);
			}
		}
	}
}
