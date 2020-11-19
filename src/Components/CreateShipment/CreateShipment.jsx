import React, { Component, createRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../Style/CreateShipment.css";

class CreateShipment extends Component {

	constructor() {
		super();
		this.state = {
			shipment: {
				companyName: "",
				telephone: "",
				email: "",
				city: "",
				street: "",
				postal: "",
				streetNumber: "",
				productsChosen: [],
			},
			allProducts: [],
			buttonHoverText: "You can't place an order if there's a forbidden combination of products."
		};
	}

	// Create reference for 'Place order' button
	buttonRef = createRef();

	// Retrieve products from database
	componentDidMount() {

		axios
			.get("http://localhost:3001/api/product/all")
			.then((response) => {
				this.setState({ allProducts: response.data })
			})
			.catch((error) => {
				alert(error);
			});

	}


	generateProductList = () => {
		let products = this.state.allProducts;
		
		return products.map((product) => {

			return (
				<tr className="product-item" key={product.id}>
					<td>{product.id}</td>
					<td>{product.name}</td>
					<td><input type="number" className="product-order" onChange={(e) => this.handleAmount(product.id, product.name, e.target.value)}/></td>
				</tr>
			);
		})
	}


	handleAmount = (productId, productName, amount) => {

		// Convert amount to number
		let productAmount = Number.parseInt(amount, 10);

		// Check if product is already added to productsChosen and amount is > 0, if so, only update amount
		let productsChosen = this.state.shipment.productsChosen;
		for (let i = 0; i < productsChosen.length; i++) {
			if (productsChosen[i].productId === productId) {

				productsChosen[i].amount = productAmount;

				// Remove product from productsChosen if amount is empty or 0
				if (productsChosen[i].amount <= 0 || Number.isNaN(productsChosen[i].amount)) {
					productsChosen.splice(productsChosen.indexOf(productsChosen[i]), 1);
					// console.log(productsChosen);
					return;
				}

				// console.log(productsChosen)
				return;
			}
		}

		// Add product object to productsChosen
		let productWithAmount = {
			productId: productId,
			productName: productName,
			amount: productAmount
		}
		productsChosen.push(productWithAmount);

		this.checkForbiddenCombination();
		// console.log(this.state.shipment)
	}

	warningMessage = (chemicalOne, chemicalTwo) => {
		return `${chemicalOne} en ${chemicalTwo} mogen niet gecombineerd worden in dezelfde zending.\n\n`;
	}

	checkForbiddenCombination = () => {

		let productsChosen = this.state.shipment.productsChosen;
		let warningMessage;
		let reason;
		let explosionDanger = 'Lood en zwavel leidt tot ontploffingsgevaar.';
		let odourNuisance = 'Water en goud geeft ernstige stankoverlast.';

		for (let i = 0; i < productsChosen.length; i++) {

			// Check for forbidden combinations with Loodwater
			if (productsChosen[i].productId === 1) {
				for (let j = 0; j < productsChosen.length; j++) {

					warningMessage = this.warningMessage(productsChosen[i].productName, productsChosen[j].productName);
					if (productsChosen[j].productId === 3 || productsChosen[j].productId === 5) {
						reason = explosionDanger;
						alert(warningMessage + reason);
						this.buttonRef.current.setAttribute("disabled", true);
					} else if (productsChosen[j].productId === 4) {
						reason = odourNuisance;
						alert(warningMessage + reason);
						this.buttonRef.current.setAttribute("disabled", true);
					}
				}

			}

			// Check for forbidden combinations with Zwavelwater
			if (productsChosen[i].productId === 3) {
				for (let j = 0; j < productsChosen.length; j++) {
					warningMessage = this.warningMessage(productsChosen[i].productName, productsChosen[j].productName);
					if (productsChosen[j].productId === 2) {
						reason = odourNuisance;
						alert(warningMessage + reason);
						this.buttonRef.current.setAttribute("disabled", true);
					} else if (productsChosen[j].productId === 4) {
						reason = explosionDanger;
						alert(warningMessage + reason);
						this.buttonRef.current.setAttribute("disabled", true);
					}
				}
			}

			// Check for forbidden combinations with Loodgouduranium
			if (productsChosen[i].productId === 4) {
				for (let j = 0; j < productsChosen.length; j++) {
					warningMessage = this.warningMessage(productsChosen[i].productName, productsChosen[j].productName);
					if (productsChosen[j].productId === 5) {
						reason = explosionDanger;
						alert(warningMessage + reason);
						this.buttonRef.current.setAttribute("disabled", true);
					}
				}
			}

		}
	}


	// Save order in database
	submitOrder = (e) => {
		e.preventDefault();

		let orderData = this.state.shipment;

		axios.post("http://localhost:3001/api/shipment/save", { 
			headers: { 
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods' : 'POST',
			'Content-Type:' : 'application/json'
			},
			orderData
		})
			.then((res) => {
				if (res.data.success) {
					console.log('Success')
				} else {
					console.log(res)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	render() {
		return (
			<>
			<motion.div
				className="create-section"
				initial={{ opacity: 0.7 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				<h1>Create shipment</h1>

				<form onSubmit={this.submitOrder}>
					<h4>Choose products:</h4>
					<table className="products-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						{this.generateProductList()}
					</tbody>
				</table>
				<div className="shipment-fields">
					<div className="field">
						<label>Company</label><br/>
						<input type="text" onChange={(e) => this.setState({shipment: {...this.state.shipment, companyName: e.target.value}})}/>
					</div>
					<div className="field">
					<label>Telephone</label><br/>
						<input type="number" onChange={(e) => this.setState({shipment: {...this.state.shipment, telephone: e.target.value}})}/>
					</div>
					<div className="field">
					<label>E-mail</label><br/>
						<input type="email" onChange={(e) => this.setState({shipment: {...this.state.shipment, email: e.target.value}})}/>
					</div>
					<div className="field">
					<label>City</label><br/>
						<input type="text" onChange={(e) => this.setState({shipment: {...this.state.shipment, city: e.target.value}})}/>
					</div>
					<div className="field">
					<label>Street</label><br/>
						<input type="text" onChange={(e) => this.setState({shipment: {...this.state.shipment, street: e.target.value}})}/>
					</div>
					<div className="field">
					<label>Postal code</label><br/>
						<input type="text" onChange={(e) => this.setState({shipment: {...this.state.shipment, postal: e.target.value}})}/>
					</div>
					<div className="field">
					<label>Street number</label><br/>
						<input type="text" onChange={(e) => this.setState({shipment: {...this.state.shipment, streetNumber: e.target.value}})}/>
					</div>
				</div>
				<div className="field">
						<div>
							<button ref={this.buttonRef} className="submit-button" title={this.state.buttonHoverText} type="submit">
								Place order
							</button>
						</div>
					</div>
				</form>
			</motion.div>
			</>
		);
	}
}

export default CreateShipment;
