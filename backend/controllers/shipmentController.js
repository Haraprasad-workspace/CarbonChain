const Shipment = require("../models/Shipment");
const WasteBatch = require("../models/WasteBatch");
const Negotiation = require("../models/Negotiation");
const User = require("../models/User");
const Facility = require("../models/Facility");
const { optimizeRoute } = require("../utils/routeOptimizer");


// ============================================================
// CREATE SHIPMENT
// ============================================================

const createShipment = async (req, res) => {
    try {
        const { negotiationId, pickupDate } = req.body;

        if (!negotiationId) {
            return res.status(400).json({
                success: false,
                message: "Negotiation ID is required"
            });
        }

        const negotiation = await Negotiation.findById(negotiationId)
            .populate("wasteBatch")
            .populate("facility");

        if (!negotiation) {
            return res.status(404).json({
                success: false,
                message: "Negotiation not found"
            });
        }

        if (negotiation.status !== "ACCEPTED") {
            return res.status(400).json({
                success: false,
                message: "Shipment can only be created after negotiation is accepted"
            });
        }

        // Only the waste generator can create the shipment
        if (
            negotiation.generator.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to create this shipment"
            });
        }

        const waste = negotiation.wasteBatch;
        const facility = negotiation.facility;

        if (!waste) {
            return res.status(404).json({
                success: false,
                message: "Waste batch not found"
            });
        }

        if (!facility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found"
            });
        }

        // Validate pickup coordinates
        if (
            waste.location?.latitude === undefined ||
            waste.location?.longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Waste pickup location coordinates are missing"
            });
        }

        // Validate delivery coordinates
        if (
            facility.location?.latitude === undefined ||
            facility.location?.longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Facility location coordinates are missing"
            });
        }

        // Prevent duplicate shipment
        const existingShipment = await Shipment.findOne({
            negotiation: negotiation._id
        });

        if (existingShipment) {
            return res.status(400).json({
                success: false,
                message: "Shipment already exists for this negotiation",
                shipment: existingShipment
            });
        }

        // Calculate route
        const route = optimizeRoute(
            waste.location,
            facility.location
        );

        const shipment = await Shipment.create({
            wasteBatch: waste._id,
            negotiation: negotiation._id,
            generator: negotiation.generator,
            facility: facility._id,

            pickupLocation: {
                address: waste.location.address,
                city: waste.location.city,
                state: waste.location.state,
                pincode: waste.location.pincode,
                latitude: waste.location.latitude,
                longitude: waste.location.longitude
            },

            deliveryLocation: {
                address: facility.location.address,
                city: facility.location.city,
                state: facility.location.state,
                pincode: facility.location.pincode,
                latitude: facility.location.latitude,
                longitude: facility.location.longitude
            },

            route: {
                distance: route.distance,
                estimatedTime: route.estimatedTime
            },

            pickupDate: pickupDate || null,
            status: pickupDate
                ? "PICKUP_SCHEDULED"
                : "CREATED"
        });

        // IMPORTANT:
        // Do NOT mark waste as COLLECTED here.
        // Waste becomes COLLECTED only when pickup actually happens.

        res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            shipment
        });

    } catch (error) {
        console.error(
            "Create shipment error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to create shipment"
        });
    }
};


// ============================================================
// GET MY SHIPMENTS
// ============================================================

