import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const ecosystemRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance Animation
      gsap.fromTo(
        heroRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // Stats Stagger Scroll Animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Problem Section Scroll Reveal
      if (problemRef.current) {
        gsap.fromTo(
          problemRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: problemRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Solution Cards Scroll Reveal
      if (solutionRef.current) {
        gsap.fromTo(
          solutionRef.current.children,
          { opacity: 0, scale: 0.95, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: solutionRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // Ecosystem Grid Animation
      if (ecosystemRef.current) {
        gsap.fromTo(
          ecosystemRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ecosystemRef.current,
              start: "top 75%",
            },
          }
        );
      }

      // CTA Banner Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] selection:bg-[#2D6B4E] selection:text-white relative overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-48 -left-48 w-[32rem] h-[32rem] bg-[#2D6B4E]/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-48 w-[32rem] h-[32rem] bg-[#143B36]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-1/4 w-[28rem] h-[28rem] bg-[#1E5247]/20 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0C1C18]/80 border-b border-[#143B36] px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#143B36] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-base shadow-sm">
            🌿
          </div>
          <span className="text-lg font-black tracking-tight text-[#F4F6F0]">
            CarbonChain<span className="text-[#73A892]">.</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#8EA097]">
          <a href="#problem" className="hover:text-[#F4F6F0] transition-colors">Problem</a>
          <a href="#solution" className="hover:text-[#F4F6F0] transition-colors">Solution</a>
          <a href="#ecosystem" className="hover:text-[#F4F6F0] transition-colors">Ecosystem</a>
          <a href="#impact" className="hover:text-[#F4F6F0] transition-colors">Impact</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-extrabold text-xs rounded-xl transition-all shadow-xs active:scale-95"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-[#73A892] hover:bg-[#86B8A2] text-[#0C1C18] font-extrabold text-xs rounded-xl transition-all shadow-xs active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-20 pb-28 text-center space-y-8">
        <div ref={heroRef} className="space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#143B36] border border-[#235349] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8EA097]">
              Next-Gen Industrial Waste Traceability & Market Protocol
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-[#F4F6F0]">
            Transforming Waste Chains into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#73A892] to-[#A2C9B7]">Verified Green Assets</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#8EA097] font-medium max-w-2xl mx-auto leading-relaxed">
            CarbonChain bridges industrial waste generators, logistics networks, and recycling facilities on an unshakeable encrypted ledger with automated carbon credit validation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#73A892] hover:bg-[#86B8A2] text-[#0C1C18] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0px_4px_24px_rgba(115,168,146,0.3)] active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Initialize Organization Account</span>
              <span>→</span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs active:scale-95 flex items-center justify-center gap-3"
            >
              <span>Access Control Center</span>
            </Link>
          </div>
        </div>

        {/* Hero Product Visual Display */}
        <div className="pt-8">
          <div className="bg-[#143B36]/80 backdrop-blur-md border border-[#235349] rounded-3xl p-4 sm:p-8 shadow-[0px_12px_48px_rgba(10,28,24,0.6)] relative overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-3xl" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left relative z-10">
              <div className="bg-[#0C1C18]/60 border border-[#235349] p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-[#8EA097] uppercase tracking-widest">Global Protocol</span>
                <p className="text-xl font-black text-[#F4F6F0]">Zero-Leakage Logistics</p>
                <p className="text-xs text-[#8EA097]">Real-time tracking from disposal origin to final material recovery facility.</p>
              </div>
              <div className="bg-[#0C1C18]/60 border border-[#235349] p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-[#8EA097] uppercase tracking-widest">Smart Bidding</span>
                <p className="text-xl font-black text-[#F4F6F0]">Dynamic Valuation</p>
                <p className="text-xs text-[#8EA097]">Automated price negotiation matching material quality with recycler demand.</p>
              </div>
              <div className="bg-[#0C1C18]/60 border border-[#235349] p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-[#8EA097] uppercase tracking-widest">Compliance</span>
                <p className="text-xl font-black text-[#F4F6F0]">Audit-Ready Ledger</p>
                <p className="text-xs text-[#8EA097]">Instant ESG reporting and automated green tax credit verification.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Section */}
      <section id="impact" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#143B36] border border-[#235349] p-6 rounded-2xl text-center space-y-2 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
            <p className="text-3xl sm:text-4xl font-black text-[#73A892]">1.2M+ Tons</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">Industrial Waste Tracked</p>
          </div>
          <div className="bg-[#143B36] border border-[#235349] p-6 rounded-2xl text-center space-y-2 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
            <p className="text-3xl sm:text-4xl font-black text-[#73A892]">₹450Cr+</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">Verified Transactions</p>
          </div>
          <div className="bg-[#143B36] border border-[#235349] p-6 rounded-2xl text-center space-y-2 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
            <p className="text-3xl sm:text-4xl font-black text-[#73A892]">340+</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">Certified Facilities</p>
          </div>
          <div className="bg-[#143B36] border border-[#235349] p-6 rounded-2xl text-center space-y-2 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
            <p className="text-3xl sm:text-4xl font-black text-[#73A892]">99.9%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">Chain Audit Accuracy</p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#73A892]">The Industrial Challenge</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F4F6F0]">Why Traditional Waste Supply Chains Fail</h2>
            <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
              Global supply chains generate millions of tons of industrial byproducts daily, yet rely on fragmented paperwork, unverified intermediaries, and zero real-time accountability.
            </p>
          </div>

          <div ref={problemRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-red-400 font-bold text-lg">
                ✕
              </div>
              <h3 className="text-xl font-black text-[#F4F6F0]">Opaque Intermediaries</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Lack of direct communication channels between waste generators and licensed processing plants leads to inflated pricing and material mishandling.
              </p>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-red-400 font-bold text-lg">
                ✕
              </div>
              <h3 className="text-xl font-black text-[#F4F6F0]">Compliance Blindspots</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Manual logbooks and paper manifests invite regulatory fines, greenwashing risks, and inability to claim valid carbon offset credits.
              </p>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-red-400 font-bold text-lg">
                ✕
              </div>
              <h3 className="text-xl font-black text-[#F4F6F0]">Payment Delays & Disputes</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Disputed cargo quality upon arrival causes extended invoice cycles, legal disputes, and stalled liquidity for processing facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section id="solution" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#73A892]">The CarbonChain Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F4F6F0]">End-to-End Industrial Intelligence</h2>
            <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
              Our unified protocol integrates enterprise onboarding, real-time dispatch monitoring, dynamic deal negotiations, and automated escrow payments.
            </p>
          </div>

          <div ref={solutionRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#143B36] border border-[#235349] p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0px_6px_30px_rgba(10,28,24,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-lg">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#F4F6F0]">Facility Onboarding & Verification</h3>
                <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
                  Register recycling plants and industrial generators with verified operational credentials, precise geo-location mapping, and automated compliance checks.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-[#8EA097]">
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Instant license status validation</li>
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Secure multi-tier organizational roles</li>
              </ul>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0px_6px_30px_rgba(10,28,24,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-lg">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#F4F6F0]">Real-Time Counter-Offer Negotiations</h3>
                <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
                  Eliminate brokers with direct deal rooms. Negotiate pricing per ton, delivery schedules, and quality parameters with instant digital acceptance.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-[#8EA097]">
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Live bidding & counter-proposal history</li>
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Transparent agreement locking</li>
              </ul>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0px_6px_30px_rgba(10,28,24,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-lg">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#F4F6F0]">Inbound Logistics & Shipment Tracking</h3>
                <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
                  Monitor waste dispatches arriving at your receiving docks with timeline logs, manifest checks, and status updates updated instantly.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-[#8EA097]">
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Dispatch manifest verification</li>
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Dock arrival & intake logging</li>
              </ul>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 sm:p-10 rounded-3xl space-y-6 shadow-[0px_6px_30px_rgba(10,28,24,0.4)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
              <div className="w-12 h-12 rounded-2xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-lg">
                04
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#F4F6F0]">Automated Settlement & Payments</h3>
                <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
                  Track successful transactions, incoming remittances, and pending dues with integrated ledger reporting and financial dashboards.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-[#8EA097]">
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Automated escrow release upon receipt</li>
                <li className="flex items-center gap-2"><span className="text-[#73A892]">✓</span> Real-time transaction reconciliation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem & Features Grid */}
      <section id="ecosystem" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#73A892]">Enterprise Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F4F6F0]">Built for Modern Industrial Leaders</h2>
            <p className="text-xs sm:text-sm text-[#8EA097] leading-relaxed">
              Whether you generate heavy industrial byproduct or operate high-capacity recycling plants, CarbonChain scales with your operational footprint.
            </p>
          </div>

          <div ref={ecosystemRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892]">
                🏭
              </div>
              <h3 className="text-lg font-black text-[#F4F6F0]">For Waste Generators</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Offload industrial waste safely to verified certified recyclers while securing premium pricing and audit-ready sustainability certificates.
              </p>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892]">
                ♻️
              </div>
              <h3 className="text-lg font-black text-[#F4F6F0]">For Recycling Facilities</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Maintain consistent raw material intake, streamline incoming truck schedules, and negotiate bulk supply contracts directly without friction.
              </p>
            </div>

            <div className="bg-[#143B36] border border-[#235349] p-8 rounded-3xl space-y-4 shadow-[0px_6px_30px_rgba(10,28,24,0.4)]">
              <div className="w-10 h-10 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892]">
                📊
              </div>
              <h3 className="text-lg font-black text-[#F4F6F0]">For ESG Auditors</h3>
              <p className="text-xs text-[#8EA097] leading-relaxed">
                Access immutable proof of recycling volumes, carbon emission reductions, and regulatory compliance logs with single-click export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16 py-20">
        <div
          ref={ctaRef}
          className="bg-gradient-to-br from-[#143B36] to-[#0E2A24] border border-[#235349] rounded-3xl p-8 sm:p-14 text-center space-y-8 shadow-[0px_16px_48px_rgba(10,28,24,0.6)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1E5247]/40 rounded-bl-full pointer-events-none blur-3xl" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#73A892]">Ready to Modernize Your Operations?</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F4F6F0] tracking-tight">
              Start Managing Your Waste Supply Chain Today
            </h2>
            <p className="text-xs sm:text-sm text-[#8EA097] font-medium leading-relaxed">
              Join hundreds of forward-thinking industrial facilities and recyclers already scaling on CarbonChain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#73A892] hover:bg-[#86B8A2] text-[#0C1C18] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-[0px_4px_24px_rgba(115,168,146,0.3)] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Register New Facility</span>
              <span>→</span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#0C1C18] hover:bg-[#143B36] text-[#F4F6F0] border border-[#235349] font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xs active:scale-95 flex items-center justify-center"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#143B36] bg-[#0A1814] py-12 px-6 lg:px-16 text-center sm:text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#143B36] border border-[#235349] flex items-center justify-center text-[#73A892] font-black text-sm">
              🌿
            </div>
            <span className="text-base font-black tracking-tight text-[#F4F6F0]">
              CarbonChain<span className="text-[#73A892]">.</span>
            </span>
          </div>

          <p className="text-xs text-[#8EA097] font-medium">
            © {new Date().getFullYear()} CarbonChain Technologies Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs font-bold text-[#8EA097]">
            <Link to="/login" className="hover:text-[#F4F6F0] transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-[#F4F6F0] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;