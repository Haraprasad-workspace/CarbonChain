import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import GeneratorDashboard from "../pages/generator/GeneratorDashboard";
import RegisterWaste from "../pages/generator/RegisterWaste";
import MyWaste from "../pages/generator/MyWaste";
import WasteDetailsPage from "../pages/generator/WasteDetailsPage";
import WasteMatches from "../pages/generator/WasteMatches";
import GeneratorNegotiations from "../pages/generator/Negotiations";

import FacilityDashboard from "../pages/facility/FacilityDashboard";
import RegisterFacility from "../pages/facility/RegisterFacility";
import MyFacilities from "../pages/facility/MyFacilities";
import FacilityDetailsPage from "../pages/facility/FacilityDetailsPage";
import FacilityNegotiations from "../pages/facility/Negotiations";
import NegotiationDetails from "../pages/NegotiationDetails";

import GeneratorShipments from "../pages/generator/Shipments";
import FacilityShipments from "../pages/facility/Shipments";
import ShipmentDetailsPage from "../pages/ShipmentDetailsPage";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Waste Generator */}
                <Route
                    path="/generator"
                    element={<GeneratorDashboard />}
                />
                <Route
                    path="/generator/register-waste"
                    element={<RegisterWaste />}
                />
                <Route
                    path="/generator/my-waste"
                    element={<MyWaste />}
                />
                <Route
                    path="/generator/waste/:id"
                    element={<WasteDetailsPage />}
                />
                <Route
                    path="/generator/waste/:id/matches"
                    element={<WasteMatches />}
                />
                <Route
                    path="/generator/negotiations"
                    element={<GeneratorNegotiations />}
                />

                {/* Facility */}
                <Route
                    path="/facility"
                    element={<FacilityDashboard />}
                />
                <Route
                    path="/facility/register"
                    element={<RegisterFacility />}
                />
                <Route
                    path="/facility/my-facilities"
                    element={<MyFacilities />}
                />
                <Route
                    path="/facility/:id"
                    element={<FacilityDetailsPage />}
                />
                <Route
                    path="/facility/negotiations"
                    element={<FacilityNegotiations />}
                />
                <Route
                    path="/negotiations/:id"
                    element={<NegotiationDetails />}
                />
                {/* Generator Shipments */}
            <Route
                path="/generator/shipments"
                element={<GeneratorShipments />}
            />

            {/* Facility Shipments */}
            <Route
                path="/facility/shipments"
                element={<FacilityShipments />}
            />

            {/* Shipment Details */}
            <Route
                path="/shipments/:id"
                element={<ShipmentDetailsPage />}
            />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;