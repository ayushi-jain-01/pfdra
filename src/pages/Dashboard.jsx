import React, { useEffect, useRef, useState } from 'react';
import {
    CheckCircle2, Lock, Sun, TrendingUp, RefreshCw, FileText,
    Phone, ChevronRight, Shield, Bell, Sparkles, AlertCircle,
    ArrowUpRight, Zap, Target, BarChart2, CalendarDays,
    CreditCard, PieChart, Info
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import './Dashboard.css';

/* ─── STATIC DATA ──────────────────────────────────────────── */

const PROJECTION = [
    { age: 30, value: 14.2 }, { age: 33, value: 20.8 }, { age: 36, value: 30.5 },
    { age: 39, value: 43.9 }, { age: 42, value: 62.4 }, { age: 45, value: 87.1 },
    { age: 48, value: 119.6 }, { age: 51, value: 161.4 }, { age: 54, value: 213.8 },
    { age: 57, value: 277.3 }, { age: 60, value: 353.7 },
];

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const CONTRIBUTIONS = [12000, 15000, 15000, 18000, 15000, 15000, 18500];

const ALLOCATION = [
    { label: 'Equity (E)', pct: 60, color: '#14B8A6' },
    { label: 'Govt. Bonds (G)', pct: 25, color: '#2563EB' },
    { label: 'Corporate Debt (C)', pct: 15, color: '#94A3B8' },
];

const KPI_ITEMS = [
    { label: 'PRAN Number', value: '1100229381', sub: 'Active since 2018', icon: '🪪' },
    { label: 'Monthly SIP', value: '₹15,000', sub: 'Next: Nov 5, 2025', icon: '📅' },
    { label: 'Annualised Return', value: '12.4%', sub: '+1.2% vs benchmark', icon: '📈' },
    { label: 'Tax Saved (FY 25)', value: '₹46,800', sub: 'Under 80C + 80CCD', icon: '💰' },
];

const ALERTS = [
    { type: 'success', text: 'SIP of ₹15,000 credited successfully on Oct 5', icon: CheckCircle2 },
    { type: 'warning', text: 'Nominee details are missing — add a nominee now', icon: AlertCircle },
    { type: 'info', text: 'New fund manager SBI Pension offers 13.2% 5Y returns', icon: Info },
];

const RECENT_TX = [
    { label: 'Monthly SIP', date: 'Oct 5, 2025', amount: '+₹15,000', status: 'Credited', positive: true },
    { label: 'Employer Contribution', date: 'Oct 5, 2025', amount: '+₹7,500', status: 'Credited', positive: true },
    { label: 'Withdrawal (Partial)', date: 'Sep 12, 2025', amount: '-₹10,000', status: 'Processed', positive: false },
    { label: 'Monthly SIP', date: 'Sep 5, 2025', amount: '+₹15,000', status: 'Credited', positive: true },
];

/* ─── SMOOTH SVG PATH ─────────────────────────────────────── */
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

/* ─── READINESS RING ─────────────────────────────────────── */
function ReadinessRing({ score = 85 }) {
    const [display, setDisplay] = useState(0);
    const [ring, setRing] = useState(0);
    const R = 76, CX = 96, CY = 96;
    const circumference = 2 * Math.PI * R;

    useEffect(() => {
        let n = 0;
        const numTick = setInterval(() => {
            n += 1.8;
            if (n >= score) { setDisplay(score); clearInterval(numTick); }
            else setDisplay(Math.round(n));
        }, 18);
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
                    <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="60%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#4C1D95" />
                    </linearGradient>
                </defs>
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={10} />
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="url(#ringGrad)" strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${gap}`}
                    strokeDashoffset={circumference * 0.25}
                    filter="url(#ringGlow)"
                />
                <text x={CX} y={CY - 12} textAnchor="middle"
                    fontSize={38} fontWeight={800} fill="#FFFFFF"
                    fontFamily="Inter" letterSpacing="-2">{display}%</text>
                <text x={CX} y={CY + 10} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill="#14B8A6"
                    fontFamily="Inter" letterSpacing="0.06em">ON TRACK</text>
                <text x={CX} y={CY + 26} textAnchor="middle"
                    fontSize={10} fontWeight={500} fill="rgba(255,255,255,0.40)"
                    fontFamily="Inter">Retirement Readiness</text>
            </svg>
            {/* Score breakdown mini pills */}
            <div className="ring-pills">
                <div className="ring-pill ring-pill-green">
                    <ArrowUpRight size={10} /><span>+2.1% this quarter</span>
                </div>
            </div>
        </div>
    );
}

/* ─── PROJECTION CHART ─────────────────────────────────────── */
function ProjectionChart() {
    const W = 640, H = 240;
    const { d, xs, ys, maxV } = smoothPath(PROJECTION, W, H);
    const areaClose = `${d} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;
    const currentIdx = 5;

    return (
        <div className="proj-outer">
            <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" preserveAspectRatio="none"
                style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="projArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.22)" />
                        <stop offset="70%" stopColor="rgba(20,184,166,0.06)" />
                        <stop offset="100%" stopColor="rgba(20,184,166,0)" />
                    </linearGradient>
                    <linearGradient id="projLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((f, i) => (
                    <line key={i}
                        x1={0} y1={H * (1 - f * 0.88) - H * 0.06}
                        x2={W} y2={H * (1 - f * 0.88) - H * 0.06}
                        stroke="#E5E7EB" strokeOpacity={0.5} strokeDasharray="4 8" strokeWidth={1} />
                ))}
                <path d={areaClose} fill="url(#projArea)" />
                <path d={d} fill="none" stroke="url(#projLine)" strokeWidth={2.5}
                    strokeLinecap="round" className="proj-draw" />
                {/* Now marker */}
                <circle cx={xs[currentIdx]} cy={ys[currentIdx]} r={7}
                    fill="#14B8A6" stroke="#fff" strokeWidth={2.5} />
                <rect x={xs[currentIdx] - 22} y={ys[currentIdx] - 34} width={44} height={22} rx={5}
                    fill="#0F172A" opacity={0.88} />
                <text x={xs[currentIdx]} y={ys[currentIdx] - 18} textAnchor="middle"
                    fontSize={10} fill="#fff" fontFamily="Inter" fontWeight={700}>NOW</text>
                {/* End marker */}
                <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={7}
                    fill="#2563EB" stroke="#fff" strokeWidth={2.5} />
                <text x={xs[xs.length - 1] - 4} y={ys[ys.length - 1] - 16} textAnchor="middle"
                    fontSize={10} fill="#2563EB" fontFamily="Inter" fontWeight={700}>₹3.54 Cr</text>
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

/* ─── DONUT CHART ─────────────────────────────────────────── */
function DonutChart() {
    const R = 78, CX = 100, CY = 100, SW = 26;
    const circ = 2 * Math.PI * R;
    let cumPct = 0;
    return (
        <div className="donut-outer">
            <svg width={200} height={200} viewBox="0 0 200 200">
                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={SW} />
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
                            className="donut-seg" />
                    );
                })}
                <text x={CX} y={CY - 8} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill="#94A3B8" fontFamily="Inter" letterSpacing="0.06em">PORTFOLIO</text>
                <text x={CX} y={CY + 10} textAnchor="middle"
                    fontSize={14} fontWeight={700} fill="#0F172A" fontFamily="Inter">Balanced</text>
            </svg>
        </div>
    );
}

