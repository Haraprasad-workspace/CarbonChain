import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import PaymentList from "../../components/payment/PaymentList";
import { getMyPayments } from "../../services/paymentService";

const Payments = () => {
    const pageRef = useRef(null);

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            setLoading(true);

            const response = await getMyPayments();

            setPayments(response?.payments || []);
        } catch (error) {
            console.error("Failed to fetch payments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (!loading) {
            gsap.fromTo(
                pageRef.current,
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }
            );
        }
    }, [loading]);

    const totalPaid = payments
        .filter((payment) => payment.status === "SUCCESS")
        .reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

    const pendingAmount = payments
        .filter((payment) => payment.status === "PENDING")
        .reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-gray-50 px-4 py-8 md:px-8"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-gray-500 hover:text-gray-900 mb-4"
                    >
                        ← Back
                    </button>

                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        CarbonChain
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                        Payments
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your waste transaction payments.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Total Transactions
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {payments.length}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Total Paid
                        </p>

                        <p className="text-3xl font-bold text-green-600 mt-2">
                            ₹{totalPaid.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <p className="text-sm text-gray-500">
                            Pending Amount
                        </p>

                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            ₹{pendingAmount.toLocaleString("en-IN")}
                        </p>
                    </div>

                </div>

                {/* Payment List */}
                <PaymentList />
            </div>
        </div>
    );
};

export default Payments;