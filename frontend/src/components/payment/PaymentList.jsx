import { useEffect, useState } from "react";
import gsap from "gsap";

import PaymentCard from "./PaymentCard";
import { getMyPayments } from "../../services/paymentService";
import useAuth from "../../hooks/useAuth";

const PaymentList = () => {
    const { user } = useAuth();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMyPayments();

            setPayments(response?.payments || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch payments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (!loading && payments.length > 0) {
            gsap.fromTo(
                ".payment-card",
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: "power2.out"
                }
            );
        }
    }, [loading, payments]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="animate-pulse text-gray-500">
                    Loading payments...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-600 font-medium">
                    {error}
                </p>

                <button
                    onClick={fetchPayments}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (payments.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                <div className="text-4xl mb-3">
                    💳
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                    No Payments Yet
                </h3>

                <p className="text-gray-500 mt-2">
                    {user?.role === "WASTE_GENERATOR"
                        ? "Payments created after accepting a negotiation will appear here."
                        : "Payment transactions related to your facilities will appear here."}
                </p>
            </div>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Payment History
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {payments.length} transaction
                        {payments.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <button
                    onClick={fetchPayments}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {payments.map((payment) => (
                    <div
                        key={payment._id}
                        className="payment-card"
                    >
                        <PaymentCard
                            payment={payment}
                            showActions={user?.role === "WASTE_GENERATOR"}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PaymentList;