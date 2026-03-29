import React, { useState, useEffect } from 'react';
import './App.css';
import appLogo from './assets/appLogo.png';
import appScreenshot from './assets/app-screenshot.png';
import { Purchases } from '@revenuecat/purchases-js';


function Home({ currentView, setCurrentView, loggedInUser, setLoggedInUser, apiBase }) {
    const [showSubscriptions, setShowSubscriptions] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [showProfile, setShowProfile] = useState(false);
    const [cancelConfirm, setCancelConfirm] = useState(false);
    const [upgradeConfirm, setUpgradeConfirm] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // RevenueCat integration
    const [offerings, setOfferings] = useState(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const initRC = async () => {
            try {
                // Configure RevenueCat Web SDK
                const appUserID = loggedInUser?.username;
                Purchases.configure("test_JpyGVfIUWRKzJkYdVDELWgTOLTR", appUserID);
                
                // Fetch dynamic offerings
                const offs = await Purchases.getOfferings();
                if (offs && offs.current) {
                    setOfferings(offs.current);
                }

                // Check entitlements
                if (appUserID) {
                    const customerInfo = await Purchases.getCustomerInfo();
                    const entitlements = customerInfo.entitlements.active;
                    if (entitlements['Weld Scan Technologies / Skanesis Pro'] || entitlements['Pro'] || entitlements['pro']) {
                        setIsPro(true);
                    }
                }
            } catch (e) {
                console.error("RevenueCat Init error:", e);
            }
        };
        initRC();
    }, [loggedInUser]);

    const handlePurchase = async (pkg) => {
        if (!pkg) return;
        setIsUpdating(true);
        try {
            const { customerInfo } = await Purchases.purchasePackage(pkg);
            const entitlements = customerInfo.entitlements.active;
            if (entitlements['Weld Scan Technologies / Skanesis Pro'] || entitlements['Pro'] || entitlements['pro']) {
                setIsPro(true);
                // Also update local User state if needed
                if (loggedInUser) {
                    setLoggedInUser({ ...loggedInUser, subscriptionType: 'premium' });
                }
                alert("Subscription Success: You are now a Premium user!");
            }
        } catch (e) {
            console.error("Purchase error", e);
            if (!e.userCancelled) {
                alert(`Test Purchase Error: To complete the test on web, ensure Stripe Test Mode is configured in RevenueCat dashboard. (Debug: ${e.message})`);
            }
        } finally {
            setIsUpdating(false);
            setShowSubscriptions(false);
        }
    };

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
                <div className="nav-brand" onClick={() => setCurrentView('home')}>
                    <img src={appLogo} alt="Skanesis Logo" className="nav-logo" />
                    <span className="nav-title">Skanesis</span>
                </div>

                <div className="nav-links">
                    <button onClick={() => setCurrentView('company')} className="nav-text-link">Weld Scan Technologies</button>
                    <a href="#features" className="nav-text-link">Features</a>
                    <button onClick={() => setShowSubscriptions(true)} className="nav-text-link">Subscriptions</button>
                    {loggedInUser ? (
                        <div className="nav-user-menu">
                            <button className="nav-user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {loggedInUser.username} <span className="nav-user-role">({loggedInUser.role} - {loggedInUser.subscriptionType ? loggedInUser.subscriptionType.replace(/\b\w/g, l => l.toUpperCase()) : 'Regular'})</span>
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
                            {currentView !== 'login' && (
                                <button
                                    className="nav-btn-outline"
                                    onClick={() => setCurrentView('login')}
                                >
                                    Sign In
                                </button>
                            )}
                            {currentView !== 'signup' && (
                                <button
                                    className="nav-btn-filled"
                                    onClick={() => setCurrentView('signup')}
                                >
                                    Sign Up
                                </button>
                            )}
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
                        {loggedInUser ? (
                            <a 
                                href="/WeldScanViewer.exe" 
                                download="WeldScanViewer.exe" 
                                className="btn-primary hero-btn"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                Download Desktop App
                            </a>
                        ) : (
                            <button
                                className="btn-primary hero-btn"
                                onClick={() => setCurrentView('signup')}
                            >
                                Get Started Now
                            </button>
                        )}
                    </div>
                </div>

                {/* Dashboard Mockup / Image Placeholder */}
                <div className="hero-mockup bounce-in" style={{ animationDelay: '1.2s' }}>
                    <div className="mockup-header">
                        <div className="dot red"></div>
                        <div className="dot yellow"></div>
                        <div className="dot green"></div>
                    </div>
                    <div className="mockup-body">
                        <img src={appScreenshot} alt="Skanesis Application Preview" className="mockup-image" />
                    </div>
                </div>
            </section>

            {/* Stats Band */}
            <section className="stats-band">
                <div className="stat-item">
                    <h3 className="stat-number">91.5%</h3>
                    <p className="stat-label">AI Accuracy Level</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-number">10k+</h3>
                    <p className="stat-label">Scans Processed</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-number">0.5s</h3>
                    <p className="stat-label">Avg. Analysis Time</p>
                </div>
                <div className="stat-item">
                    <h3 className="stat-number">256-bit</h3>
                    <p className="stat-label">Secure Encryption</p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>Why Choose Skanesis?</h2>
                    <p>Designed by engineers, for engineers. Unmatched precision meets seamless workflow.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>AI Defect Detection</h3>
                        <p>Our proprietary neural networks instantly highlight porosity, cracks, and lack of fusion with unprecedented accuracy.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Instant Reporting</h3>
                        <p>Generate industry-compliant, detailed PDF reports with one click. Automate your documentation process.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">☁️</div>
                        <h3>Cloud Collaboration</h3>
                        <p>Securely share DICOM files and analysis results with your team anywhere in the world, in real-time.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚙️</div>
                        <h3>Seamless Integration</h3>
                        <p>Easily integrates with your existing NDT hardware and ERP systems via our secure REST API.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-bottom">
                    <p>&copy; 2026 Skanesis by Weld Scan Technologies. All rights reserved.</p>
                </div>
            </footer>

            {/* Subscriptions Modal Overlay - Enhanced Premium UI */}
            {showSubscriptions && (
                <div className="modal-overlay animate-fade-in premium-overlay" onClick={() => setShowSubscriptions(false)}>
                    {/* Glassmorphism Premium Container */}
                    <div className="modal-content animate-pop-in premium-modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '1000px'}}>
                        <button className="modal-close-btn premium-close" onClick={() => setShowSubscriptions(false)}>✕</button>
                        
                        <div className="premium-modal-header">
                            <h2 className="premium-title">Skanesis <span className="highlight-gold inline-bounce">Premium</span></h2>
                            <p className="premium-subtitle">Unlock the full power of AI-driven defect detection software.</p>
                            {isPro && <div className="active-pro-badge pulse">⭐ You are currently a Pro member! ⭐</div>}
                        </div>

                        <div className="pricing-grid-horizontal premium-pricing-grid">
                            {/* Free Plan */}
                            <div className="pricing-card premium-card glass-card basic-tier">
                                <div className="tier-header">
                                    <h3>Free</h3>
                                    <p className="tier-desc">For individuals & students</p>
                                </div>
                                <div className="price-container">
                                    <span className="price">$0</span><span className="period">/mo</span>
                                </div>
                                <ul className="premium-features-list">
                                    <li><i className="check-icon">✓</i> Basic AI Reports</li>
                                    <li><i className="check-icon">✓</i> 10 Scans per month</li>
                                    <li><i className="check-icon">✓</i> Standard Support</li>
                                </ul>
                                <button className="nav-btn-outline premium-btn-outline" onClick={() => { setShowSubscriptions(false); setCurrentView('signup'); }}>
                                    Current Plan
                                </button>
                            </div>

                            {/* Pro Plan (RevenueCat) */}
                            <div className="pricing-card premium-card glass-card popular-tier">
                                <div className="card-glow"></div>
                                <div className="popular-badge gold-badge">RECOMMENDED</div>
                                <div className="tier-header">
                                    <h3>Pro</h3>
                                    <p className="tier-desc">For professionals & small shops</p>
                                </div>
                                <div className="price-container">
                                    <span className="price">{offerings?.monthly ? offerings.monthly.product.priceString : '$49'}</span>
                                    <span className="period">/mo</span>
                                </div>
                                <ul className="premium-features-list">
                                    <li className="highlight-feature"><i className="check-icon gold-icon">★</i> Unlimited AI Detection</li>
                                    <li className="highlight-feature"><i className="check-icon gold-icon">★</i> Uncapped High-Res Scans</li>
                                    <li><i className="check-icon">✓</i> Cloud Sync & Export</li>
                                    <li><i className="check-icon">✓</i> Priority Rendering</li>
                                </ul>
                                <button 
                                    className={`nav-btn-filled premium-submit-btn ${isUpdating ? 'processing' : ''}`} 
                                    disabled={isUpdating || isPro} 
                                    onClick={() => {
                                        if (offerings?.monthly) {
                                            handlePurchase(offerings.monthly);
                                        } else {
                                            // Fallback for demo or if no offerings fetched
                                            handlePurchase({ product: "demo-package" });
                                        }
                                    }}
                                >
                                    {isUpdating ? 'Processing...' : (isPro ? 'Active Subscription' : 'Upgrade to Pro')}
                                </button>
                            </div>

                            {/* Admin/Enterprise Plan */}
                            <div className="pricing-card premium-card glass-card enterprise-tier">
                                <div className="tier-header">
                                    <h3>Enterprise</h3>
                                    <p className="tier-desc">For large industrial teams</p>
                                </div>
                                <div className="price-container">
                                    <span className="price">Custom</span>
                                </div>
                                <ul className="premium-features-list">
                                    <li><i className="check-icon">✓</i> Custom AI Workflows</li>
                                    <li><i className="check-icon">✓</i> Unlimited Users</li>
                                    <li><i className="check-icon">✓</i> Dedicated Account Manager</li>
                                    <li><i className="check-icon">✓</i> On-Premise Deployment</li>
                                </ul>
                                <button className="nav-btn-outline premium-btn-outline" onClick={() => { setShowSubscriptions(false); }}>
                                    Contact Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal Overlay */}
            {showLogoutConfirm && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
                    <div className="modal-content animate-pop-in" style={{ maxWidth: '380px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '20px' }}>Confirm Logout</h3>
                        <p style={{ color: '#b0bec5', marginBottom: '25px', fontSize: '15px' }}>Are you sure you want to log out from Skanesis?</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="nav-btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                            <button className="nav-btn-filled" style={{ flex: 1, padding: '12px', background: '#e11d48' }} onClick={handleLogoutConfirm}>Log out</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfile && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowProfile(false)}>
                    <div className="modal-content animate-pop-in" style={{ maxWidth: '400px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowProfile(false)}>✕</button>
                        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Your Profile</h2>
                        <b style={{ color: '#0ea5e9', fontSize: '20px' }}>{loggedInUser?.username}</b>
                        <p style={{ color: '#b0bec5', margin: '15px 0' }}>Current Package: <b style={{color: '#fff'}}>{loggedInUser?.subscriptionType?.replace(/\b\w/g, l => l.toUpperCase()) || 'Regular'}</b></p>
                        
                        {loggedInUser?.subscriptionType !== 'regular' && (
                            <button className="nav-btn-outline" style={{ borderColor: '#e11d48', color: '#e11d48', marginTop: '20px', width: '100%', padding: '12px' }}
                                onClick={() => { setShowProfile(false); setCancelConfirm(true); }}>
                                I want to cancel my subscription
                            </button>
                        )}
                    </div>
                </div>
            )}

            {cancelConfirm && (
                <div className="modal-overlay animate-fade-in" onClick={() => !isUpdating && setCancelConfirm(false)}>
                    <div className="modal-content animate-pop-in" style={{ maxWidth: '400px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#fff', marginBottom: '15px' }}>Cancel Subscription?</h3>
                        <p style={{ color: '#b0bec5', marginBottom: '25px' }}>Are you sure you want to cancel your subscription? Your privileges will be reverted to Free User.</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="nav-btn-outline" style={{ flex: 1, padding: '12px' }} disabled={isUpdating} onClick={() => setCancelConfirm(false)}>No, keep it</button>
                            <button className="nav-btn-filled" style={{ flex: 1, padding: '12px', background: '#e11d48' }} disabled={isUpdating} onClick={() => updateSubscription('regular')}>{isUpdating ? "Canceling..." : "Yes, cancel"}</button>
                        </div>
                    </div>
                </div>
            )}

            {upgradeConfirm && (
                <div className="modal-overlay animate-fade-in" onClick={() => !isUpdating && setUpgradeConfirm(null)}>
                    <div className="modal-content animate-pop-in" style={{ maxWidth: '400px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#fff', marginBottom: '15px' }}>Confirm Purchase</h3>
                        <p style={{ color: '#b0bec5', marginBottom: '25px', lineHeight: '1.5' }}>Are you sure you want to buy the <b style={{color: '#0ea5e9'}}>{upgradeConfirm.replace(/\b\w/g, l => l.toUpperCase())}</b> plan?</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="nav-btn-outline" style={{ flex: 1, padding: '12px' }} disabled={isUpdating} onClick={() => setUpgradeConfirm(null)}>Cancel</button>
                            <button className="nav-btn-filled" style={{ flex: 1, padding: '12px' }} disabled={isUpdating} onClick={() => updateSubscription(upgradeConfirm)}>{isUpdating ? "Processing..." : "Yes, purchase"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
