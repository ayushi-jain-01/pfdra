import React, { useState, useEffect } from 'react';
import { Shield, Bell, ChevronDown, Menu, X, TrendingUp } from 'lucide-react';
import './Navbar.css';

/**
 * Shared NPS Central Navbar
 *
 * Props:
 *  variant   — "landing" | "dashboard"
 *              "landing"   → shows Sign In / Sign Up
 *              "dashboard" → shows Bell + User chip
 *
 * Both variants:
 *  - Transparent over dark hero
 *  - Glass blur on scroll
 *  - Height 72px desktop / 56px mobile
 */
export const Navbar = ({ variant = 'landing' }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const LANDING_LINKS = [
        { label: 'How it Works', href: '#how-it-works' },
        { label: 'Features', href: '#features' },
        { label: 'Quick Links', href: '#' },
        { label: 'Support', href: '#' },
    ];

    const DASHBOARD_LINKS = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Plan Retirement', href: '/plan-retirement' },
        { label: 'Portfolio', href: '#' },
        { label: 'Transactions', href: '#' },
        { label: 'Reports', href: '#' },
    ];

    const links = variant === 'dashboard' ? DASHBOARD_LINKS : LANDING_LINKS;
    const activePath = typeof window !== 'undefined' ? window.location.pathname : '/';

    /* Decide active label */
    const activeLabel =
        variant === 'dashboard' ? 'Dashboard' :
            variant === 'landing' ? '' : '';

    return (
        <nav
            className={`nps-navbar${scrolled ? ' nps-navbar--scrolled' : ''}${mobileOpen ? ' nps-navbar--open' : ''}`}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="nps-navbar__inner">

                {/* ── Brand ── */}
                <a href="/" className="nps-navbar__brand" aria-label="NPS Central home">
                    <div className="nps-navbar__brand-icon">
                        <Shield size={15} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span className="nps-navbar__brand-name">
                        NPS<em>Central</em>
                    </span>
                </a>

                {/* ── Desktop links ── */}
                <div className="nps-navbar__links">
                    {links.map(link => {
                        const isActive =
                            (link.href !== '#' && link.href !== '/' && activePath === link.href) ||
                            (variant === 'dashboard' && link.label === 'Dashboard' && activePath === '/dashboard') ||
                            (variant === 'landing' && link.label === 'How it Works');
                        return (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`nps-navbar__link${isActive ? ' nps-navbar__link--active' : ''}`}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>

                {/* ── Desktop right — Landing ── */}
                {variant === 'landing' && (
                    <div className="nps-navbar__actions">
                        <button
                            id="nav-signin-btn"
                            className="nps-navbar__signin"
                            onClick={() => alert('Sign In')}
                            aria-label="Sign in to your account"
                        >
                            Sign In
                        </button>
                        <button
                            id="nav-signup-btn"
                            className="nps-navbar__signup"
                            onClick={() => window.location.href = '/dashboard'}
                            aria-label="Create NPS account"
                        >
                            <TrendingUp size={14} />
                            Open Account
                        </button>
                    </div>
                )}

                {/* ── Desktop right — Dashboard ── */}
                {variant === 'dashboard' && (
                    <div className="nps-navbar__actions">
                        <button className="nps-navbar__icon-btn" aria-label="Notifications">
                            <Bell size={17} />
                            <span className="nps-navbar__notif-dot" />
                        </button>
                        <div className="nps-navbar__user" role="button" tabIndex={0}>
                            <div className="nps-navbar__avatar">PS</div>
                            <div className="nps-navbar__user-info">
                                <span className="nps-navbar__user-name">Priya Sharma</span>
                                <span className="nps-navbar__user-pran">PRAN 1100229381</span>
                            </div>
                            <ChevronDown size={13} color="rgba(255,255,255,0.6)" />
                        </div>
                    </div>
                )}

                {/* ── Mobile hamburger ── */}
                <button
                    className="nps-navbar__hamburger"
                    onClick={() => setMobileOpen(v => !v)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* ── Mobile Drawer ── */}
            <div className={`nps-navbar__drawer${mobileOpen ? ' nps-navbar__drawer--open' : ''}`}
                aria-hidden={!mobileOpen}>
                <div className="nps-navbar__drawer-links">
                    {links.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="nps-navbar__drawer-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {variant === 'landing' && (
                    <div className="nps-navbar__drawer-actions">
                        <button className="nps-navbar__signin" onClick={() => setMobileOpen(false)}>
                            Sign In
                        </button>
                        <button
                            className="nps-navbar__signup nps-navbar__signup--full"
                            onClick={() => { setMobileOpen(false); window.location.href = '/dashboard'; }}
                        >
                            <TrendingUp size={14} /> Open Account
                        </button>
                    </div>
                )}

                {variant === 'dashboard' && (
                    <div className="nps-navbar__drawer-user">
                        <div className="nps-navbar__avatar">PS</div>
                        <div>
                            <div className="nps-navbar__user-name">Priya Sharma</div>
                            <div className="nps-navbar__user-pran">PRAN 1100229381</div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
