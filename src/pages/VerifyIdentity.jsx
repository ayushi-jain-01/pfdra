import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '../components/layout/Navbar';
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle,
    ChevronRight, Info, Eye, EyeOff, Loader2,
    BadgeCheck, Globe, Fingerprint
} from 'lucide-react';
import './VerifyIdentity.css';

/* ─── Step config ─────────────────────────────────── */
const STEPS = [
    { id: 1, label: 'Identity' },
    { id: 2, label: 'Details' },
    { id: 3, label: 'Fund' },
    { id: 4, label: 'Contribution' },
    { id: 5, label: 'Confirm' },
];

/* ─── PAN validation ──────────────────────────────── */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

function validatePAN(val) {
    if (!val) return null;
    return PAN_REGEX.test(val.toUpperCase()) ? 'valid' : 'error';
}

function validateMobile(val) {
    if (!val) return null;
    return MOBILE_REGEX.test(val) ? 'valid' : 'error';
}

function validateAadhaar(val) {
    const clean = val.replace(/\s/g, '');
    if (!clean) return null;
    return /^\d{12}$/.test(clean) ? 'valid' : 'error';
}

/* ─── Tooltip ─────────────────────────────────────── */
function Tooltip({ text }) {
    const [show, setShow] = useState(false);
    return (
        <span className="vi-tooltip-wrap"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
            <Info size={15} color="#94A3B8" style={{ cursor: 'help' }} />
            {show && <span className="vi-tooltip">{text}</span>}
        </span>
    );
}

/* ─── Field Status Icon ───────────────────────────── */
function FieldIcon({ status }) {
    if (status === 'valid') return <CheckCircle2 size={17} color="#22C55E" className="vi-field-icon" />;
    if (status === 'error') return <AlertCircle size={17} color="#EF4444" className="vi-field-icon" />;
    return null;
}

/* ─── OTP Boxes ───────────────────────────────────── */
function OtpInput({ value, onChange, verified }) {
    const refs = Array.from({ length: 6 }, () => useRef(null));

    const handleKey = (i, e) => {
        if (e.key === 'Backspace') {
            if (!value[i] && i > 0) refs[i - 1].current?.focus();
            const next = value.split('');
            next[i] = '';
            onChange(next.join(''));
        }
    };

    const handleChange = (i, e) => {
        const char = e.target.value.replace(/\D/g, '').slice(-1);
        const next = value.padEnd(6, ' ').split('');
        next[i] = char;
        const joined = next.join('').replace(/ /g, '');
        onChange(joined);
        if (char && i < 5) refs[i + 1].current?.focus();
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        if (pasted.length > 0) refs[Math.min(pasted.length, 5)].current?.focus();
        e.preventDefault();
    };

    return (
        <div className="vi-otp-row">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={refs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ''}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKey(i, e)}
                    onPaste={handlePaste}
                    className={`vi-otp-box${value[i] ? ' vi-otp-filled' : ''}${verified ? ' vi-otp-verified' : ''}`}
                    aria-label={`OTP digit ${i + 1}`}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export const VerifyIdentity = () => {
    const [activeStep, setActiveStep] = useState(1);

    // Fields
    const [pan, setPan] = useState('');
    const [aadhaar, setAadhaar] = useState('');
    const [mobile, setMobile] = useState('');
    const [showAadhaar, setShowAadhaar] = useState(false);

    // OTP state
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Submit state
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const panStatus = validatePAN(pan);
    const aadhaarStatus = validateAadhaar(aadhaar);
    const mobileStatus = validateMobile(mobile);

    const canSendOtp = panStatus === 'valid' && aadhaarStatus === 'valid' && mobileStatus === 'valid';
    const canSubmit = canSendOtp && (otpVerified || otp.length === 6);

    // Aadhaar masking
    const formatAadhaar = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 12);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    // OTP countdown
    useEffect(() => {
        if (!otpSent || canResend) return;
        if (countdown <= 0) { setCanResend(true); return; }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [otpSent, countdown, canResend]);

    // Auto-verify OTP when 6 digits entered (demo: "123456")
    useEffect(() => {
        if (otp.length === 6) {
            setTimeout(() => setOtpVerified(otp === '123456' || true), 500);
        } else {
            setOtpVerified(false);
        }
    }, [otp]);

    const handleSendOtp = () => {
        if (!canSendOtp) return;
        setOtpSent(true);
        setCountdown(30);
        setCanResend(false);
        setOtp('');
        setOtpVerified(false);
    };

    const handleResend = () => {
        if (!canResend) return;
        setCountdown(30);
        setCanResend(false);
        setOtp('');
        setOtpVerified(false);
    };

    const handleSubmit = () => {
        if (!canSubmit || submitting) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            setActiveStep(2);
        }, 2200);
    };

    // Scroll reveal
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vi-visible'); }),
            { threshold: 0.06 }
        );
        document.querySelectorAll('[data-vi-reveal]').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    const pad = n => String(n).padStart(2, '0');

    return (
        <div className="vi-root">
            <Navbar variant="dashboard" />

            {/* ══ HERO ══════════════════════════════════════════════ */}
            <section className="vi-hero">
                <div className="vi-orb vi-orb-a" />
                <div className="vi-orb vi-orb-b" />

                <div className="vi-container">
                    {/* Title */}
                    <div className="vi-hero-text" data-vi-reveal>
                        <div className="vi-hero-eyebrow">
                            <Fingerprint size={16} color="#14B8A6" />
                            Step 1 of 5 — KYC Verification
                        </div>
                        <h1 className="vi-hero-title">Verify Your Identity</h1>
                        <p className="vi-hero-sub">
                            Secure verification using PAN and Aadhaar to start your NPS journey.
                        </p>
                    </div>

                    {/* Step progress */}
                    <div className="vi-steps" data-vi-reveal>
                        {STEPS.map((step, i) => (
                            <React.Fragment key={step.id}>
                                <div className={`vi-step${activeStep === step.id ? ' vi-step-active' : ''}${activeStep > step.id ? ' vi-step-done' : ''}`}>
                                    <div className="vi-step-dot">
                                        {activeStep > step.id
                                            ? <CheckCircle2 size={14} color="#14B8A6" />
                                            : <span className="vi-step-num">{step.id}</span>
                                        }
                                    </div>
                                    <span className="vi-step-label">{step.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`vi-step-line${activeStep > step.id ? ' vi-step-line-done' : ''}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Wave */}
                <div className="vi-hero-wave">
                    <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
                        <path d="M0,40 C300,70 900,10 1200,40 L1200,60 L0,60 Z" fill="#F8FAFC" />
                    </svg>
                </div>
            </section>

            {/* ══ MAIN ══════════════════════════════════════════════ */}
            <main className="vi-main">
                <div className="vi-container">

                    {/* Verification Card */}
                    <div className="vi-card" data-vi-reveal>

                        {/* Card header */}
                        <div className="vi-card-head">
                            <div className="vi-card-icon">
                                <ShieldCheck size={22} color="#14B8A6" />
                            </div>
                            <div>
                                <h2 className="vi-card-title">Identity Pre-Check</h2>
                                <p className="vi-card-sub">All data is encrypted and never stored without consent.</p>
                            </div>
                        </div>

                        {/* ── PAN NUMBER ── */}
                        <div className="vi-field">
                            <label className="vi-label" htmlFor="pan-input">
                                PAN Number <span className="vi-label-required">*</span>
                            </label>
                            <div className={`vi-input-wrap${panStatus === 'valid' ? ' vi-input-valid' : panStatus === 'error' ? ' vi-input-error' : ''}`}>
                                <input
                                    id="pan-input"
                                    type="text"
                                    className="vi-input"
                                    placeholder="ABCDE1234F"
                                    maxLength={10}
                                    value={pan}
                                    onChange={e => setPan(e.target.value.toUpperCase())}
                                    autoComplete="off"
                                    aria-describedby="pan-hint"
                                />
                                <FieldIcon status={panStatus} />
                            </div>
                            {panStatus === 'valid' && (
                                <p className="vi-field-hint vi-hint-valid" id="pan-hint">
                                    <CheckCircle2 size={13} /> Valid PAN format
                                </p>
                            )}
                            {panStatus === 'error' && (
                                <p className="vi-field-hint vi-hint-error" id="pan-hint">
                                    <AlertCircle size={13} /> Invalid PAN — should be like ABCDE1234F
                                </p>
                            )}
                        </div>

                        {/* ── AADHAAR ── */}
                        <div className="vi-field">
                            <div className="vi-label-row">
                                <label className="vi-label" htmlFor="aadhaar-input">
                                    Aadhaar Number <span className="vi-label-required">*</span>
                                </label>
                                <Tooltip text="Your Aadhaar number is encrypted using 256-bit SSL and is never stored without your explicit consent." />
                            </div>
                            <div className={`vi-input-wrap${aadhaarStatus === 'valid' ? ' vi-input-valid' : aadhaarStatus === 'error' ? ' vi-input-error' : ''}`}>
                                <input
                                    id="aadhaar-input"
                                    type={showAadhaar ? 'text' : 'password'}
                                    className="vi-input"
                                    placeholder="XXXX XXXX XXXX"
                                    value={aadhaar}
                                    onChange={e => setAadhaar(formatAadhaar(e.target.value))}
                                    inputMode="numeric"
                                    autoComplete="off"
                                    aria-describedby="aadhaar-hint"
                                />
                                <button
                                    type="button"
                                    className="vi-eye-btn"
                                    onClick={() => setShowAadhaar(v => !v)}
                                    aria-label={showAadhaar ? 'Hide Aadhaar' : 'Show Aadhaar'}
                                >
                                    {showAadhaar ? <EyeOff size={16} color="#94A3B8" /> : <Eye size={16} color="#94A3B8" />}
                                </button>
                                <FieldIcon status={aadhaarStatus} />
                            </div>
                            {aadhaarStatus === 'valid' && (
                                <p className="vi-field-hint vi-hint-valid" id="aadhaar-hint">
                                    <CheckCircle2 size={13} /> Valid Aadhaar format
                                </p>
                            )}
                            {aadhaarStatus === 'error' && (
                                <p className="vi-field-hint vi-hint-error" id="aadhaar-hint">
                                    <AlertCircle size={13} /> Aadhaar must be 12 digits
                                </p>
                            )}
                        </div>

                        {/* ── MOBILE ── */}
                        <div className="vi-field">
                            <label className="vi-label" htmlFor="mobile-input">
                                Mobile Number Linked to Aadhaar <span className="vi-label-required">*</span>
                            </label>
                            <div className={`vi-input-wrap${mobileStatus === 'valid' ? ' vi-input-valid' : mobileStatus === 'error' ? ' vi-input-error' : ''}`}>
                                <div className="vi-phone-prefix">
                                    <span className="vi-flag">🇮🇳</span>
                                    <span className="vi-code">+91</span>
                                    <span className="vi-divider" />
                                </div>
                                <input
                                    id="mobile-input"
                                    type="tel"
                                    className="vi-input vi-input-phone"
                                    placeholder="98XXXXXXXX"
                                    maxLength={10}
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    inputMode="numeric"
                                    aria-describedby="mobile-hint"
                                />
                                <FieldIcon status={mobileStatus} />
                            </div>
                            {mobileStatus === 'error' && (
                                <p className="vi-field-hint vi-hint-error" id="mobile-hint">
                                    <AlertCircle size={13} /> Enter a valid 10-digit mobile number
                                </p>
                            )}
                        </div>

                        {/* ── SEND OTP BUTTON ── */}
                        {!otpSent && (
                            <button
                                className={`vi-otp-send-btn${canSendOtp ? '' : ' vi-btn-disabled'}`}
                                onClick={handleSendOtp}
                                disabled={!canSendOtp}
                                aria-label="Send OTP"
                            >
                                Send OTP to +91-{mobile || 'XXXXXXXXXX'}
                                <ChevronRight size={16} />
                            </button>
                        )}

                        {/* ── OTP SECTION ── */}
                        {otpSent && (
                            <div className="vi-otp-section">
                                <div className="vi-otp-header">
                                    <p className="vi-otp-desc">
                                        OTP sent to <strong>+91-{mobile}</strong>
                                        {' '}
                                        <button className="vi-otp-change" onClick={() => { setOtpSent(false); setOtp(''); }}>
                                            Change
                                        </button>
                                    </p>
                                    {otpVerified && (
                                        <span className="vi-otp-verified-badge">
                                            <CheckCircle2 size={14} /> Verified
                                        </span>
                                    )}
                                </div>

                                <OtpInput value={otp} onChange={setOtp} verified={otpVerified} />

                                <div className="vi-otp-resend-row">
                                    {canResend ? (
                                        <button className="vi-resend-btn" onClick={handleResend}>
                                            Resend OTP
                                        </button>
                                    ) : (
                                        <span className="vi-resend-timer">
                                            Resend OTP in{' '}
                                            <span className="vi-timer-val">00:{pad(countdown)}</span>
                                        </span>
                                    )}

                                    {/* Demo hint */}
                                    <span className="vi-otp-demo-hint">Enter any 6 digits to demo</span>
                                </div>
                            </div>
                        )}

                        <div className="vi-divider" />

                        {/* ── SECURITY BADGES ── */}
                        <div className="vi-security-badges">
                            {[
                                { icon: <Lock size={15} color="#2563EB" />, text: '256-bit Encryption' },
                                { icon: <BadgeCheck size={15} color="#2563EB" />, text: 'Govt. Approved' },
                                { icon: <ShieldCheck size={15} color="#2563EB" />, text: 'Secure KYC' },
                                { icon: <Globe size={15} color="#2563EB" />, text: 'UIDAI Verified' },
                            ].map((b, i) => (
                                <div key={i} className="vi-badge">
                                    {b.icon}
                                    <span>{b.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* ── PRIMARY CTA ── */}
                        <button
                            className={`vi-submit-btn${!canSubmit ? ' vi-btn-disabled' : ''}${submitted ? ' vi-btn-success' : ''}`}
                            onClick={handleSubmit}
                            disabled={!canSubmit || submitting || submitted}
                            aria-label="Verify and continue"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="vi-spin" />
                                    Verifying…
                                </>
                            ) : submitted ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    Verified! Proceeding to Step 2…
                                </>
                            ) : (
                                <>
                                    Verify &amp; Continue
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="vi-consent-text">
                            By continuing, you consent to UIDAI-based Aadhaar authentication as per PFRDA guidelines.
                            Your data is protected under the DPDP Act 2023.
                        </p>
                    </div>

                    {/* Info strip below card */}
                    <div className="vi-info-strip" data-vi-reveal>
                        {[
                            { icon: <ShieldCheck size={17} color="#14B8A6" />, text: 'Regulated by PFRDA, Govt. of India' },
                            { icon: <Lock size={17} color="#14B8A6" />, text: '256-bit SSL encrypted & secure' },
                            { icon: <CheckCircle2 size={17} color="#14B8A6" />, text: 'DPDP Act 2023 compliant' },
                        ].map((r, i) => (
                            <div key={i} className="vi-info-item">{r.icon}<span>{r.text}</span></div>
                        ))}
                    </div>

                </div>
            </main>

            {/* ── FOOTER ── */}
            <footer className="vi-footer">
                <div className="vi-container vi-footer-inner">
                    <span>© 2025 NPS Central · CIN: U65929DL2025PLC000001</span>
                    <span>Regulated by PFRDA · All rights reserved</span>
                </div>
            </footer>
        </div>
    );
};
