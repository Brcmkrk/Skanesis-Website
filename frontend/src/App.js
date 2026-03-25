import React, { useState } from 'react';
import './App.css';
import appLogo from './assets/appLogo.png';
import Home from './Home';

const API_BASE = "https://f328-178-241-126-209.ngrok-free.app/api/auth";

function App() {
  // 'home', 'login', 'signup', 'verification'
  const [currentView, setCurrentView] = useState('home');
  const [loggedInUser, setLoggedInUser] = useState(null); // { username, role }

  // Form States - Login
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Form States - Verification
  const [verificationCode, setVerificationCode] = useState("");

  // Form States - Sign Up
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (currentView === 'signup' && confirmPassword) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setLoginUsername("");
    setLoginPassword("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setPasswordsMatch(true);
    setTermsAccepted(false);
    setVerificationCode("");
    setFormError("");
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    let missingArgs = [];
    if (!loginUsername.trim()) missingArgs.push("Username or Email");
    if (!loginPassword.trim()) missingArgs.push("Password");

    if (missingArgs.length > 0) {
      setFormError(`Please enter: ${missingArgs.join(", ")}`);
      return;
    }

    setFormError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFormError("");
        console.log("Login successful", data);
        setLoggedInUser({
          username: data.username || loginUsername.trim(),
          role: data.role || "user",
          subscriptionType: data.subscription_type || "regular"
        });
        setCurrentView('home');
      } else {
        setFormError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setFormError("Could not reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      setFormError("Please enter a valid 6-digit code.");
      return;
    }
    setFormError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          verificationCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentView('login');
        setLoginUsername(username.trim());
        setFormError("Account verified and created! Please log in.");
        setVerificationCode("");
      } else {
        setFormError(data.message || "Invalid verification code.");
      }
    } catch (err) {
      setFormError("Could not reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    let missingFields = [];
    if (!username.trim()) missingFields.push("Username");
    if (!email.trim()) missingFields.push("Email");
    if (!password.trim()) missingFields.push("New Password");
    if (!confirmPassword.trim()) missingFields.push("Confirm Password");
    if (!termsAccepted) missingFields.push("Terms of Service");

    if (missingFields.length > 0) {
      setFormError(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!passwordsMatch) {
      setFormError("Passwords do not match!");
      return;
    }

    // ── API call ─────────────────────────────────────────────────────────────
    setFormError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/request_verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password, // Keeping it here just in case, though backend extracts what it needs
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentView('verification');
      } else {
        // Map backend error codes to user-friendly messages
        switch (data.code) {
          case 1:
            setFormError("An account with this email already exists.");
            break;
          case 2:
            setFormError("Please enter a valid email address.");
            break;
          case 3:
            setFormError(
              "Password must be 8–24 characters and include an uppercase letter, lowercase letter, number, and special character."
            );
            break;
          case 4:
            setFormError("This username is already taken. Please try a different name.");
            break;
          case 5:
            setFormError("A server error occurred. Please try again later.");
            break;
          default:
            setFormError(data.message || "Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      setFormError("Could not reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render Authentication Views (Login, Signup, Verification)
  const renderAuthView = () => {
    return (
      <div className="login-container">
        {/* Left Side: Branding */}
        <div className="brand-section">
          <img src={appLogo} alt="Skanesis Logo" className="brand-logo" />
          <h1 className="brand-title">Skanesis</h1>
          <p className="brand-slogan">
            Advanced welding inspection and reporting systems for modern industry.
          </p>
        </div>

        {/* Right Side: Auth Card */}
        <div className="card-section">
          <div className="auth-card">
            {currentView === 'login' ? (
              // LOGIN FORM
              <form className="form-container" key="login" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input
                  type="text"
                  placeholder="Username or Email"
                  className="input-field"
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input-field"
                    onChange={(e) => setLoginPassword(e.target.value)}
                    value={loginPassword}
                    autoComplete="current-password"
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                {formError && (
                  <p className="error-text" style={{ whiteSpace: 'pre-wrap' }}>{formError}</p>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </button>
                <button type="button" className="forgot-password" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Forgot Password?</button>
                <div className="divider"></div>
                <button
                  type="button"
                  className="btn-success"
                  onClick={() => {
                    resetForm();
                    setCurrentView('signup');
                  }}
                >
                  Create New Account
                </button>
              </form>
            ) : currentView === 'verification' ? (
              // VERIFICATION CODE FORM
              <form className="form-container" key="verification" onSubmit={(e) => { e.preventDefault(); handleVerification(); }}>
                <h3 className="form-title" style={{ marginTop: 0, color: '#2c3e50' }}>Enter Verification Code</h3>
                <p className="form-subtitle" style={{ color: '#666', marginBottom: '20px' }}>
                  We've sent a 6-digit code to your email. Please enter it below to confirm your account.
                </p>

                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="input-field center-text"
                  maxLength="6"
                  autoComplete="one-time-code"
                  name="verification_code_field"
                  style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '4px' }}
                  value={verificationCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setVerificationCode(val);
                  }}
                />

                {formError && (
                  <p className="error-text" style={{ whiteSpace: 'pre-wrap' }}>{formError}</p>
                )}

                <button type="submit" className="btn-success wide" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Account"}
                </button>
                <div className="divider"></div>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    resetForm();
                    setCurrentView('signup');
                  }}
                >
                  Back to Sign Up
                </button>
              </form>
            ) : (
              // SIGN UP FORM
              <form className="form-container" key="signup" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                <input
                  type="text"
                  placeholder="Username"
                  className="input-field"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="input-field"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className={`input-field ${!passwordsMatch ? "error-border" : ""}`}
                    onChange={handlePasswordChange}
                    value={password}
                    autoComplete="new-password"
                  />
                  <span className="password-toggle" onClick={togglePasswordVisibility}>
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={`input-field ${!passwordsMatch ? "error-border" : ""}`}
                    onChange={handleConfirmPasswordChange}
                    value={confirmPassword}
                    autoComplete="new-password"
                  />
                </div>

                {!passwordsMatch && (
                  <p className="error-text">Passwords do not match!</p>
                )}

                {formError && (
                  <p className="error-text" style={{ whiteSpace: 'pre-wrap' }}>{formError}</p>
                )}

                <div className="terms-container" onClick={() => setTermsAccepted(!termsAccepted)}>
                  <div className={`terms-checkbox ${termsAccepted ? 'checked' : ''}`}>
                    {termsAccepted && "✓"}
                  </div>
                  <p className="terms-text">
                    I agree to the Terms, Data Policy and Cookie Policy.
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn-success wide"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>
                <div className="divider"></div>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    resetForm();
                    setCurrentView('login');
                  }}
                >
                  Already have an account?
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {/* Top Navigation Wrapper for Auth screens so user can return Home */}
      {currentView !== 'home' && (
        <nav className="navbar compact animate-slide-up">
          <div className="nav-brand" onClick={() => setCurrentView('home')} style={{ cursor: 'pointer' }}>
            <img src={appLogo} alt="Skanesis Logo" className="nav-logo" />
            <span className="nav-title">Skanesis</span>
          </div>
          <div className="nav-links">
            <button className="nav-text-link">About Us</button>
            <button className="nav-text-link">Contact</button>
            <button className="nav-btn-outline" onClick={() => setCurrentView('home')}>
              Back to Home
            </button>
          </div>
        </nav>
      )}

      {currentView === 'home' ? (
        <Home 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          loggedInUser={loggedInUser} 
          setLoggedInUser={setLoggedInUser} 
          apiBase={API_BASE}
        />
      ) : (
        renderAuthView()
      )}
    </div>
  );
}

export default App;
