import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PaymentCard from "./PaymentCard";
import { getMyPayments } from "../../services/paymentService";
import useAuth from "../../hooks/useAuth";

gsap.registerPlugin(ScrollTrigger);

const PaymentList = () => {
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const staticDetailsRef = useRef(null);

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

  // GSAP Entrance and Grid Item Stagger Animation
  useEffect(() => {
    if (!loading && payments.length > 0 && gridRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (staticDetailsRef.current?.children) {
          gsap.fromTo(
            staticDetailsRef.current.children,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.3,
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [loading, payments]);

  // Loading State - Dark Forest Green Theme
  if (loading) {
    return (
      <div className="bg-[#0B1A12] border border-[#1B382B] rounded-2xl p-8 text-center space-y-4 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7]">
        <div className="w-10 h-10 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[#6E9B82] tracking-wider uppercase">
          Loading Settlement Ledger...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl p-6 font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/30 flex items-center justify-center text-[#F87171]">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-extrabold text-[#F87171]">{error}</p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-4 py-2 rounded-xl bg-[#EF4444] text-[#0B1A12] text-xs font-black hover:bg-[#DC2626] transition shadow-md cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (payments.length === 0) {
    return (
      <div className="bg-[#0B1A12] border border-[#1B382B] rounded-2xl p-10 text-center space-y-4 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] relative overflow-hidden">
        <div className="w-14 h-14 bg-[#132A1D] border border-[#1B382B] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md">
          💳
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-black text-[#E2F1E7]">
            No Payments Logged
          </h3>

          <p className="text-xs text-[#6E9B82] max-w-sm mx-auto leading-relaxed">
            {user?.role === "WASTE_GENERATOR"
              ? "Payments created after accepting a negotiation will appear here."
              : "Payment transactions related to your facilities will appear here."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#E2F1E7]"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#1B382B] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Escrow & Settlement Ledger
          </span>
          <h2 className="text-xl font-black text-[#E2F1E7] tracking-tight">
            Payment History
          </h2>
          <p className="text-xs font-semibold text-[#6E9B82] mt-0.5">
            {payments.length} transaction{payments.length !== 1 ? "s" : ""}{" "}
            recorded
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-4 py-2 rounded-xl border border-[#1B382B] bg-[#132A1D]/60 hover:bg-[#132A1D] text-xs font-black text-[#E2F1E7] transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <svg
            className="w-3.5 h-3.5 text-[#10B981]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {payments.map((payment) => (
          <div key={payment._id} className="payment-card">
            <PaymentCard
              payment={payment}
              showActions={user?.role === "WASTE_GENERATOR"}
            />
          </div>
        ))}
      </div>

      {/* Static Info Parameters */}
      <div className="bg-[#0B1A12] border border-[#1B382B] rounded-2xl p-5 space-y-2 shadow-lg">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Auditing & Governance Metadata
        </p>

        <div
          ref={staticDetailsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
        >
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Compliance Ledger
            </span>
            <span className="font-extrabold text-[#34D399]">Smart Contract Engine</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Data Encryption
            </span>
            <span className="font-extrabold text-[#E2F1E7]">AES-256 GCM</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Settlement Currency
            </span>
            <span className="font-extrabold text-[#E2F1E7]">INR (₹)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentList;