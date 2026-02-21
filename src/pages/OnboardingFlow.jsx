import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/layout/Navbar';
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle, ChevronRight,
    ChevronLeft, Fingerprint, User, Building2, IndianRupee,
    FileCheck2, Download, BadgeCheck, Globe, Sparkles,
    CreditCard, Phone, Mail, Calendar, Users, Target,
    TrendingUp, Info, ArrowRight
} from 'lucide-react';
import './OnboardingFlow.css';

/* ─── Steps config ─────────────────────────────────── */
const STEPS = [
    { id: 1, label: 'Identity', icon: Fingerprint },
    { id: 2, label: 'Details', icon: User },
    { id: 3, label: 'Fund', icon: Building2 },
    { id: 4, label: 'Contribution', icon: IndianRupee },
    { id: 5, label: 'Confirm', icon: FileCheck2 },
];

/* ─── Fund Managers ─────────────────────────────────── */
const FUND_MANAGERS = [
    { id: 'sbi', name: 'SBI Pension Funds', returns: '13.2%', aum: '₹1.8L Cr', badge: 'Top Rated' },
    { id: 'hdfc', name: 'HDFC Pension', returns: '12.8%', aum: '₹42K Cr', badge: '' },
    { id: 'icici', name: 'ICICI Pru Pension', returns: '12.6%', aum: '₹38K Cr', badge: '' },
    { id: 'lic', name: 'LIC Pension Fund', returns: '11.9%', aum: '₹56K Cr', badge: 'Govt. Backed' },
    { id: 'kotak', name: 'Kotak Pension', returns: '12.4%', aum: '₹18K Cr', badge: '' },
    { id: 'uti', name: 'UTI Retirement', returns: '12.1%', aum: '₹31K Cr', badge: '' },
];

/* ─── Helpers ───────────────────────────────────────── */
function Tooltip({ text }) {
    const [show, setShow] = useState(false);
    return (
        <span className="of-tooltip-wrap"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
            <Info size={14} color="#94A3B8" style={{ cursor: 'help' }} />
            {show && <span className="of-tooltip">{text}</span>}
        </span>
    );
}

function SliderField({ label, value, min, max, step = 500, onChange, format, accent = '#14B8A6', hint }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="of-field">
            <div className="of-slider-header">
                <label className="of-label">{label}</label>
                <span className="of-slider-val">{format(value)}</span>
            </div>
            <div className="of-slider-track-wrap">
                <div className="of-slider-fill" style={{ width: `${pct}%`, background: accent }} />
                <input type="range" min={min} max={max} step={step}
                    value={value} onChange={e => onChange(Number(e.target.value))}
                    className="of-slider" style={{ '--of-thumb': accent }} />
            </div>
            <div className="of-slider-range-labels">
                <span>{format(min)}</span>
                <span>{format(max)}</span>
            </div>
            {hint && <p className="of-field-hint">{hint}</p>}
        </div>
    );
}

