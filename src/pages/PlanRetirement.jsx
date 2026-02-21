import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import {
    Sparkles, Info, Shield, Lock, CheckCircle2,
    TrendingUp, ChevronRight, Target, AlertCircle
} from 'lucide-react';
import './PlanRetirement.css';

/* ─── Finance helpers ─────────────────────────────── */
function computeCorpus(monthlyContrib, currentAge, retirementAge, riskProfile) {
    const rateMap = { Conservative: 0.08, Balanced: 0.11, Aggressive: 0.135 };
    const r = rateMap[riskProfile] / 12;
    const n = (retirementAge - currentAge) * 12;
    if (n <= 0) return 0;
    const fv = monthlyContrib * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return Math.round(fv / 100000) / 10; // in Crore, 1 decimal
}

function formatCrore(val) {
    if (val >= 1) return `₹${val.toFixed(2)} Cr`;
    return `₹${(val * 100).toFixed(0)} L`;
}

/* ─── Readiness Ring ──────────────────────────────── */
function ReadinessRing({ score }) {
    const [display, setDisplay] = useState(0);
    const [ring, setRing] = useState(0);
    const R = 76, CX = 96, CY = 96;
    const circumference = 2 * Math.PI * R;

    useEffect(() => {
        let n = 0;
        const numTick = setInterval(() => {
            n += 1.6;
            if (n >= score) { setDisplay(score); clearInterval(numTick); }
            else setDisplay(Math.round(n));
        }, 16);
        let r = 0;
        const ringTick = setInterval(() => {
            r += 1.4;
            if (r >= score) { setRing(score); clearInterval(ringTick); }
            else setRing(r);
        }, 13);
        return () => { clearInterval(numTick); clearInterval(ringTick); };
    }, [score]);

    const filled = (ring / 100) * circumference;
    const gap = circumference - filled;
    const isOnTrack = score >= 75;

    return (
        <div className="rp-ring-wrap">
            <svg width={192} height={192} viewBox="0 0 192 192">
                <defs>
                    <filter id="rpRingGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="rpRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="60%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#4C1D95" />
                    </linearGradient>
                </defs>
                {/* Track */}
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
                {/* Progress */}
                <circle cx={CX} cy={CY} r={R} fill="none"
                    stroke="url(#rpRingGrad)" strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${gap}`}
                    strokeDashoffset={circumference * 0.25}
                    filter="url(#rpRingGlow)"
                />
                <text x={CX} y={CY - 10} textAnchor="middle"
                    fontSize={36} fontWeight={800} fill="#FFFFFF"
                    fontFamily="Inter" letterSpacing="-2">
                    {display}%
                </text>
                <text x={CX} y={CY + 16} textAnchor="middle"
                    fontSize={12} fontWeight={700}
                    fill={isOnTrack ? "#14B8A6" : "#F59E0B"}
                    fontFamily="Inter" letterSpacing="0.05em">
                    {isOnTrack ? "ON TRACK" : "NEEDS BOOST"}
                </text>
            </svg>
            <div className="rp-ring-caption">Retirement Readiness</div>
        </div>
    );
}

/* ─── SVG Area Chart ──────────────────────────────── */
function GrowthChart({ points }) {
    const W = 600, H = 200;
    const maxV = Math.max(...points.map(p => p.v)) * 1.1;
    const xs = points.map((_, i) => (i / (points.length - 1)) * W);
    const ys = points.map(p => H - (p.v / maxV) * H * 0.86 - H * 0.05);

    let d = `M ${xs[0]} ${ys[0]}`;
    for (let i = 0; i < points.length - 1; i++) {
        const cpx1 = xs[i] + (xs[i + 1] - xs[i]) * 0.45;
        const cpx2 = xs[i + 1] - (xs[i + 1] - xs[i]) * 0.45;
        d += ` C ${cpx1} ${ys[i]}, ${cpx2} ${ys[i + 1]}, ${xs[i + 1]} ${ys[i + 1]}`;
    }
    const area = `${d} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;

    return (
        <div className="rp-chart-outer">
            <svg viewBox={`0 0 ${W} ${H + 30}`} width="100%" preserveAspectRatio="none"
                style={{ display: 'block', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="rpAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(20,184,166,0.22)" />
                        <stop offset="80%" stopColor="rgba(20,184,166,0.04)" />
                        <stop offset="100%" stopColor="rgba(20,184,166,0)" />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((f, i) => (
                    <line key={i}
                        x1={0} y1={H * (1 - f * 0.86) - H * 0.05}
                        x2={W} y2={H * (1 - f * 0.86) - H * 0.05}
                        stroke="#E5E7EB" strokeOpacity={0.6}
                        strokeDasharray="4 8" strokeWidth={1} />
                ))}
                {/* Area */}
                <path d={area} fill="url(#rpAreaGrad)" />
                {/* Line */}
                <path d={d} fill="none" stroke="#14B8A6" strokeWidth={2.5}
                    strokeLinecap="round" className="rp-chart-draw" />
                {/* End dot */}
                <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={6}
                    fill="#14B8A6" stroke="#fff" strokeWidth={2.5} />
                <text x={xs[xs.length - 1]} y={ys[ys.length - 1] - 14}
                    textAnchor="middle" fontSize={10} fill="#14B8A6"
                    fontFamily="Inter" fontWeight={700}>
                    {formatCrore(points[points.length - 1].v)}
                </text>
                {/* X labels */}
                {points.filter((_, i) => i % 2 === 0).map((p, i) => (
                    <text key={i} x={xs[i * 2]} y={H + 22}
                        textAnchor="middle" fontSize={10}
                        fill="#94A3B8" fontFamily="Inter">
                        Age {p.age}
                    </text>
                ))}
            </svg>
        </div>
    );
}

/* ─── Custom Slider ───────────────────────────────── */
function RpSlider({ value, min, max, step = 1, onChange, accent = '#14B8A6' }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="rp-slider-track-wrap">
            <div className="rp-slider-fill" style={{ width: `${pct}%`, background: accent }} />
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="rp-slider"
                style={{ '--thumb-color': accent }}
            />
        </div>
    );
}

/* ─── Tooltip ─────────────────────────────────────── */
function Tooltip({ text }) {
    const [show, setShow] = useState(false);
    return (
        <span className="rp-tooltip-wrap"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
            <Info size={14} color="#94A3B8" style={{ cursor: 'help', flexShrink: 0 }} />
            {show && <span className="rp-tooltip">{text}</span>}
        </span>
    );
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════ */
export const PlanRetirement = () => {
    const [contribution, setContribution] = useState(8000);
    const [retirementAge, setRetirementAge] = useState(60);
    const [riskProfile, setRiskProfile] = useState('Balanced');
    const [inflationAdj, setInflationAdj] = useState(false);
    const [countDisplay, setCountDisplay] = useState('0.00');

    const CURRENT_AGE = 42;
    const TARGET_CORPUS = 3.0; // Crore

    const corpus = computeCorpus(contribution, CURRENT_AGE, retirementAge, riskProfile);
    const adjustedCorpus = inflationAdj ? corpus * 0.72 : corpus;
    const readiness = Math.min(Math.round((adjustedCorpus / TARGET_CORPUS) * 100), 100);
    const gap = Math.max(TARGET_CORPUS - adjustedCorpus, 0);
    const fillPct = Math.min((adjustedCorpus / TARGET_CORPUS) * 100, 100);

    // Projection data points
    const projPoints = [];
    for (let age = CURRENT_AGE; age <= retirementAge; age += 2) {
        projPoints.push({
            age,
            v: computeCorpus(contribution, CURRENT_AGE, age, riskProfile)
        });
    }
    if (projPoints[projPoints.length - 1]?.age !== retirementAge) {
        projPoints.push({ age: retirementAge, v: adjustedCorpus });
    }

    // Count-up for corpus display
    useEffect(() => {
        const target = adjustedCorpus;
        let start = 0;
        const steps = 40;
        const increment = target / steps;
        const tick = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCountDisplay(target.toFixed(2));
                clearInterval(tick);
            } else {
                setCountDisplay(start.toFixed(2));
            }
        }, 20);
        return () => clearInterval(tick);
    }, [adjustedCorpus]);

    // Smart suggestion
    const boostContrib = 1500;
    const boostedCorpus = computeCorpus(contribution + boostContrib, CURRENT_AGE, retirementAge, riskProfile);
    const boostedReadiness = Math.min(Math.round((boostedCorpus / TARGET_CORPUS) * 100), 100);
    const showSuggestion = readiness < 95;

    // Scroll reveal
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('rp-visible'); }),
            { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
        );
        document.querySelectorAll('[data-rp-reveal]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="rp-root">
            <Navbar variant="dashboard" />

            {/* ══ HERO — dark gradient ══════════════════════════════ */}
            <section className="rp-hero">
                <div className="rp-orb rp-orb-a" />
                <div className="rp-orb rp-orb-b" />

                <div className="rp-container">
                    <div className="rp-hero-grid">

                        {/* Left — title + corpus */}
                        <div className="rp-hero-left" data-rp-reveal>
                            <div className="rp-hero-eyebrow">
                                <Target size={16} color="#14B8A6" />
                                Retirement Planner
                            </div>
                            <h1 className="rp-hero-title">Plan Your Retirement</h1>
                            <p className="rp-hero-sub">
                                Adjust your contributions and see your future grow.
                            </p>

                            <div className="rp-corpus-block">
                                <div className="rp-corpus-label">Projected Corpus</div>
                                <div className="rp-corpus-value">₹{countDisplay} Cr</div>
                                <div className="rp-corpus-meta">at age {retirementAge}</div>
                            </div>

                            <div className="rp-hero-kpi-row">
                                <div className="rp-hero-kpi">
                                    <span className="rp-hero-kpi-val">{retirementAge - CURRENT_AGE} yrs</span>
                                    <span className="rp-hero-kpi-lbl">Years to Retire</span>
                                </div>
                                <div className="rp-hero-kpi-divider" />
                                <div className="rp-hero-kpi">
                                    <span className="rp-hero-kpi-val">₹{(contribution / 1000).toFixed(0)}k/mo</span>
                                    <span className="rp-hero-kpi-lbl">Monthly SIP</span>
                                </div>
                                <div className="rp-hero-kpi-divider" />
                                <div className="rp-hero-kpi">
                                    <span className="rp-hero-kpi-val">{riskProfile}</span>
                                    <span className="rp-hero-kpi-lbl">Risk Profile</span>
                                </div>
                            </div>
                        </div>

                        {/* Right — Readiness Ring */}
                        <div className="rp-hero-right" data-rp-reveal>
                            <ReadinessRing score={readiness} key={readiness} />
                            <p className="rp-ring-desc">
                                {readiness >= 90
                                    ? 'Excellent! Your plan is on a strong trajectory.'
                                    : readiness >= 75
                                        ? 'Good progress. A small boost can make a big difference.'
                                        : 'Increase contributions to strengthen your retirement.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wave */}
                <div className="rp-hero-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
                        <path d="M0,40 C300,70 900,10 1200,40 L1200,60 L0,60 Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* ══ MAIN CONTENT ═════════════════════════════════════ */}
            <main className="rp-main">
                <div className="rp-container">

                    {/* Smart Suggestion */}
                    {showSuggestion && (
                        <section className="rp-section" data-rp-reveal>
                            <div className="rp-suggest">
                                <div className="rp-suggest-icon">
                                    <Sparkles size={18} color="#0E7490" />
                                </div>
                                <p className="rp-suggest-text">
                                    <strong>Smart Insight:</strong> If you increase your contribution by{' '}
                                    <strong>₹{boostContrib.toLocaleString()}/month</strong>, you can reach{' '}
                                    <strong>{boostedReadiness}% readiness</strong> — bridging{' '}
                                    {(boostedCorpus - adjustedCorpus).toFixed(2)} Cr of the gap.
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Two-col: Controls + Chart */}
                    <section className="rp-two-col" data-rp-reveal>

                        {/* ── LEFT: Input Controls ── */}
                        <div className="rp-card rp-controls-card">
                            <div className="rp-ctrl-head">
                                <h2 className="rp-card-title">Your Inputs</h2>
                                <p className="rp-card-sub">Adjust to simulate your retirement plan</p>
                            </div>

                            {/* Monthly Contribution */}
                            <div className="rp-ctrl-block">
                                <div className="rp-ctrl-label-row">
                                    <span className="rp-ctrl-label">Monthly Contribution</span>
                                    <span className="rp-ctrl-value">₹{contribution.toLocaleString()}</span>
                                </div>
                                <RpSlider
                                    value={contribution}
                                    min={1000}
                                    max={50000}
                                    step={500}
                                    onChange={setContribution}
                                    accent="#14B8A6"
                                />
                                <div className="rp-ctrl-range-labels">
                                    <span>₹1,000</span><span>₹50,000</span>
                                </div>
                            </div>

                            {/* Retirement Age */}
                            <div className="rp-ctrl-block">
                                <div className="rp-ctrl-label-row">
                                    <span className="rp-ctrl-label">Retirement Age</span>
                                    <span className="rp-ctrl-value rp-ctrl-value-blue">{retirementAge} yrs</span>
                                </div>
                                <div className="rp-stepper-row">
                                    {[55, 58, 60, 62, 65].map(age => (
                                        <button
                                            key={age}
                                            className={`rp-stepper-btn ${retirementAge === age ? 'rp-stepper-active' : ''}`}
                                            onClick={() => setRetirementAge(age)}
                                        >
                                            {age}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Risk Preference */}
                            <div className="rp-ctrl-block">
                                <div className="rp-ctrl-label-row">
                                    <span className="rp-ctrl-label">Risk Preference</span>
                                </div>
                                <div className="rp-risk-pills">
                                    {['Conservative', 'Balanced', 'Aggressive'].map(r => (
                                        <button
                                            key={r}
                                            className={`rp-risk-pill ${riskProfile === r ? 'rp-risk-active' : ''}`}
                                            onClick={() => setRiskProfile(r)}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <p className="rp-risk-note">
                                    {riskProfile === 'Conservative' && 'Lower risk. 8% avg. return. Mainly Govt. Bonds & Debt.'}
                                    {riskProfile === 'Balanced' && 'Moderate risk. 11% avg. return. Mixed Equity & Debt.'}
                                    {riskProfile === 'Aggressive' && 'Higher risk. 13.5% avg. return. Primarily Equity.'}
                                </p>
                            </div>

                            {/* Inflation Adjustment */}
                            <div className="rp-ctrl-block rp-ctrl-inline">
                                <div className="rp-ctrl-inline-left">
                                    <span className="rp-ctrl-label">Inflation-Adjusted Value</span>
                                    <Tooltip text="Shows corpus in today's purchasing power (assuming 6% annual inflation)." />
                                </div>
                                <label className="rp-toggle">
                                    <input
                                        type="checkbox"
                                        checked={inflationAdj}
                                        onChange={e => setInflationAdj(e.target.checked)}
                                    />
                                    <span className="rp-toggle-track" />
                                </label>
                            </div>

                            {/* CTA */}
                            <button className="rp-cta-btn">
                                Save This Plan <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* ── RIGHT: Chart ── */}
                        <div className="rp-card">
                            <div className="rp-card-head-row">
                                <div>
                                    <h2 className="rp-card-title">Projected Wealth Growth</h2>
                                    <p className="rp-card-sub">Your corpus trajectory from age {CURRENT_AGE} to {retirementAge}</p>
                                </div>
                                <span className="rp-risk-badge">{riskProfile}</span>
                            </div>
                            <GrowthChart points={projPoints} key={`${contribution}-${retirementAge}-${riskProfile}-${inflationAdj}`} />
                            <div className="rp-chart-footer">
                                <div className="rp-chart-stat">
                                    <span className="rp-chart-stat-val">₹8,000/mo</span>
                                    <span className="rp-chart-stat-lbl">Starting Contribution</span>
                                </div>
                                <div className="rp-chart-arrow">→</div>
                                <div className="rp-chart-stat">
                                    <span className="rp-chart-stat-val rp-teal">₹{adjustedCorpus.toFixed(2)} Cr</span>
                                    <span className="rp-chart-stat-lbl">At Age {retirementAge}</span>
                                </div>
                                {inflationAdj && (
                                    <>
                                        <div className="rp-chart-arrow">·</div>
                                        <div className="rp-chart-stat">
                                            <span className="rp-chart-stat-val rp-amber">Inflation adj.</span>
                                            <span className="rp-chart-stat-lbl">6% p.a. discount</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ── Gap Analysis ── */}
                    <section className="rp-section" data-rp-reveal>
                        <div className="rp-card">
                            <div className="rp-card-head-row">
                                <div>
                                    <h2 className="rp-card-title">Goal Comparison</h2>
                                    <p className="rp-card-sub">How close are you to your retirement target?</p>
                                </div>
                                {gap > 0
                                    ? <span className="rp-gap-badge-warn"><AlertCircle size={13} /> Gap Exists</span>
                                    : <span className="rp-gap-badge-ok"><CheckCircle2 size={13} /> Goal Met</span>
                                }
                            </div>

                            <div className="rp-gap-values">
                                <div className="rp-gap-val-block">
                                    <span className="rp-gap-lbl">Your Target Corpus</span>
                                    <span className="rp-gap-num">₹{TARGET_CORPUS.toFixed(2)} Cr</span>
                                </div>
                                <div className="rp-gap-vs">vs</div>
                                <div className="rp-gap-val-block">
                                    <span className="rp-gap-lbl">Your Projected Corpus</span>
                                    <span className="rp-gap-num rp-teal">₹{adjustedCorpus.toFixed(2)} Cr</span>
                                </div>
                            </div>

                            <div className="rp-progress-wrap">
                                <div className="rp-progress-bar">
                                    <div
                                        className="rp-progress-fill"
                                        style={{ width: `${fillPct}%` }}
                                    />
                                </div>
                                <div className="rp-progress-labels">
                                    <span>{fillPct.toFixed(0)}% of goal reached</span>
                                    <span>{(100 - fillPct).toFixed(0)}% remaining</span>
                                </div>
                            </div>

                            {gap > 0 ? (
                                <div className="rp-gap-text">
                                    <AlertCircle size={15} color="#F59E0B" />
                                    You are <strong>₹{gap.toFixed(2)} Cr short</strong> of your retirement goal.
                                    Consider increasing SIP or extending retirement age.
                                </div>
                            ) : (
                                <div className="rp-gap-text rp-gap-text-ok">
                                    <CheckCircle2 size={15} color="#22C55E" />
                                    Congratulations! Your projected corpus meets your retirement goal.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── Tax Savings Highlight ── */}
                    <section className="rp-section" data-rp-reveal>
                        <div className="rp-tax-card">
                            <div className="rp-tax-left">
                                <div className="rp-tax-icon">
                                    <TrendingUp size={20} color="#14B8A6" />
                                </div>
                                <div>
                                    <div className="rp-tax-title">Annual Tax Benefit Under NPS</div>
                                    <div className="rp-tax-sub">Section 80C + 80CCD(1B) — up to ₹2 Lakh deduction</div>
                                </div>
                            </div>
                            <div className="rp-tax-vals">
                                {[
                                    { lbl: 'Under 80C', val: '₹1.5 L' },
                                    { lbl: 'Under 80CCD(1B)', val: '₹50,000' },
                                    { lbl: 'Total Saved (30%)', val: '₹60,000' },
                                ].map((t, i) => (
                                    <div key={i} className="rp-tax-stat">
                                        <span className="rp-tax-stat-val">{t.val}</span>
                                        <span className="rp-tax-stat-lbl">{t.lbl}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Reassurance strip ── */}
                    <section className="rp-section" data-rp-reveal>
                        <div className="rp-reassure">
                            {[
                                { icon: <Shield size={17} color="#14B8A6" />, text: 'Regulated by PFRDA, Govt. of India' },
                                { icon: <Lock size={17} color="#14B8A6" />, text: '256-bit SSL encrypted & secure' },
                                { icon: <CheckCircle2 size={17} color="#14B8A6" />, text: 'DPDP Act 2023 data privacy compliant' },
                            ].map((r, i) => (
                                <div key={i} className="rp-reassure-item">{r.icon}<span>{r.text}</span></div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="rp-footer">
                <div className="rp-container rp-footer-inner">
                    <span>© 2025 NPS Central · CIN: U65929DL2025PLC000001</span>
                    <span>Regulated by PFRDA · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
};
