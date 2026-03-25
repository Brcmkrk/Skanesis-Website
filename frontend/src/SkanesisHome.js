import React, { useState } from 'react';
import './App.css';
import appLogo from './assets/appLogo.png';

function SkanesisHome({ currentView, setCurrentView, loggedInUser, setLoggedInUser, apiBase }) {
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [showProfile, setShowProfile] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const [upgradeConfirm, setUpgradeConfirm] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const updateSubscription = async (newType) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`${apiBase}/update_subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loggedInUser.username, new_type: newType })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setLoggedInUser({ ...loggedInUser, subscriptionType: newType });
            } else {
                alert("Failed to update subscription");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating subscription");
        } finally {
            setIsUpdating(false);
            setCancelConfirm(false);
            setUpgradeConfirm(null);
            setShowSubscriptions(false);
        }
    };

    const handleLogoutConfirm = () => {
        setIsLoggingOut(true);
        setShowLogoutConfirm(false);
        setTimeout(() => {
            setLoggedInUser(null);
            setIsLoggingOut(false);
        }, 500); // Wait for fade-out animation
    };

    return (
        <div className={`home-container animate-fade-in ${isLoggingOut ? 'logout-fade-out' : ''}`}>
            {/* Decorative Grid/Glow Elements in Background */}
            <div className="ambient-glow top-left"></div>
            <div className="ambient-glow bottom-right"></div>
            <div className="ambient-glow middle-right"></div>

            {/* Navigation Bar */}
            <nav className="navbar animate-slide-up">
                <div className="nav-brand" onClick={() => setCurrentView('company')}>
                    <img src={appLogo} alt="Skanesis Logo" className="nav-logo" />
                    <span className="nav-title">Skanesis</span>
                </div>

                <div className="nav-links">
                    <button onClick={() => setCurrentView('company')} className="nav-text-link">Weld Scan Home</button>
                    <a href="#features" className="nav-text-link">Features</a>
                    <button onClick={() => setShowSubscriptions(true)} className="nav-text-link">Subscriptions</button>
                    {loggedInUser ? (
                        <div className="nav-user-menu">
                            <button className="nav-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {loggedInUser.username} <span className="nav-user-role">({loggedInUser.role})</span>
                            </button>
                            {dropdownOpen && (
                                <div className="nav-user-dropdown">
                                    <button onClick={() => { setDropdownOpen(false); setShowProfile(true); }} className="nav-dropdown-item">Profile</button>
                                    <button onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }} className="nav-dropdown-item">Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button className="nav-btn-outline" onClick={() => setCurrentView('login')}>Sign In</button>
                            <button className="nav-btn-filled" onClick={() => setCurrentView('signup')}>Sign Up</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="badge bounce-in" style={{ animationDelay: '0.1s' }}>Next Generation Inspection</div>
                    <h1 className="hero-title bounce-in" style={{ animationDelay: '0.3s' }}>
                        The Future of <span className="highlight-text inline-bounce" style={{ animationDelay: '0.5s' }}>Welding Intelligence</span>
                    </h1>
                    <p className="hero-subtitle bounce-in" style={{ animationDelay: '0.7s' }}>
                        Advanced AI-powered defect detection and reporting software designed
                        for modern industrial workflows. Fast, accurate, and completely secure.
                    </p>

                    <div className="hero-cta-group bounce-in" style={{ animationDelay: '0.9s' }}>
                        <button className="btn-primary hero-btn" onClick={() => setCurrentView('signup')}>Get Started Now</button>
                        <button className="btn-secondary hero-btn">Watch Demo</button>
                    </div>
                </div>

                <div className="hero-mockup bounce-in" style={{ animationDelay: '1.2s' }}>
                    <div className="mockup-header"><div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div></div>
                    <div className="mockup-body" style={{height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.5}}>Skanesis Dashboard Mockup</div>
                </div>
            </section>

            {/* Stats Band */}
            <section className="stats-band">
                <div className="stat-item"><h3 className="stat-number">91.5%</h3><p className="stat-label">AI Accuracy</p></div>
                <div className="stat-item"><h3 className="stat-number">10k+</h3><p className="stat-label">Scans Done</p></div>
                <div className="stat-item"><h3 className="stat-number">0.5s</h3><p className="stat-label">Avg. Speed</p></div>
                <div className="stat-item"><h3 className="stat-number">256-bit</h3><p className="stat-label">Encryption</p></div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 style={{color: '#fff'}}>Why Choose Skanesis?</h2>
                    <p style={{color: '#b0bec5'}}>Unmatched precision meets seamless workflow.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card"><h3>🔍 AI Detection</h3><p>Neural networks highlight porosity and cracks instantly.</p></div>
                    <div className="feature-card"><h3>📊 Instant Reporting</h3><p>Generate industry-compliant reports with one click.</p></div>
                    <div className="feature-card"><h3>☁️ Cloud Sync</h3><p>Securely share results with your team anywhere.</p></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-bottom"><p>&copy; 2026 Skanesis. All rights reserved.</p></div>
            </footer>

            {/* Subscriptions Modal Overlay (Full version) */}
            {showSubscriptions && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowSubscriptions(false)}>
                    <div className="modal-content animate-pop-in" onClick={e => e.stopPropagation()} style={{maxWidth: '900px'}}>
                        <button className="modal-close-btn" onClick={() => setShowSubscriptions(false)}>✕</button>
                        <h2 style={{color: '#fff', textAlign: 'center', marginBottom: '30px'}}>Skanesis Subscription Plans</h2>
                        <div className="pricing-grid-horizontal">
                            <div className="pricing-card">
                                <h3>Free</h3><p>$0/mo</p>
                                <button className="nav-btn-outline" onClick={() => { setShowSubscriptions(false); setCurrentView('signup'); }}>Get Started</button>
                            </div>
                            <div className="pricing-card popular">
                                <h3>Pro</h3><p>$5/mo</p>
                                <button className="nav-btn-filled" onClick={() => setUpgradeConfirm('premium')}>Select Pro</button>
                            </div>
                            <div className="pricing-card">
                                <h3>Admin</h3><p>$50/mo</p>
                                <button className="btn-primary" onClick={() => { setShowSubscriptions(false); setCurrentView('signup'); }}>Contact Sales</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
                    <div className="modal-content animate-pop-in" style={{ maxWidth: '380px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#fff' }}>Confirm Logout</h3>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button className="nav-btn-outline" style={{ flex: 1 }} onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="nav-btn-filled" style={{ flex: 1, background: '#e11d48' }} onClick={handleLogoutConfirm}>Log out</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SkanesisHome;
