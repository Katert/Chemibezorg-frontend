import React, { Component } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../Style/PlannedShipments.css";

class PlannedShipments extends Component {
	constructor() {
		super();
		this.state = {
			orders: [],
		};
	}

	componentDidMount() {
		axios
			.get("http://localhost:3001/api/shipment/all")
			.then((response) => {
				this.setState({ orders: response.data })
			})
			.catch((error) => {
				throw error;
			});
	}

	generateOrdersList = () => {
		let orders = this.state.orders;
		return orders.map((order) => {

			// Remove non-numerical characters from date
			let modifiedDate = order.date.replace('T', ' / ').replace('.000Z', ' ');

			return (
				<tr className="order-item" key={order.id}>
					<td>{order.id}</td>
					<td>{modifiedDate}</td>
					<td>{order.Customer_id}</td>
					<td><button>Show</button></td>
				</tr>
			);
		});
	};

	render() {
		return (
			<motion.div
				className="overview-section"
				initial={{ opacity: 0.5 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				<h1>Overview shipments</h1>
				<form className="order-searchbar">
					<label htmlFor="search">Search for Order ID</label><br/>
					<input type="number" id="search" name="Search for Order ID"/>
				</form>
				<br />
				<table className="orders-table">
					<thead>
						<tr>
							<th>Order ID</th>
							<th>Date/Time</th>
							<th>Customer ID</th>
							<th>Details</th>
						</tr>
					</thead>
					<tbody>
						{this.generateOrdersList()}
					</tbody>
				</table>
			</motion.div>
		);
	}
}

export default PlannedShipments;
