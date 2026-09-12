const WastePassport = require("../models/WastePassport");
const WasteBatch = require("../models/WasteBatch");
const Shipment = require("../models/Shipment");
const Negotiation = require("../models/Negotiation");
const CarbonRecord = require("../models/CarbonRecord");
const Facility = require("../models/Facility");

const {
    generatePassportId,
    getLifecycleStatus,
    getTrackingEventDescription
} = require("../utils/trackingUtils");


// Create Waste Passport
const createWastePassport = async (req, res) => {
    try {
        const { wasteBatchId } = req.body;

        if (!wasteBatchId) {
            return res.status(400).json({
                message: "Waste batch ID is required"
            });
        }

        const wasteBatch = await WasteBatch.findById(wasteBatchId);

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found"
            });
        }

        if (wasteBatch.generator.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to create this passport"
            });
        }

        const existingPassport = await WastePassport.findOne({
            wasteBatch: wasteBatchId
        });

        if (existingPassport) {
            return res.status(200).json({
                message: "Waste passport already exists",
                passport: existingPassport
            });
        }

        const passport = await WastePassport.create({
            wasteBatch: wasteBatch._id,
            generator: wasteBatch.generator,
            passportId: generatePassportId(),
            wasteType: wasteBatch.wasteType,
            quantity: wasteBatch.quantity,
            origin: wasteBatch.location,
            lifecycleStatus: wasteBatch.status,
            events: [
                {
                    status: wasteBatch.status,
                    description: "Waste batch registered"
                }
            ]
        });

        res.status(201).json({
            message: "Waste passport created successfully",
            passport
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create waste passport",
            error: error.message
        });
    }
};


// Get Passport by Waste Batch
const getPassportByWaste = async (req, res) => {
    try {
        const passport = await WastePassport.findOne({
            wasteBatch: req.params.wasteBatchId
        })
            .populate("wasteBatch")
            .populate("generator", "name email organization")
            .populate("facility")
            .populate("negotiation")
            .populate("shipment")
            .populate("carbonRecord");

        if (!passport) {
            return res.status(404).json({
                message: "Waste passport not found"
            });
        }

        const isGenerator =
            passport.generator._id.toString() === req.user.id;

        let isFacility = false;

        if (passport.facility) {
            const facility = await Facility.findById(
                passport.facility._id
            );

            if (
                facility &&
                facility.owner.toString() === req.user.id
            ) {
                isFacility = true;
            }
        }

        if (!isGenerator && !isFacility && req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "You are not authorized to view this passport"
            });
        }

        res.status(200).json({
            passport
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch waste passport",
            error: error.message
        });
    }
};


// Get My Passports
const getMyPassports = async (req, res) => {
    try {
        let passports = [];

        if (req.user.role === "WASTE_GENERATOR") {
            passports = await WastePassport.find({
                generator: req.user.id
            })
                .populate("facility")
                .populate("shipment")
                .populate("carbonRecord")
                .sort({ createdAt: -1 });

        } else if (req.user.role === "FACILITY") {
            const facilities = await Facility.find({
                owner: req.user.id
            }).select("_id");

            const facilityIds = facilities.map(
                (facility) => facility._id
            );

            passports = await WastePassport.find({
                facility: { $in: facilityIds }
            })
                .populate("generator", "name email organization")
                .populate("shipment")
                .populate("carbonRecord")
                .sort({ createdAt: -1 });

        } else if (req.user.role === "ADMIN") {
            passports = await WastePassport.find()
                .populate("generator", "name email organization")
                .populate("facility")
                .populate("shipment")
                .populate("carbonRecord")
                .sort({ createdAt: -1 });

        } else {
            return res.status(403).json({
                message: "You are not authorized to view passports"
            });
        }

        res.status(200).json({
            count: passports.length,
            passports
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch passports",
            error: error.message
        });
    }
};


// Update Passport from Shipment
const syncShipmentTracking = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        const shipment = await Shipment.findById(shipmentId)
            .populate("facility")
            .populate("wasteBatch");

        if (!shipment) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        const passport = await WastePassport.findOne({
            wasteBatch: shipment.wasteBatch._id
        });

        if (!passport) {
            return res.status(404).json({
                message: "Waste passport not found"
            });
        }

        const statusMap = {
            CREATED: "REGISTERED",
            ASSIGNED: "MATCHED",
            PICKUP_SCHEDULED: "COLLECTED",
            PICKED_UP: "COLLECTED",
            IN_TRANSIT: "IN_TRANSIT",
            DELIVERED: "RECEIVED"
        };

        const lifecycleStatus =
            statusMap[shipment.status] ||
            passport.lifecycleStatus;

        passport.shipment = shipment._id;
        passport.facility = shipment.facility?._id;
        passport.destination = shipment.deliveryLocation;

        passport.lifecycleStatus = lifecycleStatus;

        passport.events.push({
            status: lifecycleStatus,
            description: `Shipment status updated to ${shipment.status}`,
            timestamp: new Date()
        });

        await passport.save();

        res.status(200).json({
            message: "Waste passport tracking updated",
            passport
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to sync shipment tracking",
            error: error.message
        });
    }
};


// Sync Carbon Record
const syncCarbonRecord = async (req, res) => {
    try {
        const { wasteBatchId } = req.params;

        const passport = await WastePassport.findOne({
            wasteBatch: wasteBatchId
        });

        if (!passport) {
            return res.status(404).json({
                message: "Waste passport not found"
            });
        }

        const carbonRecord = await CarbonRecord.findOne({
            wasteBatch: wasteBatchId
        });

        if (!carbonRecord) {
            return res.status(404).json({
                message: "Carbon record not found"
            });
        }

        passport.carbonRecord = carbonRecord._id;
        passport.processingMethod =
            carbonRecord.processingMethod;

        passport.carbonImpact = {
            co2eAvoided: carbonRecord.co2eAvoided,
            carbonFactor: carbonRecord.carbonFactor
        };

        passport.lifecycleStatus = "PROCESSED";

        passport.events.push({
            status: "PROCESSED",
            description: "Waste processed and carbon impact recorded",
            timestamp: new Date()
        });

        await passport.save();

        res.status(200).json({
            message: "Carbon information added to passport",
            passport
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to sync carbon record",
            error: error.message
        });
    }
};


module.exports = {
    createWastePassport,
    getPassportByWaste,
    getMyPassports,
    syncShipmentTracking,
    syncCarbonRecord
};