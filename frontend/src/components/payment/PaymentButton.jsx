import { useState } from "react";
import {
    createPayment,
    verifyPayment
} from "../../services/paymentService";

const PaymentButton = ({ negotiation, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError("");

            // Create payment
            const response = await createPayment(negotiation._id);

            const payment = response?.payment;

            if (!payment) {
                throw new Error("Payment could not be created.");
            }

            // DEMO PAYMENT
            // In the hackathon demo this acts as the payment gateway.
            const verificationResponse = await verifyPayment(
                payment._id
            );

            if (verificationResponse?.payment?.status === "SUCCESS") {
                if (onSuccess) {
                    onSuccess(verificationResponse.payment);
                }
            } else {
                throw new Error("Payment verification failed.");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Payment failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const amount =
        negotiation?.agreedPrice ??
        negotiation?.currentOffer ??
        0;

    if (negotiation?.status !== "ACCEPTED") {
        return null;
    }

    return (
        <div className="mt-5">
            {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            )}

            <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full rounded-xl bg-black text-white py-3 px-5 font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {loading
                    ? "Processing Payment..."
                    : `Pay ₹${Number(amount).toLocaleString("en-IN")}`}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
                Secure payment • CarbonChain Demo Gateway
            </p>
        </div>
    );
};

export default PaymentButton;