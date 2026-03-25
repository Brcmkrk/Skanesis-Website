import React from 'react';
import './App.css';
import appLogo from './assets/appLogo.png';

function CompanyHome({ setCurrentView }) {
    return (
        <div className="company-home">
            <nav className="navbar">
                <div className="nav-brand">
                    <img src={appLogo} alt="Weld Scan Logo" className="nav-logo" />
                    <span className="nav-title">Weld Scan Technologies</span>
                </div>
                <div className="nav-links">
                    <a href="#home" className="nav-text-link">Home</a>
                    <a href="#about" className="nav-text-link">About Us</a>
                    <a href="#products" className="nav-text-link">Products</a>
                    <a href="#contact" className="nav-text-link">Contact</a>
                    <button className="nav-btn-filled" onClick={() => setCurrentView('login')}>Sign In</button>
                </div>
            </nav>

            <header id="home" className="company-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Precision in Every <span className="highlight-text">Weld</span></h1>
                    <p className="hero-subtitle">
                        Leading the industry with state-of-the-art welding inspection technologies. 
                        Reliability, accuracy, and innovation at the core of your manufacturing.
                    </p>
                    <div className="hero-cta-group">
                        <a href="#products" className="btn-primary hero-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>Explore Products</a>
                        <button className="btn-secondary hero-btn">Contact Sales</button>
                    </div>
                </div>
            </header>

            <section id="about" className="company-section">
                <div className="section-header">
                    <h2>About Us</h2>
                    <p>Weld Scan Technologies has been at the forefront of industrial inspection for over a decade.</p>
                </div>
                <div className="about-grid">
                    <div className="about-card">
                        <h3>Our Mission</h3>
                        <p>To provide non-destructive testing solutions that ensure the safety and integrity of global infrastructure.</p>
                    </div>
                    <div className="about-card">
                        <h3>Global Reach</h3>
                        <p>With partners in over 30 countries, we bring high-tech inspection systems to every corner of the globe.</p>
                    </div>
                </div>
            </section>

            <section id="products" className="company-section light-bg">
                <div className="section-header">
                    <h2>Our Products</h2>
                    <p>Discover our range of advanced inspection tools.</p>
                </div>
                <div className="product-grid">
                    <div className="product-card featured">
                        <div className="product-tag">Flagship Product</div>
                        <h3>Skanesis AI</h3>
                        <p>Automated welding defect detection powered by advanced neural networks. Speed up your inspection by 500%.</p>
                        <button className="btn-primary" onClick={() => setCurrentView('skanesis-home')}>View Skanesis</button>
                    </div>
                    <div className="product-card">
                        <h3>WeldMaster 3000</h3>
                        <p>Portable ultrasonic testing device for on-site inspections. Rugged, durable, and precise.</p>
                        <button className="btn-secondary">Coming Soon</button>
                    </div>
                </div>
            </section>

            <section id="contact" className="company-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Have questions about our technology? We're here to help.</p>
                        <div className="contact-item">
                            <span>📍</span> 123 Industry Ave, Tech City
                        </div>
                        <div className="contact-item">
                            <span>📧</span> contact@weldscantech.com
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder="Name" className="input-field" />
                        <input type="email" placeholder="Email" className="input-field" />
                        <textarea placeholder="Message" className="input-field textarea" rows="4"></textarea>
                        <button type="submit" className="btn-primary">Send Message</button>
                    </form>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2026 Weld Scan Technologies. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default CompanyHome;
