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
			warningMessage: "",
			buttonHoverText: "You can't place an order if there's a forbidden combination of products."
		};
	}

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
					console.log(productsChosen);
					return;
				}

				console.log(productsChosen)
				return;
			}
		}

		// Add product object to state
		let productWithAmount = {
			productId: productId,
			productName: productName,
			amount: productAmount
		}
		productsChosen.push(productWithAmount);

		this.checkForForbiddenCombination();
		console.log(productsChosen)
	}


	checkForForbiddenCombination = () => {

		let productsChosen = this.state.shipment.productsChosen;

		for (let i = 0; i < productsChosen.length; i++) {

			// Check for forbidden combinations with Loodwater
			if (productsChosen[i].productId === 1) {
				for (let j = 0; j < productsChosen.length; j++) {
					if (productsChosen[j].productId === 3 || productsChosen[j].productId === 5 || productsChosen[j].productId === 4) {
						let warning = `${productsChosen[i].productName} mag niet met ${productsChosen[j].productName} gecombineerd worden.`
						this.buttonRef.current.setAttribute("disabled", true);
						this.setState({	warningMessage: warning })
					}
				}
			}

			// Check for forbidden combinations with Zwavelwater
			if (productsChosen[i].productId === 3) {
				for (let j = 0; j < productsChosen.length; j++) {
					if (productsChosen[j].productId === 2 || productsChosen[j].productId === 4) {
						let warning = `${productsChosen[i].productName} mag niet met ${productsChosen[j].productName} gecombineerd worden.`
						this.buttonRef.current.setAttribute("disabled", true);
						this.setState({	warningMessage: warning })
					} 
				}
			}

		}
		
	}

	// Save order in database (CORS-issue)
	submitOrder = (e) => {
		e.preventDefault();

		let orderData = {
			companyName: this.state.companyName,
			telephone: this.state.telephone,
			email: this.state.email,
			city: this.state.city,
			street: this.state.street,
			postal: this.state.postal,
			streetNumber: this.state.streetNumber,
			productsChosen: this.state.productsChosen
		}

		axios.post("http://localhost:3001/api/shipment/save", orderData)
			.then((res) => {
				if (res.data.success) {
					console.log('success')
				} else {
					console.log('Something went wrong')
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
						<input type="text" onChange={(e) => this.setState({companyName: e.target.value})}></input>
					</div>
					<div className="field">
					<label>Telephone</label><br/>
						<input type="number" onChange={(e) => this.setState({telephone: e.target.value})}></input>
					</div>
					<div className="field">
					<label>E-mail</label><br/>
						<input type="text" onChange={(e) => this.setState({email: e.target.value})}></input>
					</div>
					<div className="field">
					<label>City</label><br/>
						<input type="text" onChange={(e) => this.setState({city: e.target.value})}></input>
					</div>
					<div className="field">
					<label>Street</label><br/>
						<input type="text" onChange={(e) => this.setState({street: e.target.value})}></input>
					</div>
					<div className="field">
					<label>Postal code</label><br/>
						<input type="text" onChange={(e) => this.setState({postal: e.target.value})}></input>
					</div>
					<div className="field">
					<label>Street number</label><br/>
						<input type="text" onChange={(e) => this.setState({streetNumber: e.target.value})}></input>
					</div>
					<div id="submit-button" className="field">
						<div>
							<button ref={this.buttonRef} className="" title={this.state.buttonHoverText} type="submit">
								Place order
							</button>
						</div>
					</div>
				</div>
				</form>

			</motion.div>
			<div className="warning-section">
				<div className="warning-content">{this.state.warningMessage}</div>
			</div>
			</>
		);
	}
}

export default CreateShipment;
