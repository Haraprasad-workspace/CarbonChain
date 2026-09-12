const Facility = require("../models/Facility");

// Register Facility
const createFacility = async (req, res) => {
    try {
        const {
            facilityName,
            facilityType,
            acceptedWasteTypes,
            processingCapacity,
            location,
            pricing,
            pricePerUnit,
            description
        } = req.body;

        if (
            !facilityName ||
            !facilityType ||
            !acceptedWasteTypes?.length ||
            !processingCapacity?.value ||
            !location?.latitude ||
            !location?.longitude ||
            !pricing
        ) {
            return res.status(400).json({
                message: "Please provide all required facility details"
            });
        }

        const existingFacility = await Facility.findOne({
            owner: req.user.id,
            facilityName
        });

        if (existingFacility) {
            return res.status(409).json({
                message: "Facility already registered"
            });
        }

        const facility = await Facility.create({
            owner: req.user.id,
            facilityName,
            facilityType,
            acceptedWasteTypes,
            processingCapacity,
            location,
            pricing,
            pricePerUnit,
            description
        });

        res.status(201).json({
            message: "Facility registered successfully",
            facility
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to register facility",
            error: error.message
        });
    }
};


// Get My Facilities
const getMyFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({
            owner: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: facilities.length,
            facilities
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch facilities",
            error: error.message
        });
    }
};


// Get Single Facility
const getFacility = async (req, res) => {
    try {
        const facility = await Facility.findOne({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        res.status(200).json({
            facility
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch facility",
            error: error.message
        });
    }
};


// Update Facility
const updateFacility = async (req, res) => {
    try {
        const facility = await Facility.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        res.status(200).json({
            message: "Facility updated successfully",
            facility
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update facility",
            error: error.message
        });
    }
};


// Delete Facility
const deleteFacility = async (req, res) => {
    try {
        const facility = await Facility.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });

        if (!facility) {
            return res.status(404).json({
                message: "Facility not found"
            });
        }

        res.status(200).json({
            message: "Facility deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete facility",
            error: error.message
        });
    }
};


// Get Active Facilities
const getActiveFacilities = async (req, res) => {
    try {
        const facilities = await Facility.find({
            operationalStatus: "ACTIVE",
            verificationStatus: "VERIFIED"
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: facilities.length,
            facilities
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch active facilities",
            error: error.message
        });
    }
};


module.exports = {
    createFacility,
    getMyFacilities,
    getFacility,
    updateFacility,
    deleteFacility,
    getActiveFacilities
};