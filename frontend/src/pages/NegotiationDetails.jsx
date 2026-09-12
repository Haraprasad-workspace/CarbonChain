import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../hooks/useAuth";

import {
    getNegotiation,
    acceptOffer,
    rejectOffer,
} from "../services/negotiationService";

import socket from "../services/socket";

import OfferForm from "../components/negotiation/OfferForm";
import OfferHistory from "../components/negotiation/OfferHistory";
import NegotiationStatus from "../components/negotiation/NegotiationStatus";
import PaymentButton from "../components/payment/PaymentButton";

const NegotiationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [negotiation, setNegotiation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(socket.connected);

    // Animation Refs
    const pageRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);

    const fetchNegotiation = useCallback(
        async (showLoader = true) => {
            try {
                if (showLoader) setLoading(true);

                setError("");

                const data = await getNegotiation(id);

                setNegotiation(data.negotiation);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Failed to fetch negotiation details. Please try again."
                );
            } finally {
                if (showLoader) setLoading(false);
            }
        },
        [id]
    );

    // Initial data fetch
    useEffect(() => {
        fetchNegotiation(true);
    }, [fetchNegotiation]);

    // Socket Room & Real-time Listeners
    useEffect(() => {
        if (!id) return;

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // Join negotiation room
        socket.emit("joinNegotiation", id);

        // Real-time event handlers
        const handleOfferReceived = () => {
            fetchNegotiation(false);
        };

        const handleAccepted = () => {
            fetchNegotiation(false);
        };

        const handleRejected = () => {
            fetchNegotiation(false);
        };

        socket.on("offerReceived", handleOfferReceived);
        socket.on("negotiationAccepted", handleAccepted);
        socket.on("negotiationRejected", handleRejected);

        return () => {
            socket.emit("leaveNegotiation", id);

            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("offerReceived", handleOfferReceived);
            socket.off("negotiationAccepted", handleAccepted);
            socket.off("negotiationRejected", handleRejected);
        };
    }, [id, fetchNegotiation]);

    // GSAP Entrance Animations
    useEffect(() => {
        if (!loading && !error && negotiation) {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    headerRef.current,
                    { opacity: 0, y: -15 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.45,
                        ease: "power2.out",
                    }
                );

                if (gridRef.current?.children) {
                    gsap.fromTo(
                        gridRef.current.children,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: "power2.out",
                            delay: 0.1,
                        }
                    );
                }
            }, pageRef);

            return () => ctx.revert();
        }
    }, [loading, error, negotiation]);

    const handleBack = () => {
        gsap.to(pageRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            onComplete: () => navigate(-1),
        });
    };

    const handleAccept = async () => {
        try {
            setActionLoading(true);
            setError("");

            await acceptOffer(id);

            socket.emit("offerAccepted", {
                negotiationId: id,
                agreedPrice: negotiation?.currentOffer,
            });

            await fetchNegotiation(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to accept offer. Please retry."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        try {
            setActionLoading(true);
            setError("");

            await rejectOffer(id);

            socket.emit("offerRejected", {
                negotiationId: id,
            });

            await fetchNegotiation(false);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Failed to reject offer. Please retry."
            );
        } finally {
            setActionLoading(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center justify-center p-6 text-[#1E332B]">
                <div className="w-12 h-12 border-4 border-[#E6EDE8] border-t-[#143B36] rounded-full animate-spin mb-4" />

                <p className="text-xs font-bold uppercase tracking-widest text-[#63786E] animate-pulse">
                    Connecting to Real-time Room...
                </p>
            </div>
        );
    }

    // Error State
    if (error && !negotiation) {
        return (
            <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#1E332B]">
                <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        ✕
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-red-900">
                            Unable to Load Thread
                        </h3>

                        <p className="text-xs text-[#63786E] leading-relaxed">
                            {error}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs active:scale-95 cursor-pointer transition-all"
                    >
                        Return to Negotiations
                    </button>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!negotiation) {
        return (
            <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#1E332B]">
                <div className="max-w-md w-full bg-white border border-[#E6EDE8] rounded-2xl p-6 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
                    <div className="w-12 h-12 bg-[#F4F6F0] border border-[#E6EDE8] text-[#143B36] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                        ?
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#1E332B]">
                            Negotiation Not Found
                        </h3>

                        <p className="text-xs text-[#63786E] leading-relaxed">
                            This negotiation thread could not be found or has
                            been closed.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs active:scale-95 cursor-pointer transition-all"
                    >
                        Back to Overview
                    </button>
                </div>
            </div>
        );
    }

    const isGenerator = user?.role === "WASTE_GENERATOR";

    const partnerName = isGenerator
        ? negotiation.facility?.facilityName || "Facility Partner"
        : negotiation.generator?.organization ||
          negotiation.generator?.name ||
          "Waste Generator";

    const waste = negotiation.wasteBatch;

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] p-4 sm:p-[28px] selection:bg-[#143B36] selection:text-white"
        >
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Navigation & Header */}
                <header
                    ref={headerRef}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-5"
                >
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-[#63786E] hover:text-[#1E332B] text-xs font-semibold transition-colors flex items-center gap-1 group cursor-pointer"
                            >
                                <svg
                                    className="w-4 h-4 text-[#73A892] group-hover:-translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>

                                <span>Negotiations</span>
                            </button>

                            <span className="text-[#DFE6E1]">•</span>

                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                                Live Room
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
                                {partnerName}
                            </h1>

                            {/* Live Connection Badge */}
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                    isConnected
                                        ? "bg-[#D8EEDF] text-[#1E5E38] border-[#D8EEDF]"
                                        : "bg-[#FDEED9] text-[#875218] border-[#FDEED9]"
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        isConnected
                                            ? "bg-[#2D6B4E] animate-pulse"
                                            : "bg-[#875218]"
                                    }`}
                                />

                                {isConnected
                                    ? "Live Sync"
                                    : "Connecting..."}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#F4F6F0] text-[#1E332B] border border-[#E6EDE8] hover:border-[#73A892] font-semibold text-xs rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-[#63786E]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>

                        <span>Back to All Deals</span>
                    </button>
                </header>

                {/* Error Toast */}
                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center justify-between">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="text-rose-600 hover:text-rose-900 cursor-pointer font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Workspace Layout */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Waste Batch Summary */}
                        <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] space-y-4">
                            <div className="flex items-center justify-between border-b border-[#E8EFEA] pb-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                                    Waste Batch Overview
                                </span>

                                <span className="px-2.5 py-0.5 bg-[#F4F6F0] border border-[#E6EDE8] text-[#1E332B] text-[10px] font-bold rounded-full">
                                    ID: {waste?._id?.slice(-6) || "N/A"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                                        Waste Type
                                    </p>

                                    <p className="text-sm font-bold text-[#1E332B]">
                                        {waste?.wasteType || "Not Specified"}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                                        Quantity
                                    </p>

                                    <p className="text-sm font-bold text-[#1E332B]">
                                        {waste?.quantity?.value != null
                                            ? `${waste.quantity.value} ${
                                                  waste.quantity.unit || ""
                                              }`
                                            : "N/A"}
                                    </p>
                                </div>

                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                                        Current Stand Offer
                                    </p>

                                    <p className="text-sm font-extrabold text-[#143B36]">
                                        ₹
                                        {negotiation.currentOffer?.toLocaleString() ??
                                            "0"}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Offer History */}
                        <OfferHistory
                            offers={negotiation.offers}
                            currentUserId={user?._id}
                        />

                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        <NegotiationStatus
                            status={negotiation.status}
                            agreedPrice={negotiation.agreedPrice}
                        />

                        {/* Active Negotiation */}
                        {negotiation.status === "ACTIVE" && (
                            <div className="space-y-6">

                                {/* Counter Offer */}
                                <OfferForm
                                    negotiationId={id}
                                    onUpdate={() =>
                                        fetchNegotiation(false)
                                    }
                                />

                                {/* Decision Actions */}
                                <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] space-y-4">
                                    <div className="space-y-1 border-b border-[#E8EFEA] pb-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                                            Decision Actions
                                        </span>

                                        <h4 className="text-sm font-bold text-[#1E332B]">
                                            Finalize or Reject Current Offer
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                        <button
                                            type="button"
                                            onClick={handleAccept}
                                            disabled={actionLoading}
                                            className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            <svg
                                                className="w-4 h-4 shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.5"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>

                                            <span>
                                                {actionLoading
                                                    ? "Processing..."
                                                    : "Accept Offer"}
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleReject}
                                            disabled={actionLoading}
                                            className="w-full py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <svg
                                                className="w-4 h-4 shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.5"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>

                                            <span>
                                                {actionLoading
                                                    ? "Processing..."
                                                    : "Reject Offer"}
                                            </span>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ==================== PAYMENT ==================== */}

                        {isGenerator &&
                            negotiation.status === "ACCEPTED" && (
                                <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)]">

                                    <div className="space-y-1 border-b border-[#E8EFEA] pb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                                            Payment
                                        </span>

                                        <h4 className="text-base font-bold text-[#1E332B]">
                                            Complete Transaction
                                        </h4>

                                        <p className="text-xs text-[#63786E] leading-relaxed">
                                            Your offer has been accepted.
                                            Complete the payment to proceed
                                            with the transaction.
                                        </p>
                                    </div>

                                    <PaymentButton
                                        negotiation={negotiation}
                                        onSuccess={() => {
                                            fetchNegotiation(false);
                                        }}
                                    />

                                </div>
                            )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NegotiationDetails;