const getMyShipments = async (req, res) => {
    try {

        console.log("\n================ SHIPMENT DEBUG ================");
        console.log("Logged-in User ID:", req.user._id);
        console.log("Logged-in User Role:", req.user.role);

        let query = {};

        // WASTE GENERATOR
        if (req.user.role === "WASTE_GENERATOR") {

            query.generator = req.user._id;

            console.log("Role: WASTE_GENERATOR");
            console.log("Searching shipments with generator ID:");
            console.log(req.user._id);
        }

        // LOGISTICS PROVIDER
        else if (req.user.role === "LOGISTICS_PROVIDER") {

            query.logisticsProvider = req.user._id;

            console.log("Role: LOGISTICS_PROVIDER");
            console.log("Searching shipments with logisticsProvider ID:");
            console.log(req.user._id);
        }

        // FACILITY
        else if (req.user.role === "FACILITY") {

            console.log("Role: FACILITY");
            console.log("Searching facilities owned by:");
            console.log(req.user._id);

            const facilities = await Facility.find({
                owner: req.user._id
            }).select("_id");

            console.log("Facilities found:");
            console.log(facilities);

            const facilityIds = facilities.map(
                (facility) => facility._id
            );

            console.log("Facility IDs:");
            console.log(facilityIds);

            query.facility = {
                $in: facilityIds
            };
        }

        // ADMIN
        else if (req.user.role === "ADMIN") {

            query = {};

            console.log("Role: ADMIN");
            console.log("Searching ALL shipments");
        }

        // INVALID ROLE
        else {

            console.log("Unauthorized role:", req.user.role);

            return res.status(403).json({
                success: false,
                message: "Not authorized to view shipments"
            });
        }

        console.log("Final MongoDB Query:");
        console.log(query);

        // SEARCH SHIPMENTS
        const shipments = await Shipment.find(query)
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone email"
            )
            .populate(
                "logisticsProvider",
                "name phone organization email"
            )
            .sort({ createdAt: -1 });

        console.log("Shipments Found:", shipments.length);
        console.log("Shipment IDs:");

        shipments.forEach((shipment) => {
            console.log({
                shipmentId: shipment._id,
                generator: shipment.generator?._id,
                facility: shipment.facility?._id,
                logisticsProvider: shipment.logisticsProvider?._id,
                status: shipment.status
            });
        });

        console.log("================================================\n");

        res.status(200).json({
            success: true,
            count: shipments.length,
            shipments
        });

    } catch (error) {

        console.error(
            "Get shipments error:",
            error.message
        );

        console.error("Full error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve shipments"
        });
    }
};


// ============================================================
// GET SINGLE SHIPMENT
// ============================================================

const getShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone email"
            )
            .populate(
                "logisticsProvider",
                "name phone organization email"
            );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        let authorized = false;

        // Generator
        if (
            req.user.role === "WASTE_GENERATOR" &&
            shipment.generator?._id.toString() ===
            req.user._id.toString()
        ) {
            authorized = true;
        }

        // Logistics provider
        if (
            req.user.role === "LOGISTICS_PROVIDER" &&
            shipment.logisticsProvider?._id.toString() ===
            req.user._id.toString()
        ) {
            authorized = true;
        }

        // Facility owner
        if (req.user.role === "FACILITY") {
            const facility = await Facility.findOne({
                _id: shipment.facility?._id,
                owner: req.user._id
            });

            if (facility) {
                authorized = true;
            }
        }

        // Municipality/Admin access
        if (
            req.user.role === "MUNICIPALITY" ||
            req.user.role === "ADMIN"
        ) {
            authorized = true;
        }

        if (!authorized) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this shipment"
            });
        }

        res.status(200).json({
            success: true,
            shipment
        });

        console.log(shipment)

    } catch (error) {
        console.error(
            "Get shipment error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to retrieve shipment"
        });
    }
};


// ============================================================
// ASSIGN LOGISTICS PROVIDER
// ============================================================

