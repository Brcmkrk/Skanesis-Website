import React from 'react';
import './CompanyHome.css';
import appLogo from './assets/appLogo.png';

function CompanyHome({ setCurrentView }) {
    return (
        <div className="wst">
            {/* Navbar */}
            <nav className="wst-navbar">
                <div className="wst-nav-brand">
                    <img src={appLogo} alt="Weld Scan" className="wst-nav-logo" />
                    <span className="wst-nav-name">Weld Scan Technologies</span>
                </div>
                <div className="wst-nav-links">
                    <a href="#home" className="wst-nav-link">Home</a>
                    <a href="#about" className="wst-nav-link">About Us</a>
                    <a href="#products" className="wst-nav-link">Products</a>
                    <a href="#contact" className="wst-nav-link">Contact</a>
                </div>
            </nav>

            {/* Hero */}
            <section id="home" className="wst-hero">
                <div className="wst-hero-inner">
                    <div className="wst-hero-text">
                        <div className="wst-hero-badge wst-fade-up wst-delay-1">Industrial NDT Solutions</div>
                        <h1 className="wst-hero-title wst-fade-up wst-delay-2">
                            Precision in Every <span>Weld</span>
                        </h1>
                        <p className="wst-hero-desc wst-fade-up wst-delay-3">
                            Leading the industry with advanced non-destructive testing technologies. 
                            We ensure the safety and integrity of critical infrastructure worldwide.
                        </p>
                        <div className="wst-hero-actions wst-fade-up wst-delay-4">
                            <a href="#products" className="wst-btn-primary">Explore Products</a>
                            <a href="#contact" className="wst-btn-secondary">Contact Sales</a>
                        </div>
                    </div>
                    <div className="wst-hero-visual wst-fade-up wst-delay-5">
                        <div className="wst-hero-graphic">
                            <span className="wst-graphic-icon">🔬</span>
                            <span className="wst-graphic-text">Advanced NDT Systems</span>
                            <span className="wst-graphic-sub">AI-Powered Inspection</span>
                        </div>
                    </div>
                </div>
            </section>


            {/* About */}
            <section id="about" className="wst-section wst-about">
                <div className="wst-section-header">
                    <h2>About Us</h2>
                    <p>Weld Scan Technologies is an innovative tech company pioneering the next generation of non-destructive testing.</p>
                </div>
                <div className="wst-about-grid">
                    <div className="wst-about-card">
                        <span className="wst-about-card-icon">🎯</span>
                        <h3>Our Mission</h3>
                        <p>To provide cutting-edge NDT solutions that ensure the safety and structural integrity of critical infrastructure worldwide.</p>
                    </div>
                    <div className="wst-about-card">
                        <span className="wst-about-card-icon">🔭</span>
                        <h3>Our Vision</h3>
                        <p>A world where every weld is inspected with precision, preventing failures before they happen through intelligent automation.</p>
                    </div>
                    <div className="wst-about-card">
                        <span className="wst-about-card-icon">🚀</span>
                        <h3>Innovative Approach</h3>
                        <p>We leverage the latest advancements in artificial intelligence to deliver high-performance inspection systems for modern industries.</p>
                    </div>
                </div>
            </section>

            {/* Products */}
            <section id="products" className="wst-section wst-products">
                <div className="wst-section-header">
                    <h2>Our Products</h2>
                    <p>Industry-leading inspection software built for modern manufacturing workflows.</p>
                </div>
                <div className="wst-product-showcase">
                    <div className="wst-product-info">
                        <div className="wst-product-badge">Flagship Product</div>
                        <h3>Skanesis</h3>
                        <p>AI-powered welding defect detection and reporting platform. Analyze radiographic images in seconds with neural-network precision.</p>
                        <ul className="wst-product-features">
                            <li>91.5% AI accuracy on defect detection</li>
                            <li>Instant PDF report generation</li>
                            <li>Cloud-based DICOM file management</li>
                            <li>Real-time team collaboration</li>
                        </ul>
                        <button className="wst-btn-primary" onClick={() => setCurrentView('home')}>
                            Explore Skanesis →
                        </button>
                    </div>
                    <div className="wst-product-visual">
                        <span className="wst-product-icon-big">🔍</span>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="wst-section wst-contact">
                <div className="wst-section-header">
                    <h2>Contact Us</h2>
                    <p>Have questions about our technology? Our team is here to help.</p>
                </div>
                <div className="wst-contact-grid">
                    <div className="wst-contact-info">
                        <h3>Get in Touch</h3>
                        <p>Whether you need a product demo or have technical questions, we'd love to hear from you.</p>
                        
                        <div className="wst-contact-item">
                            <div className="wst-contact-item-icon">📍</div>
                            <div className="wst-contact-item-text">
                                <strong>Address</strong>
                                <span>123 Industry Avenue, Tech District</span>
                            </div>
                        </div>
                        <div className="wst-contact-item">
                            <div className="wst-contact-item-icon">📧</div>
                            <div className="wst-contact-item-text">
                                <strong>Email</strong>
                                <span>contact@weldscantech.com</span>
                            </div>
                        </div>
                        <div className="wst-contact-item">
                            <div className="wst-contact-item-icon">📞</div>
                            <div className="wst-contact-item-text">
                                <strong>Phone</strong>
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                    </div>
                    <form className="wst-contact-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder="Full Name" className="wst-input" />
                        <input type="email" placeholder="Email Address" className="wst-input" />
                        <input type="text" placeholder="Subject" className="wst-input" />
                        <textarea placeholder="Your Message" className="wst-input wst-textarea"></textarea>
                        <button type="submit" className="wst-btn-primary">Send Message</button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="wst-footer">
                <div className="wst-footer-inner">
                    <div className="wst-footer-brand">
                        <div className="wst-footer-brand-name">Weld Scan Technologies</div>
                        <p>Pioneering the future of non-destructive testing with AI-driven inspection solutions.</p>
                    </div>
                    <div className="wst-footer-col">
                        <h4>Products</h4>
                        <button onClick={() => setCurrentView('home')}>Skanesis</button>
                    </div>
                    <div className="wst-footer-col">
                        <h4>Company</h4>
                        <a href="#about">About Us</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="wst-footer-col">
                        <h4>Legal</h4>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#terms">Terms of Service</a>
                    </div>
                </div>
                <div className="wst-footer-bottom">
                    <p>&copy; 2026 Weld Scan Technologies. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default CompanyHome;
