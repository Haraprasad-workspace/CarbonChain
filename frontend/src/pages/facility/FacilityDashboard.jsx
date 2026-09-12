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
            className="min-h-screen bg-[#0C1C18] px-4 py-8 md:px-8 font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] relative selection:bg-[#2D6B4E] selection:text-white"
        >
            {/* Background Decorative Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">

                {/* ==================== HEADER ==================== */}

                <header className="dashboard-item flex flex-col md:flex-row md:items-center md:justify-between gap-5 border-b border-[#143B36] pb-6">
                    <div>
                        <p className="text-sm font-semibold text-[#8EA097] uppercase tracking-wider">
                            CarbonChain
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-[#F4F6F0] mt-2">
                            Facility Dashboard
                        </h1>

                        <p className="text-[#8EA097] mt-2">
                            Welcome back, {user?.name || "Facility Manager"}.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-xl border border-[#235349] bg-[#143B36] text-[#F4F6F0] font-semibold hover:bg-[#1E5247] hover:border-[#2D6B4E] transition cursor-pointer active:scale-95 shadow-sm"
                    >
                        Logout
                    </button>
                </header>

                {/* ==================== PROFILE ==================== */}

                <section className="dashboard-item bg-[#143B36] rounded-2xl border border-[#235349] p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <p className="text-xs text-[#8EA097] uppercase tracking-wider">
                                Account
                            </p>

                            <h2 className="text-xl font-bold text-[#F4F6F0] mt-1">
                                {user?.organization || user?.name || "Facility"}
                            </h2>

                            <p className="text-sm text-[#8EA097] mt-1">
                                {user?.email || "No email available"}
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-full bg-[#1E5247] border border-[#2D6B4E] text-[#73A892] text-sm font-semibold self-start md:self-auto">
                            Facility
                        </div>

                    </div>
                </section>

                {/* ==================== ACTIONS ==================== */}

                <section className="space-y-5">
                    <div className="dashboard-item">
                        <p className="text-sm font-semibold text-[#8EA097] uppercase tracking-wider">
                            Workspace
                        </p>

                        <h2 className="text-2xl font-bold text-[#F4F6F0] mt-1">
                            Manage Your Facility
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {actions.map((action) => (
                            <button
                                key={action.title}
                                onClick={() => navigate(action.path)}
                                className="dashboard-item text-left bg-[#143B36] rounded-2xl border border-[#235349] p-6 hover:-translate-y-1 hover:border-[#2D6B4E] hover:shadow-[0px_8px_30px_rgba(10,28,24,0.6)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-[#1E5247] border border-[#2D6B4E] text-[#73A892] flex items-center justify-center text-xl mb-4">
                                        {action.icon}
                                    </div>

                                    <h3 className="text-lg font-bold text-[#F4F6F0]">
                                        {action.title}
                                    </h3>

                                    <p className="text-sm text-[#8EA097] mt-2 leading-relaxed">
                                        {action.description}
                                    </p>
                                </div>

                                <div className="mt-6 text-sm font-semibold text-[#73A892] flex items-center gap-1">
                                    <span>Open</span>
                                    <span>→</span>
                                </div>
                            </button>
                        ))}

                    </div>
                </section>

                {/* ==================== WORKFLOW ==================== */}

                <section className="dashboard-item bg-[#143B36] rounded-2xl border border-[#235349] p-6 md:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">

                    <div className="mb-8">
                        <p className="text-sm font-semibold text-[#8EA097] uppercase tracking-wider">
                            Workflow
                        </p>

                        <h2 className="text-2xl font-bold text-[#F4F6F0] mt-1">
                            From Waste to Carbon Value
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

                        {workflow.map((item) => (
                            <div
                                key={item.step}
                                className="relative bg-[#0C1C18]/40 border border-[#235349]/60 rounded-xl p-4 flex flex-col justify-between"
                            >
                                <div>
                                    <p className="text-xs font-bold text-[#73A892] tracking-widest font-mono">
                                        {item.step}
                                    </p>

                                    <h3 className="font-bold text-[#F4F6F0] mt-2 text-base">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-[#8EA097] mt-1.5 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </section>

                {/* ==================== SUPPORT ==================== */}

                <section className="dashboard-item bg-[#143B36] border border-[#235349] rounded-2xl p-7 md:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative z-10">

                        <div>
                            <p className="text-sm text-[#8EA097] uppercase tracking-wider">
                                CarbonChain Support
                            </p>

                            <h2 className="text-xl font-bold text-[#F4F6F0] mt-2">
                                Manage your waste processing efficiently.
                            </h2>

                            <p className="text-[#8EA097] text-sm mt-2 max-w-xl leading-relaxed">
                                Match waste, negotiate, receive shipments,
                                process materials and track carbon impact.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/verification")}
                            className="px-5 py-3 rounded-xl bg-[#73A892] text-[#0C1C18] font-bold hover:bg-[#86B8A2] transition cursor-pointer active:scale-95 shadow-sm shrink-0 flex items-center justify-center gap-2"
                        >
                            <span>Check Verification</span>
                            <span>→</span>
                        </button>

                    </div>
                </section>

            </div>
        </div>
    );
};

export default FacilityDashboard;