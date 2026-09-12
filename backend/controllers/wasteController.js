const WasteBatch = require("../models/WasteBatch");
const Facility = require("../models/Facility");

// Create Waste Batch
const createWasteBatch = async (req, res) => {
    try {
        const {
            wasteType,
            quantity,
            quality,
            location,
            availabilityDate,
            pricingType,
            askingPrice,
            description
        } = req.body;

        if (
            !wasteType ||
            !quantity?.value ||
            !availabilityDate ||
            !pricingType
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const wasteBatch = await WasteBatch.create({
            generator: req.user.id,
            wasteType,
            quantity,
            quality,
            location,
            availabilityDate,
            pricingType,
            askingPrice,
            description
        });

        // ==================== CREATE DIGITAL PASSPORT ====================

        const WastePassport = require("../models/WastePassport");
        const {
            generatePassportId
        } = require("../utils/trackingUtils");

        const passport = await WastePassport.create({
            wasteBatch: wasteBatch._id,
            generator: req.user.id,
            passportId: generatePassportId(),
            wasteType: wasteBatch.wasteType,
            quantity: {
                value: wasteBatch.quantity.value,
                unit: wasteBatch.quantity.unit
            },
            lifecycleStatus: "REGISTERED",
            origin: {
                address: location?.address,
                city: location?.city,
                state: location?.state,
                pincode: location?.pincode,
                latitude: location?.latitude,
                longitude: location?.longitude
            },
            events: [
                {
                    status: "REGISTERED",
                    description:
                        "Waste batch registered on CarbonChain"
                }
            ]
        });

        res.status(201).json({
            message: "Waste batch registered successfully",
            wasteBatch,
            passport
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to register waste",
            error: error.message
        });
    }
};

// Get All Waste Batches of Current Generator
const getMyWasteBatches = async (req, res) => {
    try {
        const wasteBatches = await WasteBatch.find({
            generator: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: wasteBatches.length,
            wasteBatches
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch waste batches",
            error: error.message
        });
    }
};


// Get Single Waste Batch
const getWasteBatch = async (req, res) => {
    try {
        const wasteBatch = await WasteBatch.findOne({
            _id: req.params.id,
            generator: req.user.id
        });

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found"
            });
        }

        res.status(200).json({
            wasteBatch
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch waste batch",
            error: error.message
        });
    }
};


// Update Waste Batch
const updateWasteBatch = async (req, res) => {
    try {
        const wasteBatch = await WasteBatch.findOneAndUpdate(
            {
                _id: req.params.id,
                generator: req.user.id,
                status: "REGISTERED"
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found or cannot be updated"
            });
        }

        res.status(200).json({
            message: "Waste batch updated successfully",
            wasteBatch
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update waste batch",
            error: error.message
        });
    }
};


// Cancel Waste Batch
const cancelWasteBatch = async (req, res) => {
    try {
        const wasteBatch = await WasteBatch.findOneAndUpdate(
            {
                _id: req.params.id,
                generator: req.user.id,
                status: {
                    $in: ["REGISTERED", "MATCHED"]
                }
            },
            {
                status: "CANCELLED"
            },
            {
                new: true
            }
        );

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found or cannot be cancelled"
            });
        }

        res.status(200).json({
            message: "Waste batch cancelled successfully",
            wasteBatch
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel waste batch",
            error: error.message
        });
    }
};

const getReceivedWasteBatches = async (req, res) => {
    try {
        const facilities = await Facility.find({
            owner: req.user.id
        }).select("_id");

        const facilityIds = facilities.map(
            (facility) => facility._id
        );

        const wasteBatches = await WasteBatch.find({
            facility: { $in: facilityIds },
            status: "RECEIVED"
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            count: wasteBatches.length,
            wasteBatches
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch received waste batches",
            error: error.message
        });
    }
};

module.exports = {
    createWasteBatch,
    getMyWasteBatches,
    getWasteBatch,
    updateWasteBatch,
    cancelWasteBatch,
    getReceivedWasteBatches
};