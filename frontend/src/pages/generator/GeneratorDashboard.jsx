import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

const GeneratorDashboard = () => {
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
            title: "Register Waste",
            description: "Register and list your waste materials.",
            icon: "♻️",
            path: "/generator/register-waste"
        },
        {
            title: "My Waste",
            description: "View and manage your registered waste.",
            icon: "📦",
            path: "/generator/my-waste"
        },
        {
            title: "Negotiations",
            description: "Negotiate prices with suitable facilities.",
            icon: "🤝",
            path: "/generator/negotiations"
        },
        {
            title: "Shipments",
            description: "Track your waste transportation.",
            icon: "🚚",
            path: "/generator/shipments"
        },
        {
            title: "Payments",
            description: "Manage your waste transaction payments.",
            icon: "💳",
            path: "/generator/payments"
        },
        {
            title: "Carbon Impact",
            description: "Track your environmental impact.",
            icon: "🌱",
            path: "/generator/carbon"
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
            title: "Register",
            description: "Register your waste batch."
        },
        {
            step: "02",
            title: "Match",
            description: "Find suitable treatment facilities."
        },
        {
            step: "03",
            title: "Negotiate",
            description: "Agree on the best price."
        },
        {
            step: "04",
            title: "Transport",
            description: "Arrange and track logistics."
        },
        {
            step: "05",
            title: "Measure",
            description: "Track your carbon impact."
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
                            Generator Dashboard
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Welcome back, {user?.name || "Waste Generator"}.
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
                                {user?.organization || user?.name || "Waste Generator"}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                {user?.email || "No email available"}
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                            Waste Generator
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
                            Manage Your Waste
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
                                Need help managing your waste?
                            </h2>

                            <p className="text-gray-400 text-sm mt-2">
                                Register, negotiate, transport and measure your
                                waste in one connected platform.
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

export default GeneratorDashboard;