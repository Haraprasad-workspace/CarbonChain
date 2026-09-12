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
            className="min-h-screen bg-[#0C1C18] text-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] px-4 py-8 md:px-8 selection:bg-[#2D6B4E] selection:text-white relative"
        >
            {/* Background Decorative Ambient Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* ==================== HEADER ==================== */}

                <header className="dashboard-item flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10 pb-6 border-b border-[#143B36]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
                            <p className="text-xs font-semibold text-[#8EA097] uppercase tracking-wider">
                                CarbonChain Network
                            </p>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4F6F0] tracking-tight">
                            Generator Dashboard
                        </h1>

                        <p className="text-sm text-[#8EA097] mt-1">
                            Welcome back, {user?.name || "Waste Generator"}.
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 rounded-xl border border-[#235349] bg-[#143B36] text-[#F4F6F0] text-sm font-semibold hover:bg-[#1E5247] transition shadow-sm cursor-pointer"
                    >
                        Logout
                    </button>
                </header>


                {/* ==================== PROFILE ==================== */}

                <section className="dashboard-item bg-[#143B36] rounded-2xl border border-[#235349] p-6 mb-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <p className="text-xs text-[#8EA097] uppercase tracking-wider font-medium">
                                Account
                            </p>

                            <h2 className="text-xl font-bold text-[#F4F6F0] mt-1">
                                {user?.organization || user?.name || "Waste Generator"}
                            </h2>

                            <p className="text-sm text-[#8EA097] mt-1">
                                {user?.email || "No email available"}
                            </p>
                        </div>

                        <div className="px-4 py-1.5 rounded-full bg-[#1E5247] border border-[#2D6B4E] text-[#73A892] text-xs font-semibold self-start md:self-auto">
                            ✓ Verified Waste Generator
                        </div>

                    </div>
                </section>


                {/* ==================== ACTIONS ==================== */}

                <section className="mb-10">
                    <div className="dashboard-item mb-5">
                        <p className="text-xs font-semibold text-[#8EA097] uppercase tracking-wider">
                            Workspace
                        </p>

                        <h2 className="text-2xl font-bold text-[#F4F6F0] mt-1 tracking-tight">
                            Manage Your Waste
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
                                    <div className="w-12 h-12 rounded-xl bg-[#1E5247] border border-[#2D6B4E] flex items-center justify-center text-2xl mb-5 shadow-inner">
                                        {action.icon}
                                    </div>

                                    <h3 className="text-lg font-bold text-[#F4F6F0]">
                                        {action.title}
                                    </h3>

                                    <p className="text-sm text-[#8EA097] mt-2 leading-relaxed">
                                        {action.description}
                                    </p>
                                </div>

                                <div className="mt-6 text-xs font-semibold text-[#73A892] flex items-center gap-1.5">
                                    <span>Open</span>
                                    <span>→</span>
                                </div>
                            </button>
                        ))}

                    </div>
                </section>


                {/* ==================== WORKFLOW ==================== */}

                <section className="dashboard-item bg-[#143B36] rounded-2xl border border-[#235349] p-6 md:p-8 mb-10 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">

                    <div className="mb-8">
                        <p className="text-xs font-semibold text-[#8EA097] uppercase tracking-wider">
                            Workflow
                        </p>

                        <h2 className="text-2xl font-bold text-[#F4F6F0] mt-1 tracking-tight">
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
                                    <span className="text-xs font-extrabold text-[#73A892] bg-[#1E5247] px-2 py-0.5 rounded border border-[#2D6B4E]">
                                        {item.step}
                                    </span>

                                    <h3 className="font-bold text-[#F4F6F0] mt-3 text-base">
                                        {item.title}
                                    </h3>

                                    <p className="text-xs text-[#8EA097] mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </section>


                {/* ==================== SUPPORT ==================== */}

                <section className="dashboard-item bg-[#143B36] border border-[#235349] rounded-2xl p-7 md:p-8 text-[#F4F6F0] shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>
                            <p className="text-xs text-[#8EA097] uppercase tracking-wider font-semibold">
                                CarbonChain Support
                            </p>

                            <h2 className="text-xl font-bold mt-1 text-[#F4F6F0]">
                                Need help managing your waste?
                            </h2>

                            <p className="text-[#8EA097] text-sm mt-1">
                                Register, negotiate, transport and measure your waste in one connected platform.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/verification")}
                            className="px-5 py-3 rounded-xl bg-[#73A892] text-[#0C1C18] text-sm font-bold hover:bg-[#85B8A2] active:bg-[#62947F] transition shadow-sm cursor-pointer whitespace-nowrap"
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