/* ─── PRAN animation ────────────────────────────────── */
function PranGenerator({ onDone }) {
    const [digits, setDigits] = useState('0000000000');
    const [done, setDone] = useState(false);
    const final = '1100295847';

    useEffect(() => {
        let count = 0;
        const t = setInterval(() => {
            if (count < 25) {
                setDigits(Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join(''));
                count++;
            } else {
                setDigits(final);
                setDone(true);
                clearInterval(t);
                onDone?.();
            }
        }, 80);
        return () => clearInterval(t);
    }, []);

    return (
        <div className={`of-pran-display${done ? ' of-pran-done' : ''}`}>
            <div className="of-pran-label">YOUR PRAN NUMBER</div>
            <div className="of-pran-number">{digits}</div>
            {done && <div className="of-pran-tag"><CheckCircle2 size={14} />Allotted Successfully</div>}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   STEP COMPONENTS
═══════════════════════════════════════════════════ */

/* ── STEP 1: Identity (read-only recap) ── */
function Step1({ data, onChange }) {
    return (
        <div className="of-step-body">
            <div className="of-recap-verified">
                <div className="of-recap-icon"><ShieldCheck size={22} color="#22C55E" /></div>
                <div>
                    <div className="of-recap-title">Identity Verified</div>
                    <p className="of-recap-sub">Your PAN and Aadhaar have been successfully authenticated via UIDAI.</p>
                </div>
            </div>
            <div className="of-recap-grid">
                {[
                    { label: 'PAN Number', value: data.pan || 'ABCDE1234F', verified: true },
                    { label: 'Aadhaar', value: 'XXXX XXXX 1234', verified: true },
                    { label: 'Mobile', value: '+91 ' + (data.mobile || '98XXXXXXXX'), verified: true },
                ].map((r, i) => (
                    <div key={i} className="of-recap-row">
                        <span className="of-recap-lbl">{r.label}</span>
                        <span className="of-recap-val">
                            {r.value}
                            {r.verified && <CheckCircle2 size={14} color="#22C55E" />}
                        </span>
                    </div>
                ))}
            </div>
            <p className="of-step1-next">
                ✅ Identity confirmed. Proceed to fill your personal details.
            </p>
        </div>
    );
}

/* ── STEP 2: Personal Details ── */
function Step2({ data, onChange }) {
    const set = (k, v) => onChange({ ...data, [k]: v });
    return (
        <div className="of-step-body">
            <div className="of-field-row-2">
                <div className="of-field">
                    <label className="of-label">First Name <span className="of-req">*</span></label>
                    <input className="of-input" value={data.firstName || ''} placeholder="Priya"
                        onChange={e => set('firstName', e.target.value)} />
                </div>
                <div className="of-field">
                    <label className="of-label">Last Name <span className="of-req">*</span></label>
                    <input className="of-input" value={data.lastName || ''} placeholder="Sharma"
                        onChange={e => set('lastName', e.target.value)} />
                </div>
            </div>

            <div className="of-field-row-2">
                <div className="of-field">
                    <label className="of-label">Date of Birth <span className="of-req">*</span></label>
                    <div className="of-input-icon-wrap">
                        <Calendar size={16} color="#94A3B8" className="of-input-icon" />
                        <input className="of-input of-input-iconed" type="date"
                            value={data.dob || ''} onChange={e => set('dob', e.target.value)} />
                    </div>
                </div>
                <div className="of-field">
                    <label className="of-label">Gender <span className="of-req">*</span></label>
                    <div className="of-pill-row">
                        {['Male', 'Female', 'Other'].map(g => (
                            <button key={g}
                                className={`of-pill${data.gender === g ? ' of-pill-active' : ''}`}
                                onClick={() => set('gender', g)}>
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="of-field">
                <label className="of-label">Email Address <span className="of-req">*</span></label>
                <div className="of-input-icon-wrap">
                    <Mail size={16} color="#94A3B8" className="of-input-icon" />
                    <input className="of-input of-input-iconed" type="email"
                        value={data.email || ''} placeholder="priya@example.com"
                        onChange={e => set('email', e.target.value)} />
                </div>
            </div>

            <div className="of-section-title">
                <Users size={16} color="#14B8A6" />
                Nominee Details
            </div>

            <div className="of-field-row-2">
                <div className="of-field">
                    <label className="of-label">Nominee Name <span className="of-req">*</span></label>
                    <input className="of-input" value={data.nomineeName || ''} placeholder="Rahul Sharma"
                        onChange={e => set('nomineeName', e.target.value)} />
                </div>
                <div className="of-field">
                    <label className="of-label">Relationship <span className="of-req">*</span></label>
                    <select className="of-input of-select" value={data.nomineeRel || ''}
                        onChange={e => set('nomineeRel', e.target.value)}>
                        <option value="">Select…</option>
                        {['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Sibling', 'Other'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="of-field">
                <label className="of-label">Nominee Share</label>
                <div className="of-nominee-share">
                    <div className="of-nominee-bar-track">
                        <div className="of-nominee-bar-fill" style={{ width: `${data.nomineeShare || 100}%` }} />
                    </div>
                    <span className="of-nominee-pct">{data.nomineeShare || 100}%</span>
                </div>
                <p className="of-field-sub">You can add multiple nominees later from your dashboard.</p>
            </div>
        </div>
    );
}

/* ── STEP 3: Fund Selection ── */
function Step3({ data, onChange }) {
    const set = (k, v) => onChange({ ...data, [k]: v });
    const equity = data.equity ?? 60;
    const bonds = 100 - equity - 10;
    const alternate = 10;

    return (
        <div className="of-step-body">
            {/* PFM Selection */}
            <div className="of-field">
                <label className="of-label">Choose Pension Fund Manager (PFM) <span className="of-req">*</span></label>
                <div className="of-pfm-grid">
                    {FUND_MANAGERS.map(pfm => (
                        <div key={pfm.id}
                            className={`of-pfm-card${data.pfm === pfm.id ? ' of-pfm-active' : ''}`}
                            onClick={() => set('pfm', pfm.id)}
                            role="button" tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && set('pfm', pfm.id)}>
                            {pfm.badge && <span className="of-pfm-badge">{pfm.badge}</span>}
                            <div className="of-pfm-name">{pfm.name}</div>
                            <div className="of-pfm-stats">
                                <span className="of-pfm-ret">{pfm.returns}</span>
                                <span className="of-pfm-stat-lbl">5Y Returns</span>
                            </div>
                            <div className="of-pfm-aum">AUM {pfm.aum}</div>
                            {data.pfm === pfm.id && (
                                <div className="of-pfm-check"><CheckCircle2 size={16} color="#14B8A6" /></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scheme Type */}
            <div className="of-field">
                <label className="of-label">Scheme Type <span className="of-req">*</span></label>
                <div className="of-scheme-cards">
                    {[
                        {
                            id: 'active',
                            title: 'Active Choice',
                            desc: 'You control the equity/debt split. Best for experienced investors.',
                            icon: <Target size={20} color="#14B8A6" />,
                        },
                        {
                            id: 'auto',
                            title: 'Auto Choice',
                            desc: 'Allocation auto-adjusts with age. Recommended for most investors.',
                            icon: <TrendingUp size={20} color="#2563EB" />,
                            recommended: true,
                        },
                    ].map(s => (
                        <div key={s.id}
                            className={`of-scheme-card${data.scheme === s.id ? ' of-scheme-active' : ''}`}
                            onClick={() => set('scheme', s.id)}>
                            {s.recommended && <span className="of-scheme-rec">Recommended</span>}
                            <div className="of-scheme-icon">{s.icon}</div>
                            <div className="of-scheme-title">{s.title}</div>
                            <p className="of-scheme-desc">{s.desc}</p>
                            {data.scheme === s.id && (
                                <div className="of-scheme-check"><CheckCircle2 size={15} color={s.id === 'active' ? '#14B8A6' : '#2563EB'} /></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Choice allocation */}
            {data.scheme === 'active' && (
                <div className="of-allocation-block">
                    <div className="of-allocation-header">Asset Allocation</div>
                    <SliderField
                        label="Equity (E)"
                        value={equity}
                        min={0} max={75} step={5}
                        onChange={v => set('equity', v)}
                        format={v => `${v}%`}
                        accent="#14B8A6"
                        hint="Higher equity = higher potential returns with more risk"
                    />
                    <div className="of-alloc-auto-row">
                        <div className="of-alloc-auto">
                            <span>Govt. Bonds (G)</span>
                            <span className="of-alloc-auto-val">{Math.max(bonds, 0)}%</span>
                        </div>
                        <div className="of-alloc-auto">
                            <span>Corporate Debt (C)</span>
                            <span className="of-alloc-auto-val">{alternate}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Auto Choice lifecycle */}
            {data.scheme === 'auto' && (
                <div className="of-field">
                    <label className="of-label">Life Cycle Fund <span className="of-req">*</span></label>
                    <div className="of-pill-row">
                        {[
                            { id: 'lc75', label: 'LC75 — Aggressive', note: '75% equity till age 35' },
                            { id: 'lc50', label: 'LC50 — Moderate', note: '50% equity till age 35' },
                            { id: 'lc25', label: 'LC25 — Conservative', note: '25% equity always' },
                        ].map(lc => (
                            <button key={lc.id}
                                className={`of-pill of-pill-lg${data.lifecycle === lc.id ? ' of-pill-active' : ''}`}
                                onClick={() => set('lifecycle', lc.id)}>
                                <span className="of-pill-main">{lc.label}</span>
                                <span className="of-pill-note">{lc.note}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── STEP 4: Contribution & Bank ── */
function Step4({ data, onChange }) {
    const set = (k, v) => onChange({ ...data, [k]: v });
    const sip = data.sip ?? 5000;
    const annualTax = Math.min(sip * 12, 150000) * 0.3;

    return (
        <div className="of-step-body">
            <SliderField
                label="Monthly SIP Contribution"
                value={sip}
                min={500} max={50000} step={500}
                onChange={v => set('sip', v)}
                format={v => `₹${v.toLocaleString()}`}
                accent="#14B8A6"
            />

            {/* Tax saving callout */}
            <div className="of-tax-callout">
                <Sparkles size={16} color="#0E7490" />
                <span>
                    At ₹{sip.toLocaleString()}/mo, you save up to{' '}
                    <strong>₹{annualTax.toLocaleString()}/yr</strong> in taxes (80C + 80CCD)
                </span>
            </div>

            <div className="of-section-title" style={{ marginTop: 24 }}>
                <CreditCard size={16} color="#14B8A6" />
                Bank Account for Auto-Debit
            </div>

            <div className="of-field">
                <label className="of-label">Bank Name <span className="of-req">*</span></label>
                <select className="of-input of-select" value={data.bank || ''}
                    onChange={e => set('bank', e.target.value)}>
                    <option value="">Select your bank…</option>
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
                        'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
                        'Union Bank of India', 'Canara Bank', 'IndusInd Bank'].map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                </select>
            </div>

            <div className="of-field-row-2">
                <div className="of-field">
                    <label className="of-label">Account Number <span className="of-req">*</span></label>
                    <input className="of-input" type="text" inputMode="numeric"
                        placeholder="XXXXXXXXXXXXXXXX"
                        value={data.accountNo || ''}
                        onChange={e => set('accountNo', e.target.value.replace(/\D/g, '').slice(0, 18))} />
                </div>
                <div className="of-field">
                    <label className="of-label">Re-enter Account No. <span className="of-req">*</span></label>
                    <input className={`of-input${data.confirmAcct && data.confirmAcct !== data.accountNo ? ' of-input-error' : data.confirmAcct && data.confirmAcct === data.accountNo ? ' of-input-valid' : ''}`}
                        type="text" inputMode="numeric"
                        placeholder="Confirm account number"
                        value={data.confirmAcct || ''}
                        onChange={e => set('confirmAcct', e.target.value.replace(/\D/g, '').slice(0, 18))} />
                    {data.confirmAcct && data.confirmAcct !== data.accountNo && (
                        <p className="of-error-text"><AlertCircle size={12} /> Account numbers do not match</p>
                    )}
                </div>
            </div>

            <div className="of-field">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label className="of-label" style={{ margin: 0 }}>IFSC Code <span className="of-req">*</span></label>
                    <Tooltip text="11-character code on your cheque book. E.g. SBIN0001234" />
                </div>
                <input className="of-input" style={{ marginTop: 8 }}
                    placeholder="SBIN0001234"
                    value={data.ifsc || ''}
                    onChange={e => set('ifsc', e.target.value.toUpperCase().slice(0, 11))}
                    maxLength={11} />
            </div>

            <div className="of-field">
                <label className="of-label">Payment Mode <span className="of-req">*</span></label>
                <div className="of-pill-row">
                    {[
                        { id: 'netbanking', label: '🏦 Net Banking' },
                        { id: 'upi', label: 'UPI' },
                        { id: 'nach', label: 'NACH Mandate' },
                    ].map(p => (
                        <button key={p.id}
                            className={`of-pill${data.payMode === p.id ? ' of-pill-active' : ''}`}
                            onClick={() => set('payMode', p.id)}>
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {data.payMode === 'upi' && (
                <div className="of-field">
                    <label className="of-label">UPI ID <span className="of-req">*</span></label>
                    <input className="of-input" placeholder="name@upi"
                        value={data.upiId || ''}
                        onChange={e => set('upiId', e.target.value)} />
                </div>
            )}

            <div className="of-mandate-note">
                <Lock size={14} color="#14B8A6" />
                <span>A one-time mandate will be set up via your bank for monthly SIP auto-debit. This is reversible anytime.</span>
            </div>
        </div>
    );
}

/* ── STEP 5: Confirmation ── */
function Step5({ data }) {
    const [pranDone, setPranDone] = useState(false);
    const [confettiDone, setConfettiDone] = useState(false);

    useEffect(() => {
        if (pranDone) setTimeout(() => setConfettiDone(true), 600);
    }, [pranDone]);

    const pfmLabel = (FUND_MANAGERS.find(f => f.id === data.pfm)?.name) || 'SBI Pension Funds';
    const sip = data.sip ?? 5000;

    return (
        <div className="of-step-body">
            {/* PRAN */}
            <PranGenerator onDone={() => setPranDone(true)} />

            {pranDone && (
                <>
                    {/* Success ring */}
                    <div className={`of-success-ring${confettiDone ? ' of-ring-visible' : ''}`}>
                        <svg width={96} height={96} viewBox="0 0 96 96">
                            <circle cx={48} cy={48} r={40} fill="none" stroke="#E5E7EB" strokeWidth={6} />
                            <circle cx={48} cy={48} r={40} fill="none" stroke="#22C55E" strokeWidth={6}
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={2 * Math.PI * 40}
                                className="of-ring-progress" />
                            <CheckCircle2 x={28} y={28} width={40} height={40} color="#22C55E" />
                        </svg>
                        <div className="of-success-msg">Account Successfully Opened!</div>
                    </div>

                    {/* Summary */}
                    <div className="of-summary-card">
                        <div className="of-summary-title">Account Summary</div>
                        <div className="of-summary-rows">
                            {[
                                { label: 'Account Holder', value: `${data.firstName || 'Priya'} ${data.lastName || 'Sharma'}` },
                                { label: 'Pension Fund Manager', value: pfmLabel },
                                { label: 'Scheme', value: data.scheme === 'active' ? `Active Choice (${data.equity ?? 60}% Equity)` : `Auto Choice — ${data.lifecycle?.toUpperCase() || 'LC50'}` },
                                { label: 'Monthly SIP', value: `₹${sip.toLocaleString()}` },
                                { label: 'Bank', value: data.bank || 'State Bank of India' },
                                { label: 'Payment Mode', value: data.payMode === 'upi' ? 'UPI' : data.payMode === 'nach' ? 'NACH Mandate' : 'Net Banking' },
                                { label: 'Nominee', value: `${data.nomineeName || 'Rahul Sharma'} (${data.nomineeRel || 'Spouse'})` },
                            ].map((r, i) => (
                                <div key={i} className="of-summary-row">
                                    <span className="of-summary-lbl">{r.label}</span>
                                    <span className="of-summary-val">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="of-confirm-actions">
                        <button className="of-download-btn">
                            <Download size={16} />
                            Download Welcome Kit
                        </button>
                        <button className="of-dash-btn"
                            onClick={() => window.location.href = '/dashboard'}>
                            Go to Dashboard
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Reassurance */}
                    <div className="of-confirm-badges">
                        {[
                            { icon: <ShieldCheck size={15} color="#14B8A6" />, text: 'PFRDA Regulated' },
                            { icon: <Lock size={15} color="#14B8A6" />, text: '256-bit Secure' },
                            { icon: <BadgeCheck size={15} color="#14B8A6" />, text: 'Govt. Approved' },
                        ].map((b, i) => (
                            <div key={i} className="of-confirm-badge">{b.icon}<span>{b.text}</span></div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
export const OnboardingFlow = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState('forward');
    const [animating, setAnimating] = useState(false);

    // Shared form data across all steps
    const [formData, setFormData] = useState({
        pan: 'ABCDE1234F',
        mobile: '9876543210',
        scheme: 'auto',
        lifecycle: 'lc50',
        equity: 60,
        sip: 8000,
        payMode: 'netbanking',
        nomineeShare: 100,
    });

    const headings = [
        { title: 'Identity Verified', sub: 'Your KYC is complete. Let\'s proceed to set up your account.' },
        { title: 'Personal Details', sub: 'Tell us about yourself and your nominee.' },
        { title: 'Choose Your Fund', sub: 'Select a pension fund manager and investment strategy.' },
        { title: 'Contribution Setup', sub: 'Set your monthly SIP and link your bank account.' },
        { title: 'Account Confirmed!', sub: 'Your NPS account has been created. Welcome to NPS Central.' },
    ];

    const navigate = (to) => {
        if (animating || to < 1 || to > 5) return;
        setDirection(to > currentStep ? 'forward' : 'back');
        setAnimating(true);
        setTimeout(() => {
            setCurrentStep(to);
            setAnimating(false);
        }, 340);
    };

    const canProceed = () => {
        if (currentStep === 2) return !!(formData.firstName && formData.lastName && formData.dob && formData.gender && formData.email && formData.nomineeName && formData.nomineeRel);
        if (currentStep === 3) return !!(formData.pfm && formData.scheme && (formData.scheme === 'active' || formData.lifecycle));
        if (currentStep === 4) return !!(formData.bank && formData.accountNo && formData.confirmAcct === formData.accountNo && formData.ifsc && formData.payMode);
        return true;
    };

    const heading = headings[currentStep - 1];

    // Scroll reveal
    useEffect(() => {
        const obs = new IntersectionObserver(
            es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('of-visible'); }),
            { threshold: 0.06 }
        );
        document.querySelectorAll('[data-of-reveal]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="of-root">
            <Navbar variant="dashboard" />

            {/* ══ HERO ════════════════════════════════════════════ */}
            <section className="of-hero">
                <div className="of-orb of-orb-a" />
                <div className="of-orb of-orb-b" />

                <div className="of-container">
                    <div className="of-hero-text" data-of-reveal>
                        <div className="of-hero-eyebrow">
                            <Fingerprint size={15} color="#14B8A6" />
                            NPS Account Opening — Step {currentStep} of 5
                        </div>
                        <h1 className="of-hero-title">{heading.title}</h1>
                        <p className="of-hero-sub">{heading.sub}</p>
                    </div>

                    {/* Step indicator */}
                    <div className="of-steps" data-of-reveal>
                        {STEPS.map((step, i) => (
                            <React.Fragment key={step.id}>
                                <button
                                    className={`of-step${currentStep === step.id ? ' of-step-active' : ''}${currentStep > step.id ? ' of-step-done' : ''}`}
                                    onClick={() => currentStep > step.id && navigate(step.id)}
                                    style={{ cursor: currentStep > step.id ? 'pointer' : 'default' }}
                                    aria-label={`Step ${step.id}: ${step.label}`}
                                >
                                    <div className="of-step-dot">
                                        {currentStep > step.id
                                            ? <CheckCircle2 size={14} color="#14B8A6" />
                                            : <span className="of-step-num">{step.id}</span>
                                        }
                                    </div>
                                    <span className="of-step-label">{step.label}</span>
                                </button>
                                {i < STEPS.length - 1 && (
                                    <div className={`of-step-line${currentStep > step.id ? ' of-step-line-done' : ''}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="of-hero-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
                        <path d="M0,40 C300,70 900,10 1200,40 L1200,60 L0,60 Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* ══ MAIN ═════════════════════════════════════════════ */}
            <main className="of-main">
                <div className="of-container">

                    <div className="of-card" key={currentStep}
                        data-direction={direction}
                        style={{ animation: `of-slide-${direction} 0.38s cubic-bezier(0.22,1,0.36,1) both` }}>

                        {/* Step content */}
                        {currentStep === 1 && <Step1 data={formData} onChange={setFormData} />}
                        {currentStep === 2 && <Step2 data={formData} onChange={setFormData} />}
                        {currentStep === 3 && <Step3 data={formData} onChange={setFormData} />}
                        {currentStep === 4 && <Step4 data={formData} onChange={setFormData} />}
                        {currentStep === 5 && <Step5 data={formData} />}

                        {/* Navigation */}
                        {currentStep < 5 && (
                            <div className="of-nav-row">
                                {currentStep > 1 ? (
                                    <button className="of-back-btn" onClick={() => navigate(currentStep - 1)}>
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                ) : <div />}

                                <button
                                    className={`of-next-btn${!canProceed() ? ' of-btn-disabled' : ''}`}
                                    onClick={() => canProceed() && navigate(currentStep + 1)}
                                    disabled={!canProceed()}>
                                    {currentStep === 4 ? 'Open My NPS Account' : 'Continue'}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Info strip */}
                    {currentStep < 5 && (
                        <div className="of-info-strip" data-of-reveal>
                            {[
                                { icon: <ShieldCheck size={16} color="#14B8A6" />, text: 'Regulated by PFRDA, Govt. of India' },
                                { icon: <Lock size={16} color="#14B8A6" />, text: '256-bit SSL encrypted' },
                                { icon: <CheckCircle2 size={16} color="#14B8A6" />, text: 'DPDP Act 2023 compliant' },
                            ].map((r, i) => (
                                <div key={i} className="of-info-item">{r.icon}<span>{r.text}</span></div>
                            ))}
                        </div>
                    )}

                    {/* Progress indicator bar */}
                    <div className="of-progress-track">
                        <div className="of-progress-fill"
                            style={{ width: `${((currentStep - 1) / 4) * 100}%` }} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="of-footer">
                <div className="of-container of-footer-inner">
                    <span>© 2025 NPS Central · CIN: U65929DL2025PLC000001</span>
                    <span>Regulated by PFRDA · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
};