/* ─── CONTRIBUTION BARS ───────────────────────────────────── */
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

/* ─── MILESTONE TRACKER ───────────────────────────────────── */
function MilestoneTracker() {
    const milestones = [
        { label: '₹25L Corpus', pct: 100, done: true },
        { label: '₹50L Corpus', pct: 100, done: true },
        { label: '₹1 Cr Corpus', pct: 72, done: false },
        { label: '₹2 Cr Corpus', pct: 28, done: false },
        { label: '₹3.54 Cr Goal', pct: 8, done: false },
    ];
    return (
        <div className="milestone-list">
            {milestones.map((m, i) => (
                <div key={i} className={`milestone-row${m.done ? ' milestone-done' : ''}`}>
                    <div className="milestone-dot">
                        {m.done
                            ? <CheckCircle2 size={16} color="#22C55E" />
                            : <div className="milestone-empty-dot" />}
                    </div>
                    <div className="milestone-body">
                        <div className="milestone-top">
                            <span className="milestone-label">{m.label}</span>
                            <span className={`milestone-pct${m.done ? ' milestone-pct-done' : ''}`}>{m.pct}%</span>
                        </div>
                        <div className="milestone-track">
                            <div className="milestone-fill"
                                style={{ width: `${m.pct}%`, background: m.done ? '#22C55E' : 'linear-gradient(90deg,#0F9488,#14B8A6)' }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export const Dashboard = () => {
    const [activeAlert, setActiveAlert] = useState(0);

    /* Scroll-reveal */
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* Alert carousel */
    useEffect(() => {
        const t = setInterval(() => setActiveAlert(a => (a + 1) % ALERTS.length), 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="nps-root">
            <Navbar variant="dashboard" />

            {/* ══ HERO ═══════════════════════════════════════════════ */}
            <section className="nps-hero">
                <div className="hero-orb hero-orb-a" />
                <div className="hero-orb hero-orb-b" />
                <div className="hero-orb hero-orb-c" />

                <div className="nps-container">

                    {/* Alert ticker */}
                    <div className="hero-alert-ticker" data-reveal="up">
                        {ALERTS.map((al, i) => {
                            const Icon = al.icon;
                            return (
                                <div key={i} className={`hero-alert-item hero-alert-${al.type}${activeAlert === i ? ' hero-alert-active' : ''}`}>
                                    <Icon size={13} />
                                    <span>{al.text}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="hero-grid">
                        {/* Left */}
                        <div className="hero-left" data-reveal="up">
                            <div className="hero-greeting">
                                <Sun size={18} color="#FCD34D" />
                                Good Morning, Priya
                                <span className="hero-date">· {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>

                            <div className="hero-corpus-label">Projected Retirement Corpus</div>
                            <div className="hero-corpus-value">₹2.45 Crore</div>
                            <div className="hero-corpus-sub">At current contribution rate by age 60 · 15 years remaining</div>

                            {/* Live delta badge */}
                            <div className="hero-delta-row">
                                <span className="hero-delta-badge">
                                    <ArrowUpRight size={13} />+₹18,420 this month
                                </span>
                                <span className="hero-delta-sep">·</span>
                                <span className="hero-delta-xirr">XIRR 12.4%</span>
                            </div>

                            {/* KPI strip */}
                            <div className="hero-kpi-strip">
                                {KPI_ITEMS.map((k, i) => (
                                    <div key={i} className="hero-kpi" data-reveal="up" data-delay={i * 80}>
                                        <div className="hero-kpi-icon">{k.icon}</div>
                                        <div className="hero-kpi-val">{k.value}</div>
                                        <div className="hero-kpi-label">{k.label}</div>
                                        <div className="hero-kpi-sub">{k.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="hero-right" data-reveal="left">
                            <ReadinessRing score={85} />
                            <p className="ring-desc">
                                Excellent trajectory — consistent SIPs<br />are compounding your future wealth.
                            </p>
                            <button className="hero-plan-btn"
                                onClick={() => window.location.href = '/plan-retirement'}>
                                <Sparkles size={14} />
                                Run Retirement Simulation
                            </button>
                        </div>
                    </div>
                </div>

                <div className="hero-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
                        <path d="M0,40 C300,70 900,10 1200,40 L1200,60 L0,60 Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* ══ CONTENT ════════════════════════════════════════════ */}
            <main className="nps-main">
                <div className="nps-container">

                    {/* ── WEALTH PROJECTION ── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="nps-card">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Wealth Growth Projection</h2>
                                    <p className="nps-card-sub">Your corpus trajectory from age 30 → 60</p>
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
                                <div className="proj-arrow">·</div>
                                <div className="proj-stat">
                                    <span className="proj-stat-val">₹90L</span>
                                    <span className="proj-stat-lbl">Total Invested</span>
                                </div>
                                <div style={{ flex: 1 }} />
                                <button className="nps-pill-btn"
                                    onClick={() => window.location.href = '/plan-retirement'}>
                                    Simulate scenarios →
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ── ALLOCATION + CONTRIBUTIONS 2-col ── */}
                    <section className="nps-two-col">
                        {/* Allocation donut */}
                        <div className="nps-card" data-reveal="up">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Asset Allocation</h2>
                                    <p className="nps-card-sub">Current portfolio mix · SBI Pension Fund</p>
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
                                        Balanced risk. Aligned with your 25-year retirement horizon.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contribution bars */}
                        <div className="nps-card" data-reveal="up" data-delay="120">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Monthly Contributions</h2>
                                    <p className="nps-card-sub">Apr – Oct 2025</p>
                                </div>
                                <div className="contrib-badge">
                                    <CheckCircle2 size={13} color="#22C55E" /> Consistent
                                </div>
                            </div>
                            <ContribBars />
                            <div className="contrib-footer">
                                <div className="contrib-stat">
                                    <span>FY Total</span>
                                    <strong>₹1,08,500</strong>
                                </div>
                                <div className="contrib-stat">
                                    <span>Employer Match</span>
                                    <strong>₹54,250</strong>
                                </div>
                                <div className="contrib-stat">
                                    <span>Tax Benefit</span>
                                    <strong style={{ color: '#22C55E' }}>₹46,800</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── MILESTONES + RECENT TRANSACTIONS 2-col ── */}
                    <section className="nps-two-col">
                        {/* Milestones */}
                        <div className="nps-card" data-reveal="up">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Corpus Milestones</h2>
                                    <p className="nps-card-sub">Track your wealth building journey</p>
                                </div>
                                <Target size={18} color="#14B8A6" />
                            </div>
                            <MilestoneTracker />
                        </div>

                        {/* Recent Transactions */}
                        <div className="nps-card" data-reveal="up" data-delay="100">
                            <div className="nps-card-head">
                                <div>
                                    <h2 className="nps-card-title">Recent Transactions</h2>
                                    <p className="nps-card-sub">Last 4 account activities</p>
                                </div>
                                <button className="nps-pill-btn">View All</button>
                            </div>
                            <div className="tx-list">
                                {RECENT_TX.map((tx, i) => (
                                    <div key={i} className="tx-row">
                                        <div className={`tx-icon-wrap${tx.positive ? ' tx-icon-pos' : ' tx-icon-neg'}`}>
                                            {tx.positive
                                                ? <ArrowUpRight size={15} color="#22C55E" />
                                                : <CreditCard size={15} color="#94A3B8" />}
                                        </div>
                                        <div className="tx-body">
                                            <div className="tx-label">{tx.label}</div>
                                            <div className="tx-date">{tx.date}</div>
                                        </div>
                                        <div className="tx-right">
                                            <div className={`tx-amount${tx.positive ? ' tx-pos' : ' tx-neg'}`}>{tx.amount}</div>
                                            <div className="tx-status">{tx.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── QUICK ACTIONS ── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="nps-card actions-card">
                            <div className="nps-card-head" style={{ marginBottom: 20 }}>
                                <div>
                                    <h2 className="nps-card-title">Quick Actions</h2>
                                    <p className="nps-card-sub">Manage your NPS account</p>
                                </div>
                                <Zap size={18} color="#F59E0B" />
                            </div>
                            <div className="actions-grid">
                                {[
                                    {
                                        label: 'Top-up Contribution',
                                        desc: 'Add lump-sum to boost corpus',
                                        icon: <TrendingUp size={20} color="#fff" />,
                                        primary: true,
                                        href: '#',
                                    },
                                    {
                                        label: 'Plan Retirement',
                                        desc: 'Simulate your retirement corpus',
                                        icon: <BarChart2 size={20} color="#14B8A6" />,
                                        primary: false,
                                        href: '/plan-retirement',
                                    },
                                    {
                                        label: 'Change Risk Profile',
                                        desc: 'Adjust equity–debt allocation',
                                        icon: <RefreshCw size={20} color="#2563EB" />,
                                        primary: false,
                                        href: '/onboarding',
                                    },
                                    {
                                        label: 'Download Statement',
                                        desc: 'Annual account statement PDF',
                                        icon: <FileText size={20} color="#475569" />,
                                        primary: false,
                                        href: '#',
                                    },
                                    {
                                        label: 'Set SIP Date',
                                        desc: 'Change your auto-debit date',
                                        icon: <CalendarDays size={20} color="#475569" />,
                                        primary: false,
                                        href: '#',
                                    },
                                    {
                                        label: 'Talk to Advisor',
                                        desc: 'Free retirement planning call',
                                        icon: <Phone size={20} color="#475569" />,
                                        primary: false,
                                        href: '#',
                                    },
                                ].map((a, i) => (
                                    <button key={i}
                                        className={`action-btn ${a.primary ? 'action-btn-primary' : 'action-btn-secondary'}`}
                                        onClick={() => a.href !== '#' && (window.location.href = a.href)}>
                                        <div className={`action-icon-wrap ${a.primary ? 'icon-primary' : 'icon-secondary'}`}>
                                            {a.icon}
                                        </div>
                                        <div className="action-text">
                                            <span className="action-label">{a.label}</span>
                                            <span className="action-desc">{a.desc}</span>
                                        </div>
                                        <ChevronRight size={15} className="action-arrow" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── REASSURANCE ── */}
                    <section className="nps-section" data-reveal="up">
                        <div className="reassure-strip">
                            {[
                                { icon: <Shield size={18} color="#14B8A6" />, text: 'Regulated by PFRDA, Govt. of India' },
                                { icon: <Lock size={18} color="#14B8A6" />, text: '256-bit SSL encrypted & secure' },
                                { icon: <CheckCircle2 size={18} color="#14B8A6" />, text: 'DPDP Act 2023 data privacy compliant' },
                            ].map((r, i) => (
                                <div key={i} className="reassure-item">{r.icon}<span>{r.text}</span></div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="nps-footer">
                <div className="nps-container nps-footer-inner">
                    <span>© 2025 NPS Central · CIN: U65929DL2025PLC000001</span>
                    <span>Regulated by PFRDA · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
};
