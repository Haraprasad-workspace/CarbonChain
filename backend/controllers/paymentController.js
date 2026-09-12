const crypto = require("crypto");

const Payment = require("../models/Payment");
const WasteBatch = require("../models/WasteBatch");
const Negotiation = require("../models/Negotiation");
const Facility = require("../models/Facility");

// Create Payment
const createPayment = async (req, res) => {
    try {
        const { negotiationId } = req.body;

        if (!negotiationId) {
            return res.status(400).json({
                message: "Negotiation ID is required"
            });
        }

        const negotiation = await Negotiation.findById(negotiationId)
            .populate("wasteBatch")
            .populate("facility");

        if (!negotiation) {
            return res.status(404).json({
                message: "Negotiation not found"
            });
        }

        if (negotiation.generator.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to create this payment"
            });
        }

        if (negotiation.status !== "ACCEPTED") {
            return res.status(400).json({
                message: "Payment can only be created for an accepted negotiation"
            });
        }

        const existingPayment = await Payment.findOne({
            negotiation: negotiation._id
        });

        if (existingPayment) {
            return res.status(200).json({
                message: "Payment already exists",
                payment: existingPayment
            });
        }

        const payment = await Payment.create({
            wasteBatch: negotiation.wasteBatch._id,
            negotiation: negotiation._id,
            generator: negotiation.generator,
            facility: negotiation.facility._id,
            amount: negotiation.agreedPrice || negotiation.currentOffer,
            paymentMethod: "DEMO",
            status: "PENDING"
        });

        res.status(201).json({
            message: "Payment created successfully",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create payment",
            error: error.message
        });
    }
};


// Get My Payments
const getMyPayments = async (req, res) => {
    try {
        let payments;

        if (req.user.role === "WASTE_GENERATOR") {
            payments = await Payment.find({
                generator: req.user.id
            })
                .populate("wasteBatch")
                .populate("facility")
                .sort({ createdAt: -1 });

        } else if (req.user.role === "FACILITY") {
            const facilities = await Facility.find({
                owner: req.user.id
            }).select("_id");

            const facilityIds = facilities.map(
                (facility) => facility._id
            );

            payments = await Payment.find({
                facility: { $in: facilityIds }
            })
                .populate("wasteBatch")
                .populate("generator", "name email phone")
                .sort({ createdAt: -1 });

        } else if (req.user.role === "ADMIN") {
            payments = await Payment.find()
                .populate("wasteBatch")
                .populate("generator", "name email")
                .populate("facility")
                .sort({ createdAt: -1 });

        } else {
            return res.status(403).json({
                message: "You are not authorized to view payments"
            });
        }

        res.status(200).json({
            count: payments.length,
            payments
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};


// Get Single Payment
const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("wasteBatch")
            .populate("negotiation")
            .populate("generator", "name email phone")
            .populate("facility");

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        const isGenerator =
            payment.generator._id.toString() === req.user.id;

        const facility = await Facility.findById(payment.facility._id);

        const isFacility =
            facility &&
            facility.owner.toString() === req.user.id;

        const isAdmin = req.user.role === "ADMIN";

        if (!isGenerator && !isFacility && !isAdmin) {
            return res.status(403).json({
                message: "You are not authorized to view this payment"
            });
        }

        res.status(200).json({
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payment",
            error: error.message
        });
    }
};


// Verify Demo / Razorpay Payment
const verifyPayment = async (req, res) => {
    try {
        const { paymentId, razorpayPaymentId, razorpaySignature } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.generator.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to verify this payment"
            });
        }

        if (payment.status === "SUCCESS") {
            return res.status(200).json({
                message: "Payment already verified",
                payment
            });
        }

        // DEMO PAYMENT
        if (payment.paymentMethod === "DEMO") {
            payment.status = "SUCCESS";
            payment.paidAt = new Date();

            await payment.save();

            return res.status(200).json({
                message: "Demo payment successful",
                payment
            });
        }

        // RAZORPAY PAYMENT
        if (
            !razorpayPaymentId ||
            !razorpaySignature ||
            !payment.razorpayOrderId
        ) {
            return res.status(400).json({
                message: "Payment verification details are required"
            });
        }

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${payment.razorpayOrderId}|${razorpayPaymentId}`
            )
            .digest("hex");

        if (generatedSignature !== razorpaySignature) {
            payment.status = "FAILED";
            payment.failureReason = "Invalid payment signature";

            await payment.save();

            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        payment.status = "SUCCESS";
        payment.paidAt = new Date();

        await payment.save();

        res.status(200).json({
            message: "Payment verified successfully",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to verify payment",
            error: error.message
        });
    }
};


// Cancel Payment
const cancelPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        if (payment.generator.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to cancel this payment"
            });
        }

        if (payment.status !== "PENDING") {
            return res.status(400).json({
                message: "Only pending payments can be cancelled"
            });
        }

        payment.status = "CANCELLED";

        await payment.save();

        res.status(200).json({
            message: "Payment cancelled successfully",
            payment
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel payment",
            error: error.message
        });
    }
};


module.exports = {
    createPayment,
    getMyPayments,
    getPayment,
    verifyPayment,
    cancelPayment
};