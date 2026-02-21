import React, { useEffect, useRef, useState } from 'react';
import {
    CheckCircle2, Lock, Sun,
    TrendingUp, RefreshCw, FileText, Phone, ChevronRight, Shield
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import './Dashboard.css';

/* ─── STATIC DATA ──────────────────────────────────────────── */

const PROJECTION = [
    { age: 30, value: 14.2 },
    { age: 33, value: 20.8 },
    { age: 36, value: 30.5 },
    { age: 39, value: 43.9 },
    { age: 42, value: 62.4 },
    { age: 45, value: 87.1 },
    { age: 48, value: 119.6 },
    { age: 51, value: 161.4 },
    { age: 54, value: 213.8 },
    { age: 57, value: 277.3 },
    { age: 60, value: 353.7 },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const CONTRIBUTIONS = [12000, 15000, 15000, 18000, 15000, 15000];

const ALLOCATION = [
    { label: 'Equity', pct: 60, color: '#14B8A6' }, /* theme --teal   */
    { label: 'Govt. Bonds', pct: 25, color: '#2563EB' }, /* theme --blue   */
    { label: 'Corporate Debt', pct: 15, color: '#94A3B8' }, /* theme --text-3 — distinct from border */
];

const KPI_ITEMS = [
    { label: 'PRAN Number', value: '1100229381', sub: 'Active since 2018' },
    { label: 'Monthly Contribution', value: '₹15,000', sub: 'Next: Oct 5, 2025' },
    { label: 'Annualised Return', value: '12.4%', sub: '+1.2% vs benchmark' },
    { label: 'Tax Saved (FY 24)', value: '₹46,800', sub: 'Under 80C + 80CCD' },
];

/* ─── SMOOTH SVG PATH ──────────────────────────────────────── */
function smoothPath(pts, W, H) {
    const maxV = Math.max(...pts.map(p => p.value)) * 1.08;
    const xs = pts.map((_, i) => (i / (pts.length - 1)) * W);
    const ys = pts.map(p => H - (p.value / maxV) * H * 0.88 - H * 0.06);
    let d = `M ${xs[0]} ${ys[0]}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const cpx1 = xs[i] + (xs[i + 1] - xs[i]) * 0.45;
        const cpx2 = xs[i + 1] - (xs[i + 1] - xs[i]) * 0.45;
        d += ` C ${cpx1} ${ys[i]}, ${cpx2} ${ys[i + 1]}, ${xs[i + 1]} ${ys[i + 1]}`;
    }
    return { d, xs, ys, maxV };
}

/* ─── READINESS RING ───────────────────────────────────────── */
function ReadinessRing({ score = 85 }) {
    const [display, setDisplay] = useState(0);
    const [ring, setRing] = useState(0);
    const R = 76, CX = 96, CY = 96;
    const circumference = 2 * Math.PI * R;

    useEffect(() => {
        // Number counter
        let n = 0;
        const numTick = setInterval(() => {
            n += 1.8;
            if (n >= score) { setDisplay(score); clearInterval(numTick); }
            else setDisplay(Math.round(n));
        }, 18);
        // Ring fill
        let r = 0;
        const ringTick = setInterval(() => {
            r += 1.5;
            if (r >= score) { setRing(score); clearInterval(ringTick); }
            else setRing(r);
        }, 14);
        return () => { clearInterval(numTick); clearInterval(ringTick); };
    }, [score]);

    const filled = (ring / 100) * circumference;
    const gap = circumference - filled;

    return (
        <div className="ring-wrap">
            <svg width={192} height={192} viewBox="0 0 192 192">
                <defs>
                    <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    {/* Theme: teal → indigo — matches hero gradient direction */}
                    <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="60%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#4C1D95" />
                    </linearGradient>
                </defs>
                {/* Track */}
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
                {/* Progress arc */}
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="url(#ringGrad)" strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${gap}`}
                    strokeDashoffset={circumference * 0.25}
                    filter="url(#ringGlow)"
                />
                {/* Score */}
                <text x={CX} y={CY - 10} textAnchor="middle"
                    fontSize={38} fontWeight={800} fill="#FFFFFF"
                    fontFamily="Inter" letterSpacing="-2">
                    {display}%
                </text>
                <text x={CX} y={CY + 16} textAnchor="middle"
                    fontSize={13} fontWeight={600} fill="#14B8A6"
                    fontFamily="Inter" letterSpacing="0.04em">
                    ON TRACK
                </text>
            </svg>
            <div className="ring-caption">Retirement Readiness</div>
        </div>
    );
}

