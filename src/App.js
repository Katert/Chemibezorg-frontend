import "./App.css";
import { HashRouter, Route } from "react-router-dom";

// Component imports
import NavBar from "./Components/NavBar/NavBar";
import SideBar from "./Components/Sidebar/SideBar";
import PlannedShipments from "./Components/PlannedShipments/PlannedShipments";
import CreateShipment from "./Components/CreateShipment/CreateShipment";

function App() {
	return (
		<HashRouter basename="/">
			<div className="App">
				<NavBar />
				<div className="main-container">
				<SideBar/>
					<div className="main-section">
						<Route
							path="/overview-shipments"
							component={PlannedShipments}
						/>
						<Route
							path="/Plan-shipment"
							component={CreateShipment}
						/>
					</div>
				</div>
			</div>
		</HashRouter>
	);
}

export default App;
