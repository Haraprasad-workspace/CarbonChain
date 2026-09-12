const WasteBatch = require("../models/WasteBatch");
const Facility = require("../models/Facility");
const WasteMatch = require("../models/WasteMatch");

const {
    calculateMatchScore
} = require("../utils/matchingEngine");

// Find matching facilities for a waste batch
const findMatches = async (req, res) => {
    try {
        const wasteBatch = await WasteBatch.findOne({
            _id: req.params.wasteId,
            generator: req.user.id
        });

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found"
            });
        }

        if (
            !wasteBatch.location?.latitude ||
            !wasteBatch.location?.longitude
        ) {
            return res.status(400).json({
                message: "Waste location coordinates are required"
            });
        }

        const facilities = await Facility.find({
            operationalStatus: "ACTIVE",
            verificationStatus: "VERIFIED"
        });

        const matches = [];

        for (const facility of facilities) {
            const result = calculateMatchScore(
                wasteBatch,
                facility
            );

            if (!result) {
                continue;
            }

            const match = await WasteMatch.findOneAndUpdate(
                {
                    wasteBatch: wasteBatch._id,
                    facility: facility._id
                },
                {
                    wasteBatch: wasteBatch._id,
                    facility: facility._id,
                    matchScore: result.score,
                    distance: result.distance
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            matches.push(match);
        }

        matches.sort(
            (a, b) => b.matchScore - a.matchScore
        );

        if (matches.length > 0) {
            await WasteBatch.findByIdAndUpdate(
                wasteBatch._id,
                {
                    status: "MATCHED"
                }
            );
        }

        res.status(200).json({
            count: matches.length,
            matches
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to find matching facilities",
            error: error.message
        });
    }
};


// Get matches for a waste batch
const getWasteMatches = async (req, res) => {
    try {
        const wasteBatch = await WasteBatch.findOne({
            _id: req.params.wasteId,
            generator: req.user.id
        });

        if (!wasteBatch) {
            return res.status(404).json({
                message: "Waste batch not found"
            });
        }

        const matches = await WasteMatch.find({
            wasteBatch: wasteBatch._id
        })
            .populate(
                "facility",
                "facilityName facilityType acceptedWasteTypes processingCapacity location pricing pricePerUnit operationalStatus"
            )
            .sort({
                matchScore: -1
            });

        res.status(200).json({
            count: matches.length,
            matches
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch matches",
            error: error.message
        });
    }
};


// Accept a facility match
const acceptMatch = async (req, res) => {
    try {
        const match = await WasteMatch.findById(
            req.params.matchId
        ).populate("wasteBatch");

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        if (
            match.wasteBatch.generator.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        match.status = "ACCEPTED";

        await match.save();

        res.status(200).json({
            message: "Facility match accepted",
            match
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept match",
            error: error.message
        });
    }
};


// Reject a facility match
const rejectMatch = async (req, res) => {
    try {
        const match = await WasteMatch.findById(
            req.params.matchId
        ).populate("wasteBatch");

        if (!match) {
            return res.status(404).json({
                message: "Match not found"
            });
        }

        if (
            match.wasteBatch.generator.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        match.status = "REJECTED";

        await match.save();

        res.status(200).json({
            message: "Facility match rejected",
            match
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject match",
            error: error.message
        });
    }
};


module.exports = {
    findMatches,
    getWasteMatches,
    acceptMatch,
    rejectMatch
};