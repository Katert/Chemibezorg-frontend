/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "../../Style/NavBar.css";
import {FaTruck} from 'react-icons/fa';

function NavBar() {
	return (
		<div className="navbar">
			<div className="navbar-title">
				<h1><FaTruck style={{fontSize: '20px'}}/> Chemibezorg</h1>
			</div>
		</div>
	);
}

export default NavBar;