/* ─── PROJECTION CHART ─────────────────────────────────────── */
function ProjectionChart() {
    const W = 640, H = 240;
    const { d, xs, ys, maxV } = smoothPath(PROJECTION, W, H);
    const areaClose = `${d} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;
    const currentIdx = 5; // age 45 = "now"

    return (
        <div className="proj-outer">
            <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" preserveAspectRatio="none"
                style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                    {/* Theme teal area fill — matches #14B8A6 */}
                    <linearGradient id="projArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.20)" />
                        <stop offset="75%" stopColor="rgba(20,184,166,0.06)" />
                        <stop offset="100%" stopColor="rgba(20,184,166,0)" />
                    </linearGradient>
                </defs>
                {/* Subtle horizontal grid lines */}
                {[0.25, 0.5, 0.75].map((f, i) => (
                    <line key={i}
                        x1={0} y1={H * (1 - f * 0.88) - H * 0.06}
                        x2={W} y2={H * (1 - f * 0.88) - H * 0.06}
                        stroke="#E5E7EB" strokeOpacity={0.5} strokeDasharray="4 8" strokeWidth={1} />
                ))}
                {/* Area fill */}
                <path d={areaClose} fill="url(#projArea)" />
                {/* Line */}
                <path d={d} fill="none" stroke="#14B8A6" strokeWidth={2.5}
                    strokeLinecap="round" className="proj-draw" />
                {/* "Now" marker */}
                <circle cx={xs[currentIdx]} cy={ys[currentIdx]} r={6}
                    fill="#14B8A6" stroke="#fff" strokeWidth={2.5} />
                <rect x={xs[currentIdx] - 20} y={ys[currentIdx] - 32} width={40} height={20} rx={4}
                    fill="#0F172A" opacity={0.85} />
                <text x={xs[currentIdx]} y={ys[currentIdx] - 18} textAnchor="middle"
                    fontSize={10} fill="#fff" fontFamily="Inter" fontWeight={700}>NOW</text>
                {/* End marker */}
                <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={7}
                    fill="#14B8A6" stroke="#fff" strokeWidth={2.5} />
                <text x={xs[xs.length - 1] - 2} y={ys[ys.length - 1] - 16} textAnchor="middle"
                    fontSize={10} fill="#14B8A6" fontFamily="Inter" fontWeight={700}>₹3.54 Cr</text>
                {/* X-axis age labels */}
                {PROJECTION.filter((_, i) => i % 2 === 0).map((p, i) => {
                    const origIdx = i * 2;
                    return (
                        <text key={i} x={xs[origIdx]} y={H + 20} textAnchor="middle"
                            fontSize={11} fill="#94A3B8" fontFamily="Inter">Age {p.age}</text>
                    );
                })}
            </svg>
        </div>
    );
}

/* ─── DONUT CHART ──────────────────────────────────────────── */
function DonutChart() {
    const R = 78, CX = 100, CY = 100, SW = 26;
    const circ = 2 * Math.PI * R;
    let cumPct = 0;

    return (
        <div className="donut-outer">
            <svg width={200} height={200} viewBox="0 0 200 200">
                {/* Track */}
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="#F1F5F9" strokeWidth={SW} />
                {ALLOCATION.map((seg, i) => {
                    const filled = (seg.pct / 100) * circ;
                    const offset = -(cumPct / 100) * circ + circ * 0.25;
                    cumPct += seg.pct;
                    return (
                        <circle key={i} cx={CX} cy={CY} r={R} fill="none"
                            stroke={seg.color} strokeWidth={SW}
                            strokeLinecap="butt"
                            strokeDasharray={`${filled - 1.5} ${circ - filled + 1.5}`}
                            strokeDashoffset={offset}
                            className="donut-seg"
                        />
                    );
                })}
                {/* Center labels */}
                <text x={CX} y={CY - 8} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill="#94A3B8" fontFamily="Inter"
                    letterSpacing="0.06em">PORTFOLIO</text>
                <text x={CX} y={CY + 10} textAnchor="middle"
                    fontSize={14} fontWeight={700} fill="#0F172A" fontFamily="Inter">Balanced</text>
            </svg>
        </div>
    );
}

/* ─── CONTRIBUTION BARS ────────────────────────────────────── */
function ContribBars() {
    const maxV = Math.max(...CONTRIBUTIONS);
    const BAR_H = 140;

    return (
        <div className="bar-chart">
            {CONTRIBUTIONS.map((val, i) => {
                const isLatest = i === CONTRIBUTIONS.length - 1;
                const h = (val / maxV) * BAR_H;
                return (
                    <div key={i} className="bar-col">
                        <div className="bar-amount">
                            {isLatest ? <span className="bar-badge">Latest</span> : null}
                            <span className="bar-val">₹{(val / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="bar-track" style={{ height: BAR_H }}>
                            <div
                                className={`bar-fill ${isLatest ? 'bar-fill-accent' : ''}`}
                                style={{ height: h, animationDelay: `${i * 80}ms` }}
                            />
                        </div>
                        <div className="bar-month">{MONTHS[i]}</div>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export const Dashboard = () => {
    const [scrolled, setScrolled] = useState(false);

    /* Scroll-reveal */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="nps-root">

            {/* ── SHARED NAVBAR (dashboard variant) ─────────────── */}
            <Navbar variant="dashboard" />

            {/* ══ HERO — dark gradient ══════════════════════════════ */}
            <section className="nps-hero">
                {/* Orbs */}
                <div className="hero-orb hero-orb-a" />
                <div className="hero-orb hero-orb-b" />

                <div className="nps-container">
                    <div className="hero-grid">

                        {/* Left — greeting + corpus */}
                        <div className="hero-left" data-reveal="up">
                            <div className="hero-greeting">
                                <Sun size={18} color="#FCD34D" />
                                Good Morning, Priya
                            </div>

                            <div className="hero-corpus-label">Projected Retirement Corpus</div>
                            <div className="hero-corpus-value">₹2.45 Crore</div>
                            <div className="hero-corpus-sub">At current contribution rate by age 60</div>

                            {/* KPI strip */}
                            <div className="hero-kpi-strip">
                                {KPI_ITEMS.map((k, i) => (
                                    <div key={i} className="hero-kpi" data-reveal="up" data-delay={i * 80}>
                                        <div className="hero-kpi-val">{k.value}</div>
                                        <div className="hero-kpi-label">{k.label}</div>
                                        <div className="hero-kpi-sub">{k.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — readiness ring */}
                        <div className="hero-right" data-reveal="left">
                            <ReadinessRing score={85} />
                            <p className="ring-desc">
                                Your retirement plan is on excellent track.<br />
                                Consistent contributions are your superpower.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Bottom wave */}
                <div className="hero-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,40 C300,70 900,10 1200,40 L1200,60 L0,60 Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* ══ CONTENT AREA ═════════════════════════════════════ */}
            <main className="nps-main">
                <div className="nps-container">

                    {/* ── SECTION 2: Projection chart ─────────────────── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="nps-card">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Wealth Growth Projection</h2>
                                    <p className="nps-card-sub">Your corpus growth from age 30 → 60</p>
                                </div>
                                <div className="proj-badge">
                                    <CheckCircle2 size={14} color="#22C55E" />
                                    Moderate Risk
                                </div>
                            </div>
                            <ProjectionChart />
                            <div className="proj-footer">
                                <div className="proj-stat">
                                    <span className="proj-stat-val">₹14.2L</span>
                                    <span className="proj-stat-lbl">Corpus Today</span>
                                </div>
                                <div className="proj-arrow">→</div>
                                <div className="proj-stat">
                                    <span className="proj-stat-val" style={{ color: '#14B8A6' }}>₹3.54 Cr</span>
                                    <span className="proj-stat-lbl">Projected at 60</span>
                                </div>
                                <div className="proj-arrow">·</div>
                                <div className="proj-stat">
                                    <span className="proj-stat-val">12.4%</span>
                                    <span className="proj-stat-lbl">Avg. XIRR</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── SECTIONS 3 + 4: Donut + Bars (2-col) ────────── */}
                    <section className="nps-two-col">

                        {/* Allocation donut */}
                        <div className="nps-card" data-reveal="up">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Asset Allocation</h2>
                                    <p className="nps-card-sub">Current portfolio mix</p>
                                </div>
                                <button className="nps-pill-btn">Rebalance</button>
                            </div>
                            <div className="alloc-layout">
                                <DonutChart />
                                <div className="alloc-legend">
                                    {ALLOCATION.map((seg, i) => (
                                        <div key={i} className="alloc-row">
                                            <div className="alloc-row-left">
                                                <div className="alloc-dot" style={{ background: seg.color }} />
                                                <span className="alloc-name">{seg.label}</span>
                                            </div>
                                            <span className="alloc-pct">{seg.pct}%</span>
                                        </div>
                                    ))}
                                    <p className="alloc-note">
                                        Moderate risk. Aligned with your 25-year retirement horizon.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contribution bars */}
                        <div className="nps-card" data-reveal="up" data-delay="120">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Monthly Contributions</h2>
                                    <p className="nps-card-sub">Apr – Sep 2025</p>
                                </div>
                                <div className="contrib-badge">
                                    <CheckCircle2 size={13} color="#22C55E" /> Consistent
                                </div>
                            </div>
                            <ContribBars />
                            <div className="contrib-footer">
                                <div className="contrib-stat">
                                    <span>FY Total</span>
                                    <strong>₹90,000</strong>
                                </div>
                                <div className="contrib-stat">
                                    <span>Employer Match</span>
                                    <strong>₹45,000</strong>
                                </div>
                                <div className="contrib-stat">
                                    <span>Tax Benefit</span>
                                    <strong style={{ color: '#22C55E' }}>₹46,800</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── SECTION 5: Quick actions ─────────────────────── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="nps-card actions-card">
                            <h2 className="nps-card-title" style={{ marginBottom: 20 }}>Quick Actions</h2>
                            <div className="actions-grid">
                                {[
                                    {
                                        label: 'Top-up Contribution',
                                        desc: 'Add lump-sum to boost your corpus',
                                        icon: <TrendingUp size={20} color="#fff" />,
                                        primary: true,
                                    },
                                    {
                                        label: 'Change Risk Profile',
                                        desc: 'Adjust equity–debt allocation',
                                        icon: <RefreshCw size={20} color="#0F172A" />,
                                        primary: false,
                                    },
                                    {
                                        label: 'Download Statement',
                                        desc: 'Annual account statement PDF',
                                        icon: <FileText size={20} color="#0F172A" />,
                                        primary: false,
                                    },
                                    {
                                        label: 'Talk to Advisor',
                                        desc: 'Free retirement planning call',
                                        icon: <Phone size={20} color="#0F172A" />,
                                        primary: false,
                                    },
                                ].map((a, i) => (
                                    <button key={i} className={`action-btn ${a.primary ? 'action-btn-primary' : 'action-btn-secondary'}`}>
                                        <div className={`action-icon-wrap ${a.primary ? 'icon-primary' : 'icon-secondary'}`}>
                                            {a.icon}
                                        </div>
                                        <div className="action-text">
                                            <span className="action-label">{a.label}</span>
                                            <span className="action-desc">{a.desc}</span>
                                        </div>
                                        <ChevronRight size={16} className="action-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Reassurance strip ────────────────────────────── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="reassure-strip">
                            {[
                                { icon: <Shield size={18} color="#14B8A6" />, text: 'Regulated by PFRDA, Govt. of India' },
                                { icon: <Lock size={18} color="#14B8A6" />, text: '256-bit SSL encrypted & secure' },
                                { icon: <CheckCircle2 size={18} color="#14B8A6" />, text: 'DPDP Act 2023 data privacy compliant' },
                            ].map((r, i) => (
                                <div key={i} className="reassure-item">
                                    {r.icon}
                                    <span>{r.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* ── FOOTER ─────────────────────────────────────────── */}
            <footer className="nps-footer">
                <div className="nps-container nps-footer-inner">
                    <span>© 2025 NPS Central · CIN: U65929DL2025PLC000001</span>
                    <span>Regulated by PFRDA · All rights reserved</span>
                </div>
            </footer>

        </div>
    );
};
