const Shipment = require("../models/Shipment");
const WasteBatch = require("../models/WasteBatch");
const Negotiation = require("../models/Negotiation");
const { optimizeRoute } = require("../utils/routeOptimizer");

const createShipment = async (req, res) => {
    try {
        const { negotiationId, pickupDate } = req.body;

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

        if (!waste?.location?.latitude || !waste?.location?.longitude) {
            return res.status(400).json({
                success: false,
                message: "Waste pickup location coordinates are missing"
            });
        }

        if (
            !facility?.location?.latitude ||
            !facility?.location?.longitude
        ) {
            return res.status(400).json({
                success: false,
                message: "Facility location coordinates are missing"
            });
        }

        // Calculate route and estimated travel time
        const route = optimizeRoute(
            waste.location,
            facility.location
        );

        // Prevent duplicate shipment for the same negotiation
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

            pickupDate,
            status: "CREATED"
        });

        // Update waste status
        waste.status = "COLLECTED";
        await waste.save();

        res.status(201).json({
            success: true,
            message: "Shipment created successfully",
            shipment
        });

    } catch (error) {
        console.error("Create shipment error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getMyShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find({
            $or: [
                { generator: req.user._id },
                { logisticsProvider: req.user._id }
            ]
        })
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone"
            )
            .populate(
                "logisticsProvider",
                "name phone"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            shipments
        });

    } catch (error) {
        console.error("Get shipments error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate("wasteBatch")
            .populate("facility")
            .populate(
                "generator",
                "name organization phone"
            )
            .populate(
                "logisticsProvider",
                "name phone"
            );

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        res.status(200).json({
            success: true,
            shipment
        });

    } catch (error) {
        console.error("Get shipment error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


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

        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        shipment.logisticsProvider = logisticsProviderId;
        shipment.vehicleNumber = vehicleNumber;
        shipment.driverName = driverName;
        shipment.driverPhone = driverPhone;
        shipment.status = "ASSIGNED";

        await shipment.save();

        const updatedShipment = await Shipment.findById(shipment._id)
            .populate("wasteBatch")
            .populate("facility")
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
            message: error.message
        });
    }
};


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

        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: "Shipment not found"
            });
        }

        shipment.status = status;

        // Update waste lifecycle
        if (status === "PICKED_UP") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                { status: "COLLECTED" }
            );
        }

        if (status === "IN_TRANSIT") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                { status: "IN_TRANSIT" }
            );
        }

        if (status === "DELIVERED") {
            shipment.deliveredDate = new Date();

            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                { status: "RECEIVED" }
            );
        }

        if (status === "CANCELLED") {
            await WasteBatch.findByIdAndUpdate(
                shipment.wasteBatch,
                { status: "CANCELLED" }
            );
        }

        await shipment.save();

        res.status(200).json({
            success: true,
            message: "Shipment status updated successfully",
            shipment
        });

    } catch (error) {
        console.error(
            "Update shipment status error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: error.message
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