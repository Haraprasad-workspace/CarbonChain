const CarbonRecord = require("../models/CarbonRecord");
const WasteBatch = require("../models/WasteBatch");
const Facility = require("../models/Facility");

const {
    calculateCarbonImpact
} = require("../utils/carbonCalculator");


const createCarbonRecord = async (req, res) => {
    try {
        const {
            wasteBatchId,
            facilityId,
            processingMethod
        } = req.body;

        const waste = await WasteBatch.findById(wasteBatchId);

        if (!waste) {
            return res.status(404).json({
                success: false,
                message: "Waste batch not found"
            });
        }

        const facility = await Facility.findById(facilityId);

        if (!facility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found"
            });
        }

        if (waste.status !== "RECEIVED") {
            return res.status(400).json({
                success: false,
                message: "Waste must be received by the facility before carbon impact is recorded"
            });
        }

        const existingRecord = await CarbonRecord.findOne({
            wasteBatch: waste._id
        });

        if (existingRecord) {
            return res.status(400).json({
                success: false,
                message: "Carbon record already exists for this waste batch"
            });
        }

        const result = calculateCarbonImpact(
            waste.wasteType,
            waste.quantity.value,
            waste.quantity.unit,
            processingMethod
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                message: "Processing method is not supported for this waste type"
            });
        }

        const carbonRecord = await CarbonRecord.create({
            wasteBatch: waste._id,
            facility: facility._id,
            wasteType: waste.wasteType,

            quantity: {
                value: waste.quantity.value,
                unit: waste.quantity.unit
            },

            processingMethod,
            carbonFactor: result.carbonFactor,
            co2eAvoided: result.co2eAvoided,

            calculationBasis:
                `${result.carbonFactor} TON CO2e avoided per TON of waste`
        });

        // Mark waste as processed
        waste.status = "PROCESSED";
        await waste.save();

        res.status(201).json({
            success: true,
            message: "Carbon impact recorded successfully",
            carbonRecord
        });

    } catch (error) {
        console.error(
            "Create carbon record error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getCarbonRecord = async (req, res) => {
    try {
        const record = await CarbonRecord.findById(req.params.id)
            .populate("wasteBatch")
            .populate("facility");

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Carbon record not found"
            });
        }

        res.status(200).json({
            success: true,
            carbonRecord: record
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getMyCarbonRecords = async (req, res) => {
    try {
        const wasteBatches = await WasteBatch.find({
            generator: req.user._id
        }).select("_id");

        const wasteIds = wasteBatches.map(
            (waste) => waste._id
        );

        const records = await CarbonRecord.find({
            wasteBatch: { $in: wasteIds }
        })
            .populate("wasteBatch")
            .populate("facility")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            carbonRecords: records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getFacilityCarbonRecords = async (req, res) => {
    try {
        const facilities = await Facility.find({
            owner: req.user._id
        }).select("_id");

        const facilityIds = facilities.map(
            (facility) => facility._id
        );

        const records = await CarbonRecord.find({
            facility: { $in: facilityIds }
        })
            .populate("wasteBatch")
            .populate("facility")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            carbonRecords: records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getCarbonSummary = async (req, res) => {
    try {
        let records = [];

        if (req.user.role === "WASTE_GENERATOR") {
            const wasteBatches = await WasteBatch.find({
                generator: req.user.id
            }).select("_id");

            const wasteIds = wasteBatches.map(
                (waste) => waste._id
            );

            records = await CarbonRecord.find({
                wasteBatch: { $in: wasteIds }
            });

        } else if (req.user.role === "FACILITY") {
            const facilities = await Facility.find({
                owner: req.user.id
            }).select("_id");

            const facilityIds = facilities.map(
                (facility) => facility._id
            );

            records = await CarbonRecord.find({
                facility: { $in: facilityIds }
            });

        } else if (req.user.role === "ADMIN") {
            records = await CarbonRecord.find();

        } else {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view carbon summary"
            });
        }

        const totalWaste = records.reduce(
            (sum, record) => {
                const quantity =
                    record.quantity.unit === "KG"
                        ? record.quantity.value / 1000
                        : record.quantity.value;

                return sum + quantity;
            },
            0
        );

        const totalCo2eAvoided = records.reduce(
            (sum, record) =>
                sum + record.co2eAvoided,
            0
        );

        res.status(200).json({
            success: true,
            summary: {
                totalWasteProcessed: Number(
                    totalWaste.toFixed(2)
                ),
                totalCo2eAvoided: Number(
                    totalCo2eAvoided.toFixed(3)
                ),
                totalRecords: records.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createCarbonRecord,
    getCarbonRecord,
    getMyCarbonRecords,
    getFacilityCarbonRecords,
    getCarbonSummary
};