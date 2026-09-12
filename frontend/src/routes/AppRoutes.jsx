import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Generator Pages
import GeneratorDashboard from "../pages/generator/GeneratorDashboard";
import RegisterWaste from "../pages/generator/RegisterWaste";
import MyWaste from "../pages/generator/MyWaste";
import WasteDetailsPage from "../pages/generator/WasteDetailsPage";
import WasteMatches from "../pages/generator/WasteMatches";
import GeneratorNegotiations from "../pages/generator/Negotiations";
import GeneratorShipments from "../pages/generator/Shipments";
import GeneratorCarbonTracking from "../pages/generator/CarbonTracking";

// Facility Pages
import FacilityDashboard from "../pages/facility/FacilityDashboard";
import RegisterFacility from "../pages/facility/RegisterFacility";
import MyFacilities from "../pages/facility/MyFacilities";
import FacilityDetailsPage from "../pages/facility/FacilityDetailsPage";
import FacilityNegotiations from "../pages/facility/Negotiations";
import FacilityShipments from "../pages/facility/Shipments";
import FacilityCarbonTracking from "../pages/facility/CarbonTracking";

// Common Pages
import NegotiationDetails from "../pages/NegotiationDetails";
import ShipmentDetailsPage from "../pages/ShipmentDetailsPage";


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================== AUTH ==================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================== GENERATOR ==================== */}

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

                <Route
                    path="/generator/shipments"
                    element={<GeneratorShipments />}
                />

                <Route
                    path="/generator/carbon"
                    element={<GeneratorCarbonTracking />}
                />


                {/* ==================== FACILITY ==================== */}

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

                {/* Specific routes MUST come before /facility/:id */}

                <Route
                    path="/facility/negotiations"
                    element={<FacilityNegotiations />}
                />

                <Route
                    path="/facility/shipments"
                    element={<FacilityShipments />}
                />

                <Route
                    path="/facility/carbon"
                    element={<FacilityCarbonTracking />}
                />

                <Route
                    path="/facility/:id"
                    element={<FacilityDetailsPage />}
                />


                {/* ==================== NEGOTIATION ==================== */}

                <Route
                    path="/negotiations/:id"
                    element={<NegotiationDetails />}
                />


                {/* ==================== SHIPMENTS ==================== */}

                <Route
                    path="/shipments/:id"
                    element={<ShipmentDetailsPage />}
                />

            </Routes>
        </BrowserRouter>
    );
};


export default AppRoutes;