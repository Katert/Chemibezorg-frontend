import React from "react";
import { motion } from "framer-motion";

function CreateShipment() {
	return (
		<motion.div
			className="content-section"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<h1>Plan shipment</h1>
		</motion.div>
	);
}

export default CreateShipment;
