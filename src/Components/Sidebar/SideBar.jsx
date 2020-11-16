import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Style/SideBar.css";

function SideBar() {
	const [active, setActive] = useState("home");

	return (
		<div className="sidebar">
			<div className="sidebar-menu">
				<div onClick={() => setActive("plan")} className="sidebar-link-container">
					<Link to="/plan-shipment" className={active === "plan" ? "sidebar-item active" : "sidebar-item"}>
						Plan shipment
					</Link>
				</div>
				<div onClick={() => setActive("overview")} className="sidebar-link-container">
					<Link to="/overview-shipments" className={active === "overview" ? "sidebar-item active" : "sidebar-item"}>
						Overview shipments
					</Link>
				</div>
			</div>
		</div>
	);
}

export default SideBar;
