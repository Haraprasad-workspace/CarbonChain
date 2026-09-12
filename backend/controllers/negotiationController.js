const Negotiation = require("../models/Negotiation");
const WasteBatch = require("../models/WasteBatch");
const Facility = require("../models/Facility");
const WasteMatch = require("../models/WasteMatch");

// Create Negotiation
const createNegotiation = async (req, res) => {
    try {
        const {
            wasteBatchId,
            facilityId,
            initialOffer,
            message
        } = req.body;

        if (
            !wasteBatchId ||
            !facilityId ||
            initialOffer === undefined
        ) {
            return res.status(400).json({
                message: "Waste batch, facility and offer are required"
            });
        }

        const wasteBatch = await WasteBatch.findOne({
            _id: wasteBatchId,
            generator: req.user.id
        });

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found"
            });
        }

        const facility = await Facility.findById(facilityId);

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        const match = await WasteMatch.findOne({
            wasteBatch: wasteBatchId,
            facility: facilityId,
            status: "ACCEPTED"
        });

        if (!match) {
            return res.status(400).json({
                message: "Facility match must be accepted first"
            });
        }

        const existingNegotiation =
            await Negotiation.findOne({
                wasteBatch: wasteBatchId,
                facility: facilityId
            });

        if (existingNegotiation) {
            return res.status(409).json({
                message: "Negotiation already exists"
            });
        }

        const negotiation = await Negotiation.create({
            wasteBatch: wasteBatchId,
            facility: facilityId,
            generator: req.user.id,
            currentOffer: initialOffer,
            offers: [
                {
                    sender: req.user.id,
                    amount: initialOffer,
                    message,
                    status: "PENDING"
                }
            ]
        });

        await WasteBatch.findByIdAndUpdate(
            wasteBatchId,
            {
                status: "NEGOTIATED"
            }
        );

        res.status(201).json({
            message: "Negotiation started successfully",
            negotiation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create negotiation",
            error: error.message
        });
    }
};


// Get Generator Negotiations
const getGeneratorNegotiations = async (req, res) => {
    try {
        const negotiations = await Negotiation.find({
            generator: req.user.id
        })
            .populate(
                "wasteBatch",
                "wasteType quantity status"
            )
            .populate(
                "facility",
                "facilityName facilityType location pricing"
            )
            .sort({ updatedAt: -1 });

        res.status(200).json({
            count: negotiations.length,
            negotiations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch negotiations",
            error: error.message
        });
    }
};


// Get Facility Negotiations
const getFacilityNegotiations = async (req, res) => {
    try {
        const facilities = await Facility.find({
            owner: req.user.id
        }).select("_id");

        const facilityIds = facilities.map(
            (facility) => facility._id
        );

        const negotiations = await Negotiation.find({
            facility: { $in: facilityIds }
        })
            .populate(
                "wasteBatch",
                "wasteType quantity location status"
            )
            .populate(
                "generator",
                "name organization phone"
            )
            .populate(
                "facility",
                "facilityName facilityType"
            )
            .sort({ updatedAt: -1 });

        res.status(200).json({
            count: negotiations.length,
            negotiations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch negotiations",
            error: error.message
        });
    }
};


// Get Single Negotiation
const getNegotiation = async (req, res) => {
    try {
        const negotiation = await Negotiation.findById(
            req.params.id
        )
            .populate(
                "wasteBatch"
            )
            .populate(
                "facility"
            )
            .populate(
                "generator",
                "name email phone organization"
            )
            .populate(
                "offers.sender",
                "name organization role"
            );

        if (!negotiation) {
            return res.status(404).json({
                message: "Negotiation not found"
            });
        }

        const isGenerator =
            negotiation.generator._id.toString() ===
            req.user.id;

        const isFacilityOwner =
            negotiation.facility.owner.toString() ===
            req.user.id;

        if (!isGenerator && !isFacilityOwner) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json({
            negotiation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch negotiation",
            error: error.message
        });
    }
};


// Submit New Offer / Counter Offer
const submitOffer = async (req, res) => {
    try {
        const {
            amount,
            message
        } = req.body;

        if (amount === undefined) {
            return res.status(400).json({
                message: "Offer amount is required"
            });
        }

        const negotiation =
            await Negotiation.findById(req.params.id)
                .populate("facility")
                .populate("generator");

        if (!negotiation) {
            return res.status(404).json({
                message: "Negotiation not found"
            });
        }

        if (negotiation.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Negotiation is no longer active"
            });
        }

        const isGenerator =
            negotiation.generator._id.toString() ===
            req.user.id;

        const isFacilityOwner =
            negotiation.facility.owner.toString() ===
            req.user.id;

        if (!isGenerator && !isFacilityOwner) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Mark previous pending offer as countered
        negotiation.offers.forEach((offer) => {
            if (offer.status === "PENDING") {
                offer.status = "COUNTERED";
            }
        });

        negotiation.offers.push({
            sender: req.user.id,
            amount,
            message,
            status: "PENDING"
        });

        negotiation.currentOffer = amount;

        await negotiation.save();

        res.status(200).json({
            message: "Offer submitted successfully",
            negotiation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit offer",
            error: error.message
        });
    }
};


// Accept Current Offer
const acceptOffer = async (req, res) => {
    try {
        const negotiation =
            await Negotiation.findById(req.params.id)
                .populate("facility")
                .populate("generator");

        if (!negotiation) {
            return res.status(404).json({
                message: "Negotiation not found"
            });
        }

        if (negotiation.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Negotiation is no longer active"
            });
        }

        const isGenerator =
            negotiation.generator._id.toString() ===
            req.user.id;

        const isFacilityOwner =
            negotiation.facility.owner.toString() ===
            req.user.id;

        if (!isGenerator && !isFacilityOwner) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const pendingOffer =
            negotiation.offers
                .filter(
                    (offer) =>
                        offer.status === "PENDING"
                )
                .pop();

        if (!pendingOffer) {
            return res.status(400).json({
                message: "No pending offer to accept"
            });
        }

        pendingOffer.status = "ACCEPTED";

        negotiation.status = "ACCEPTED";
        negotiation.agreedPrice =
            pendingOffer.amount;
        negotiation.agreedAt = new Date();

        await negotiation.save();

        res.status(200).json({
            message: "Offer accepted successfully",
            negotiation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept offer",
            error: error.message
        });
    }
};


// Reject Current Offer
const rejectOffer = async (req, res) => {
    try {
        const negotiation =
            await Negotiation.findById(req.params.id)
                .populate("facility")
                .populate("generator");

        if (!negotiation) {
            return res.status(404).json({
                message: "Negotiation not found"
            });
        }

        if (negotiation.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Negotiation is no longer active"
            });
        }

        const isGenerator =
            negotiation.generator._id.toString() ===
            req.user.id;

        const isFacilityOwner =
            negotiation.facility.owner.toString() ===
            req.user.id;

        if (!isGenerator && !isFacilityOwner) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const pendingOffer =
            negotiation.offers
                .filter(
                    (offer) =>
                        offer.status === "PENDING"
                )
                .pop();

        if (!pendingOffer) {
            return res.status(400).json({
                message: "No pending offer to reject"
            });
        }

        pendingOffer.status = "REJECTED";

        negotiation.status = "REJECTED";

        await negotiation.save();

        res.status(200).json({
            message: "Offer rejected successfully",
            negotiation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject offer",
            error: error.message
        });
    }
};


module.exports = {
    createNegotiation,
    getGeneratorNegotiations,
    getFacilityNegotiations,
    getNegotiation,
    submitOffer,
    acceptOffer,
    rejectOffer
};