const assignLogisticsProvider = async (req, res) => {
    try {
        const {
            logisticsProviderId,
            vehicleNumber,
            driverName,
            driverPhone
        } = req.body;

        if (!logisticsProviderId) {
            return res.status(400).json({
                success: false,
                message: "Logistics provider ID is required"
            });
        }

        const shipment = await Shipment.findById(
            req.params.id
        );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        // Only generator, facility or admin can assign
        if (
            req.user.role !== "ADMIN" &&
            req.user.role !== "WASTE_GENERATOR" &&
            req.user.role !== "FACILITY"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to assign logistics provider"
            });
        }

        // Verify logistics provider
        const provider = await User.findOne({
            _id: logisticsProviderId,
            role: "LOGISTICS_PROVIDER",
            accountStatus: { $ne: "SUSPENDED" }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Valid logistics provider not found"
            });
        }

        // Generator ownership check
        if (req.user.role === "WASTE_GENERATOR") {
            if (
                shipment.generator.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to assign this shipment"
                });
            }
        }

        // Facility ownership check
        if (req.user.role === "FACILITY") {
            const facility = await Facility.findOne({
                _id: shipment.facility,
                owner: req.user._id
            });

            if (!facility) {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to assign this shipment"
                });
            }
        }

        shipment.logisticsProvider = provider._id;

        if (vehicleNumber !== undefined) {
            shipment.vehicleNumber = vehicleNumber;
        }

        if (driverName !== undefined) {
            shipment.driverName = driverName;
        }

        if (driverPhone !== undefined) {
            shipment.driverPhone = driverPhone;
        }

        shipment.status = "ASSIGNED";

        await shipment.save();

        const updatedShipment = await Shipment.findById(
            shipment._id
        )
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone"
            )
            .populate(
                "logisticsProvider",
                "name phone organization"
            );

        res.status(200).json({
            success: true,
            message: "Logistics provider assigned successfully",
            shipment: updatedShipment
        });

    } catch (error) {
        console.error(
            "Assign logistics provider error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to assign logistics provider"
        });
    }
};


// ============================================================
// UPDATE SHIPMENT STATUS
// ============================================================

const updateShipmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "CREATED",
            "ASSIGNED",
            "PICKUP_SCHEDULED",
            "PICKED_UP",
            "IN_TRANSIT",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid shipment status"
            });
        }

        const shipment = await Shipment.findById(
            req.params.id
        );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        // Only assigned logistics provider or admin
        if (req.user.role === "LOGISTICS_PROVIDER") {
            if (
                !shipment.logisticsProvider ||
                shipment.logisticsProvider.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "This shipment is not assigned to you"
                });
            }
        }

        else if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update shipment status"
            });
        }

        // Logical status transition validation
        const currentStatus = shipment.status;

        const transitions = {
            CREATED: ["ASSIGNED", "PICKUP_SCHEDULED", "CANCELLED"],
            ASSIGNED: ["PICKUP_SCHEDULED", "PICKED_UP", "CANCELLED"],
            PICKUP_SCHEDULED: ["PICKED_UP", "CANCELLED"],
            PICKED_UP: ["IN_TRANSIT", "CANCELLED"],
            IN_TRANSIT: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: []
        };

        if (
            currentStatus !== status &&
            !transitions[currentStatus]?.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message: `Cannot change shipment status from ${currentStatus} to ${status}`
            });
        }

        shipment.status = status;

        // Pickup completed
        if (status === "PICKED_UP") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                {
                    status: "COLLECTED"
                }
            );
        }

        // Waste is in transportation
        if (status === "IN_TRANSIT") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                {
                    status: "IN_TRANSIT"
                }
            );
        }

        // Waste delivered to facility
        if (status === "DELIVERED") {
            shipment.deliveredDate = new Date();

            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                {
                    facility: shipment.facility,
                    status: "RECEIVED"
                }
            );
        }

        // Shipment cancelled
        if (status === "CANCELLED") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                {
                    status: "CANCELLED"
                }
            );
        }

        await shipment.save();

        const updatedShipment = await Shipment.findById(
            shipment._id
        )
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone"
            )
            .populate(
                "logisticsProvider",
                "name phone organization"
            );

        res.status(200).json({
            success: true,
            message: "Shipment status updated successfully",
            shipment: updatedShipment
        });

    } catch (error) {
        console.error(
            "Update shipment status error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Failed to update shipment status"
        });
    }
};


module.exports = {
    createShipment,
    getMyShipments,
    getShipment,
    assignLogisticsProvider,
    updateShipmentStatus
};