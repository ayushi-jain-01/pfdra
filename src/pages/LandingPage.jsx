
import React, { useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import {
    ShieldCheck, TrendingUp, Users, ArrowRight, Activity,
    Zap, BadgeCheck, Lock, Star, CheckCircle2, Wallet,
    BarChart3, Globe, FileText, Award, ChevronRight
} from 'lucide-react';
import './LandingPage.css';

/* ─── Data ────────────────────────────────────────────────── */
const CHART_HEIGHTS = [35, 52, 42, 68, 58, 82, 70, 91];
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const TRUST_ITEMS = [
    { icon: <Award size={18} color="#14B8A6" />, label: 'Regulated By', value: 'PFRDA' },
    { icon: <Lock size={18} color="#14B8A6" />, label: 'Encryption', value: '256-bit Secure' },
    { icon: <Globe size={18} color="#2563EB" />, label: 'Subscribers', value: '7 Crore+' },
    { icon: <CheckCircle2 size={18} color="#22C55E" />, label: 'Verified By', value: 'Govt. of India' },
];

const STEPS = [
    {
        no: '01', icon: <Users size={26} color="#14B8A6" />, iconBg: 'rgba(20,184,166,0.12)',
        title: 'Verify Identity',
        desc: 'Instant KYC via Aadhaar, PAN, or DigiLocker. 100% paperless, compliant & secure.'
    },
    {
        no: '02', icon: <TrendingUp size={26} color="#2563EB" />, iconBg: 'rgba(37,99,235,0.12)',
        title: 'Select Pension Fund',
        desc: 'Choose from top-rated fund managers with AI-backed personalised recommendations.'
    },
    {
        no: '03', icon: <Zap size={26} color="#7C3AED" />, iconBg: 'rgba(124,58,237,0.12)',
        title: 'Start Investing',
        desc: 'Set up auto-pay and watch your retirement corpus grow tax-free under Section 80C.'
    },
];

const FEATURES = [
    { icon: <FileText size={22} color="#14B8A6" />, bg: 'rgba(20,184,166,0.10)', title: 'Paperless KYC', desc: 'Aadhaar-based eKYC with DigiLocker integration. No physical paperwork ever.' },
    { icon: <BarChart3 size={22} color="#2563EB" />, bg: 'rgba(37,99,235,0.10)', title: 'Real-time Dashboard', desc: 'Track your corpus, returns, and asset allocation from a unified smart dashboard.' },
    { icon: <ShieldCheck size={22} color="#7C3AED" />, bg: 'rgba(124,58,237,0.10)', title: 'PFRDA Compliant', desc: 'Fully regulated by the Pension Fund Regulatory and Development Authority of India.' },
    { icon: <Wallet size={22} color="#22C55E" />, bg: 'rgba(34,197,94,0.10)', title: 'Tax Benefits', desc: 'Claim upto ₹2 lakh deductions annually under Section 80C and 80CCD(1B).' },
    { icon: <Activity size={22} color="#F59E0B" />, bg: 'rgba(245,158,11,0.10)', title: 'AI Risk Profiling', desc: 'Smart risk assessment engine allocates your portfolio across equity, debt & govt bonds.' },
    { icon: <Star size={22} color="#2563EB" />, bg: 'rgba(37,99,235,0.10)', title: 'Auto-Invest & Track', desc: 'Set contribution schedules and get monthly retirement health-score nudges.' },
];

/* =====================================================================
   COMPONENT
   ===================================================================== */
export const LandingPage = () => {
    const barRef = useRef(null);

    /* ── Staggered chart bar animation ── */
    useEffect(() => {
        if (!barRef.current) return;
        barRef.current.querySelectorAll('.chart-bar').forEach((bar, i) => {
            bar.style.animationDelay = `${0.05 * i + 0.4}s`;
        });
    }, []);

    /* ── Scroll-reveal IntersectionObserver ── */
    useEffect(() => {
        const targets = document.querySelectorAll('[data-animate]');
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // Don't unobserve — keeps class if they scroll back
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
            <Navbar variant="landing" />

            {/* ═══════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════ */}
            <header className="hero-section">
                <div className="hero-bg" />
                <div className="hero-orb hero-orb-1" />
                <div className="hero-orb hero-orb-2" />

                <div className="hero-content container hero-layout">

                    {/* ── LEFT: COPY ── */}
                    <div style={{ textAlign: 'left' }}>
                        <div className="hero-badge" data-animate="fadeUp" data-delay="100">
                            <ShieldCheck size={12} /> PFRDA Regulated Platform
                        </div>

                        <h1 className="hero-headline" data-animate="fadeUp" data-delay="200">
                            Secure Your{' '}
                            <span className="word-accent">Retirement</span>
                            {' '}with Smart Digital NPS
                        </h1>

                        <p className="hero-subheadline" data-animate="fadeUp" data-delay="300">
                            Government-backed. &nbsp; Secure. &nbsp; Seamless.
                        </p>

                        <div className="hero-cta-group" data-animate="fadeUp" data-delay="400">
                            <button
                                className="btn-hero"
                                onClick={() => alert('Start Onboarding')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                            >
                                Start Investing <ArrowRight size={18} />
                            </button>
                            <button
                                className="btn-ghost-dark"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                                onClick={() => alert('Check Eligibility')}
                            >
                                Check Eligibility
                            </button>
                        </div>

                        <div className="hero-micro-badges" data-animate="blurIn" data-delay="500">
                            <div className="hero-micro-badge"><BadgeCheck size={15} color="#14B8A6" /> PFRDA Regulated</div>
                            <div className="hero-micro-badge"><Lock size={15} color="#14B8A6" /> 256-bit Encrypted</div>
                            <div className="hero-micro-badge"><Users size={15} color="#14B8A6" /> Aadhaar Enabled</div>
                        </div>
                    </div>

                    {/* ── RIGHT: DASHBOARD MOCKUP ── */}
                    <div className="dashboard-wrapper" data-animate="slideLeft" data-delay="200">
                        <div className="dashboard-mockup">
                            <div className="dashboard-topbar">
                                <div>
                                    <div className="corpus-label">Total Corpus</div>
                                    <div className="corpus-amount">₹ 14,23,500</div>
                                </div>
                                <div className="corpus-badge">▲ 12.4%</div>
                            </div>

                            <div className="chart-area" ref={barRef}>
                                <div className="chart-label">Growth Overview — FY 2025</div>
                                <div className="chart-bars">
                                    {CHART_HEIGHTS.map((h, i) => (
                                        <div key={i} className="chart-bar-wrap" style={{ height: '100%' }}>
                                            <div className="chart-bar" style={{ height: `${h}%`, animationDelay: `${0.05 * i + 0.5}s` }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chart-months">
                                    {MONTHS.map(m => <div key={m} className="chart-month">{m}</div>)}
                                </div>
                            </div>

                            <div className="stat-row">
                                {[
                                    { bg: 'rgba(20,184,166,0.10)', icon: <Activity size={15} color="#14B8A6" />, label: 'Risk Profile', value: 'Moderate' },
                                    { bg: 'rgba(34,197,94,0.10)', icon: <TrendingUp size={15} color="#22C55E" />, label: 'Proj. Corpus', value: '₹ 5.2 Cr' },
                                    { bg: 'rgba(37,99,235,0.10)', icon: <BarChart3 size={15} color="#2563EB" />, label: 'Return Rate', value: '11.6%' },
                                    { bg: 'rgba(124,58,237,0.10)', icon: <Wallet size={15} color="#7C3AED" />, label: 'Tax Saved', value: '₹ 46,800' },
                                ].map((s, i) => (
                                    <div className="stat-pill" key={i}>
                                        <div className="stat-pill-icon" style={{ background: s.bg }}>{s.icon}</div>
                                        <div className="stat-pill-label">{s.label}</div>
                                        <div className="stat-pill-value">{s.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="float-card float-card-1">
                            <div className="float-card-icon" style={{ background: 'rgba(34,197,94,0.10)' }}><Users size={16} color="#22C55E" /></div>
                            <div><div className="float-card-label">Active Users</div><div className="float-card-value">7.2 Cr+</div></div>
                        </div>

                        <div className="float-card float-card-2">
                            <div className="float-card-icon" style={{ background: 'rgba(37,99,235,0.10)' }}><Wallet size={16} color="#2563EB" /></div>
                            <div><div className="float-card-label">Monthly SIP</div><div className="float-card-value">₹ 5,000</div></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════════════════════════════════════════════════
                TRUST STRIP
            ═══════════════════════════════════════════════════════ */}
            <div className="trust-strip">
                <div className="container">
                    <div className="trust-items">
                        {TRUST_ITEMS.map((item, i) => (
                            <div
                                className="trust-item"
                                key={i}
                                data-animate="scaleIn"
                                data-delay={String(i * 100 + 100)}
                            >
                                <div className="trust-item-icon">{item.icon}</div>
                                <div>
                                    <div className="trust-item-text-label">{item.label}</div>
                                    <div className="trust-item-text-value">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                HOW IT WORKS
            ═══════════════════════════════════════════════════════ */}
            <section id="how-it-works" className="steps-section py-xxl">
                <div className="container">
                    <div className="text-center" style={{ maxWidth: 580, margin: '0 auto' }}>
                        <div className="section-eyebrow" data-animate="fadeDown">How it Works</div>
                        <h2 className="section-title" data-animate="fadeUp" data-delay="100">
                            Begin Your Journey in 3 Steps
                        </h2>
                        <p className="section-subtitle" data-animate="blurIn" data-delay="200">
                            Our AI-driven process simplifies pension planning. No paperwork, just secure digital verification.
                        </p>
                    </div>

                    <div className="steps-grid">
                        {STEPS.map((step, i) => (
                            <div
                                className="step-card"
                                key={i}
                                data-animate="flipY"
                                data-delay={String(i * 150 + 100)}
                            >
                                <div className="step-number">{step.no}</div>
                                <div className="step-icon-wrap" style={{ background: step.iconBg }}>{step.icon}</div>
                                <div className="step-card-title">{step.title}</div>
                                <p className="step-card-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                FEATURES
            ═══════════════════════════════════════════════════════ */}
            <section id="features" className="features-section py-xxl">
                <div className="container">
                    <div className="text-center" style={{ maxWidth: 580, margin: '0 auto' }}>
                        <div className="section-eyebrow" data-animate="fadeDown">Platform Features</div>
                        <h2 className="section-title" data-animate="fadeUp" data-delay="100">
                            Everything You Need to Retire Well
                        </h2>
                        <p className="section-subtitle" data-animate="blurIn" data-delay="200">
                            Institutional-grade tools. Fintech-level experience. Built for every Indian.
                        </p>
                    </div>

                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div
                                className="feature-card"
                                key={i}
                                data-animate={i % 2 === 0 ? 'slideRight' : 'slideLeft'}
                                data-delay={String((i % 3) * 120 + 100)}
                            >
                                <div className="feature-icon-circle" style={{ background: f.bg }}>{f.icon}</div>
                                <div className="feature-title">{f.title}</div>
                                <p className="feature-desc">{f.desc}</p>
                                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#14B8A6', cursor: 'pointer' }}>
                                    Learn more <ChevronRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                CTA SECTION
            ═══════════════════════════════════════════════════════ */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <div
                            className="hero-badge"
                            style={{ margin: '0 auto 20px', display: 'inline-flex' }}
                            data-animate="fadeDown"
                        >
                            <Star size={12} /> Start in under 5 minutes
                        </div>
                        <h2 className="cta-headline" data-animate="scaleIn" data-delay="100">
                            Ready to Secure Your Retirement?
                        </h2>
                        <p className="cta-sub" data-animate="blurIn" data-delay="200">
                            Join 7 crore+ Indians already building their pension corpus.
                            Open your NPS account today — fully online, fully compliant.
                        </p>
                        <div
                            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
                            data-animate="fadeUp"
                            data-delay="300"
                        >
                            <button
                                className="btn-hero"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                                onClick={() => alert('Open Account')}
                            >
                                Open NPS Account <ArrowRight size={18} />
                            </button>
                            <button
                                className="btn-ghost-dark"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                                onClick={() => alert('Calculate')}
                            >
                                Retirement Calculator
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════════════ */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top" data-animate="fadeUp">
                        <div>
                            <div className="nav-logo" style={{ marginBottom: 4 }}>
                                <div className="nav-logo-icon"><ShieldCheck size={18} color="#FFFFFF" /></div>
                                <span className="nav-logo-text">NPS<span>Central</span></span>
                            </div>
                            <p className="footer-brand-desc">
                                India's most trusted digital platform for National Pension System onboarding. PFRDA regulated. 100% paperless.
                            </p>
                        </div>
                        <div>
                            <div className="footer-col-title">Platform</div>
                            <div className="footer-links">
                                <a href="#" className="footer-link">Open Account</a>
                                <a href="#" className="footer-link">Retirement Calculator</a>
                                <a href="#" className="footer-link">Fund Performance</a>
                                <a href="#" className="footer-link">Tax Benefits</a>
                            </div>
                        </div>
                        <div>
                            <div className="footer-col-title">Support</div>
                            <div className="footer-links">
                                <a href="#" className="footer-link">Help Center</a>
                                <a href="#" className="footer-link">Contact Us</a>
                                <a href="#" className="footer-link">PFRDA Guidelines</a>
                                <a href="#" className="footer-link">FAQs</a>
                            </div>
                        </div>
                        <div>
                            <div className="footer-col-title">Legal</div>
                            <div className="footer-links">
                                <a href="#" className="footer-link">Privacy Policy</a>
                                <a href="#" className="footer-link">Terms of Service</a>
                                <a href="#" className="footer-link">Grievance Policy</a>
                                <a href="#" className="footer-link">Disclosures</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p className="footer-copy">© 2025 NPS Central. Regulated by PFRDA, Govt. of India. CIN: U65929DL2025PLC000001</p>
                        <div className="footer-legal">
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                            <a href="#">PFRDA</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
