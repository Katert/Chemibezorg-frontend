import React, { Component } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../../Style/PlannedShipments.css";

class PlannedShipments extends Component {
	render() {
		return (
			<motion.div
				className="content-section"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<h1>Overview shipments</h1>
			</motion.div>
		);
	}
}

export default PlannedShipments;
