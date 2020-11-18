import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../Style/SideBar.css";

import {BsCalendar} from 'react-icons/bs';
import {AiFillPlusCircle} from 'react-icons/ai';

function SideBar() {
	const [active, setActive] = useState("home");

	return (
		<div className="sidebar">
			<div className="sidebar-menu">
				<div onClick={() => setActive("plan")} className="sidebar-link-container">
					<Link to="/plan-shipment" className={active === "plan" ? "sidebar-item active" : "sidebar-item"}>
						<AiFillPlusCircle style={{fontSize:'12px'}}/> <span style={{marginLeft: '2px'}}>Create shipment</span>
					</Link>
				</div>
				<div onClick={() => setActive("overview")} className="sidebar-link-container">
					<Link to="/overview-shipments" className={active === "overview" ? "sidebar-item active" : "sidebar-item"}>
						<BsCalendar style={{fontSize:'12px'}}/> <span style={{marginLeft: '2px'}}>Overview shipments</span>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default SideBar;
