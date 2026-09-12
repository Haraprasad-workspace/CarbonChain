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

    const totalReceived = payments
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
            className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] px-4 py-8 md:px-8 selection:bg-[#2D6B4E] selection:text-white relative"
        >
            {/* Background Decorative Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="mb-8 border-b border-[#143B36] pb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-[#8EA097] hover:text-[#F4F6F0] mb-4 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>

                    <p className="text-sm font-semibold text-[#8EA097] uppercase tracking-wider">
                        CarbonChain
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#F4F6F0] mt-2">
                        Payments
                    </h1>

                    <p className="text-[#8EA097] mt-2">
                        Track payments received from waste generators.
                    </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="bg-[#143B36] rounded-2xl border border-[#235349] p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
                        <p className="text-sm text-[#8EA097]">
                            Total Transactions
                        </p>

                        <p className="text-3xl font-bold text-[#F4F6F0] mt-2">
                            {payments.length}
                        </p>
                    </div>

                    <div className="bg-[#143B36] rounded-2xl border border-[#235349] p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
                        <p className="text-sm text-[#8EA097]">
                            Payments Received
                        </p>

                        <p className="text-3xl font-bold text-[#73A892] mt-2">
                            ₹{totalReceived.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="bg-[#143B36] rounded-2xl border border-[#235349] p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
                        <p className="text-sm text-[#8EA097]">
                            Pending Payments
                        </p>

                        <p className="text-3xl font-bold text-[#FFC24A] mt-2">
                            ₹{pendingAmount.toLocaleString("en-IN")}
                        </p>
                    </div>

                </div>

                {/* Payment History */}
                <PaymentList />

            </div>
        </div>
    );
};

export default Payments;