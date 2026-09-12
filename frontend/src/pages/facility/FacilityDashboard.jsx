import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

const FacilityDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".dashboard-item",
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power3.out"
                }
            );
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const actions = [
        {
            title: "Register Facility",
            description: "Register your waste treatment or processing facility.",
            icon: "🏭",
            path: "/facility/register"
        },
        {
            title: "My Facilities",
            description: "View and manage your registered facilities.",
            icon: "📋",
            path: "/facility/my-facilities"
        },
        {
            title: "Negotiations",
            description: "Manage waste offers and negotiate with generators.",
            icon: "🤝",
            path: "/facility/negotiations"
        },
        {
            title: "Shipments",
            description: "Manage incoming waste shipments and logistics.",
            icon: "🚚",
            path: "/facility/shipments"
        },
        {
            title: "Payments",
            description: "Track payments and transaction history.",
            icon: "💳",
            path: "/facility/payments"
        },
        {
            title: "Carbon Impact",
            description: "Track carbon impact from processed waste.",
            icon: "🌱",
            path: "/facility/carbon"
        },
        {
            title: "Verification",
            description: "Manage Aadhaar and GST verification.",
            icon: "✓",
            path: "/verification"
        }
    ];

    const workflow = [
        {
            step: "01",
            title: "Match",
            description: "Find compatible waste batches."
        },
        {
            step: "02",
            title: "Negotiate",
            description: "Agree on treatment or purchase terms."
        },
        {
            step: "03",
            title: "Receive",
            description: "Receive waste at your facility."
        },
        {
            step: "04",
            title: "Process",
            description: "Convert waste through your facility."
        },
        {
            step: "05",
            title: "Carbon",
            description: "Measure environmental impact."
        }
    ];

    return (
        <div
            ref={pageRef}
            className="min-h-screen bg-gray-50 px-4 py-8 md:px-8"
        >
            <div className="max-w-7xl mx-auto">

                {/* ==================== HEADER ==================== */}

                <header className="dashboard-item flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
                    <div>
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            CarbonChain
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            Facility Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Welcome back, {user?.name || "Facility Manager"}.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
                    >
                        Logout
                    </button>
                </header>

                {/* ==================== PROFILE ==================== */}

                <section className="dashboard-item bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">
                                Account
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-1">
                                {user?.organization || user?.name || "Facility"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {user?.email || "No email available"}
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                            Facility
                        </div>

                    </div>
                </section>

                {/* ==================== ACTIONS ==================== */}

                <section className="mb-10">
                    <div className="dashboard-item mb-5">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            Workspace
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            Manage Your Facility
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {actions.map((action) => (
                            <button
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                className="dashboard-item text-left bg-white rounded-2xl border border-gray-200 p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="text-3xl mb-5">
                                    {action.icon}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    {action.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                    {action.description}
                                </p>

                                <div className="mt-5 text-sm font-semibold text-gray-700">
                                    Open →
                                </div>
                            </button>
                        ))}

                    </div>
                </section>

                {/* ==================== WORKFLOW ==================== */}

                <section className="dashboard-item bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-10">

                    <div className="mb-8">
                        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            Workflow
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                            From Waste to Carbon Value
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                        {workflow.map((item) => (
                            <div
                                key={item.step}
                                className="relative"
                            >
                                <p className="text-sm font-bold text-gray-300">
                                    {item.step}
                                </p>

                                <h3 className="font-bold text-gray-900 mt-2">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {item.description}
                                </p>
                            </div>
                        ))}

                    </div>
                </section>

                {/* ==================== SUPPORT ==================== */}

                <section className="dashboard-item bg-gray-900 rounded-2xl p-7 md:p-8 text-white">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">
                                CarbonChain Support
                            </p>

                            <h2 className="text-xl font-bold mt-2">
                                Manage your waste processing efficiently.
                            </h2>

                            <p className="text-gray-400 text-sm mt-2">
                                Match waste, negotiate, receive shipments,
                                process materials and track carbon impact.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/verification")}
                            className="px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition"
                        >
                            Check Verification →
                        </button>

                    </div>

                </section>

            </div>
        </div>
    );
};

export default FacilityDashboard;