import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useUser } from '../context/UserContext';
import { signIn as apiSignIn, signUp as apiSignUp } from '../services/api';
import './SignIn.css';

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 5c-5.2 0-9.4 3.3-11 7 1.6 3.7 5.8 7 11 7s9.4-3.3 11-7c-1.6-3.7-5.8-7-11-7zm0 11.2A4.2 4.2 0 1 1 12 7.8a4.2 4.2 0 0 1 0 8.4zm0-6.8a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z" />
  </svg>
);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignIn() {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [legalPreviewType, setLegalPreviewType] = useState(null);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [signupErrors, setSignupErrors] = useState({});

  const { signIn } = useUser();
  const navigate = useNavigate();

  const switchTab = (t) => {
    setTab(t);
    setGlobalError('');
    setLoginErrors({});
    setSignupErrors({});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginEmail) errs.loginEmail = 'Email is required.';
    else if (!emailPattern.test(loginEmail)) errs.loginEmail = 'Please enter a valid email address.';
    if (!loginPassword) errs.loginPassword = 'Password is required.';
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      const data = await apiSignIn(loginEmail, loginPassword);
      // Handle JWT response format from Django (has 'access' and 'user')
      const token = data.access || data.token;
      const user = data.user || data;
      signIn(user, token);
      navigate('/');
    } catch (err) {
      setGlobalError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!fullName) errs.fullName = 'Full name is required.';
    if (!signupEmail) errs.signupEmail = 'Email is required.';
    else if (!emailPattern.test(signupEmail)) errs.signupEmail = 'Please enter a valid email address.';
    if (!signupPassword) errs.signupPassword = 'Password is required.';
    else if (signupPassword.length < 8) errs.signupPassword = 'Password must be at least 8 characters.';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password.';
    else if (confirmPassword !== signupPassword) errs.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }

    setLoading(true);
    setGlobalError('');
    try {
      const data = await apiSignUp(signupEmail, signupPassword, 'user', fullName);
      // Handle JWT response format from Django (has 'access' and 'user')
      const token = data.access || data.token;
      const user = data.user || data;
      signIn(user, token);
      navigate('/');
    } catch (err) {
      setGlobalError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <p className="auth-brand">SNEAKR.LAB</p>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in or create an account to continue.</p>
        </header>

        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            type="button" role="tab"
            aria-selected={tab === 'login'}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab${tab === 'signup' ? ' active' : ''}`}
            type="button" role="tab"
            aria-selected={tab === 'signup'}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {globalError && <div className="auth-global-error">{globalError}</div>}

        {/* Login Panel */}
        <div className={`auth-panel${tab === 'login' ? ' active' : ''}`} role="tabpanel">
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="auth-field">
              <label htmlFor="loginEmail">Email</label>
              <input
                id="loginEmail"
                className={`auth-input${loginErrors.loginEmail ? ' invalid' : ''}`}
                type="email" placeholder="you@company.com"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors(p => ({ ...p, loginEmail: '' })); }}
              />
              <small className="auth-field-error">{loginErrors.loginEmail || ''}</small>
            </div>

            <div className="auth-field">
              <label htmlFor="loginPassword">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="loginPassword"
                  className={`auth-input${loginErrors.loginPassword ? ' invalid' : ''}`}
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors(p => ({ ...p, loginPassword: '' })); }}
                />
                <button className="auth-eye-btn" type="button" onClick={() => setShowLoginPw(v => !v)} aria-label={showLoginPw ? 'Hide password' : 'Show password'}>
                  <EyeIcon />
                </button>
              </div>
              <small className="auth-field-error">{loginErrors.loginPassword || ''}</small>
            </div>

            <div className="auth-row-actions">
              <button type="button" className="auth-forgot-link">Forgot Password?</button>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in…' : 'Log In'}
            </button>

            <p className="auth-terms-note">
              By continuing, you agree to our{' '}
              <Link
                to="/terms"
                state={{ showFooterLoader: true }}
                className="auth-terms-link"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalPreviewType('terms');
                }}
              >
                Terms and Services
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy-policy"
                state={{ showFooterLoader: true }}
                className="auth-terms-link"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalPreviewType('privacy');
                }}
              >
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {/* Sign Up Panel */}
        <div className={`auth-panel${tab === 'signup' ? ' active' : ''}`} role="tabpanel">
          <form className="auth-form" onSubmit={handleSignUp} noValidate>
            <div className="auth-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                className={`auth-input${signupErrors.fullName ? ' invalid' : ''}`}
                type="text" placeholder="Alex Morgan"
                autoComplete="name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setSignupErrors(p => ({ ...p, fullName: '' })); }}
              />
              <small className="auth-field-error">{signupErrors.fullName || ''}</small>
            </div>

            <div className="auth-field">
              <label htmlFor="signupEmail">Email</label>
              <input
                id="signupEmail"
                className={`auth-input${signupErrors.signupEmail ? ' invalid' : ''}`}
                type="email" placeholder="you@company.com"
                autoComplete="email"
                value={signupEmail}
                onChange={(e) => { setSignupEmail(e.target.value); setSignupErrors(p => ({ ...p, signupEmail: '' })); }}
              />
              <small className="auth-field-error">{signupErrors.signupEmail || ''}</small>
            </div>

            <div className="auth-field">
              <label htmlFor="signupPassword">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="signupPassword"
                  className={`auth-input${signupErrors.signupPassword ? ' invalid' : ''}`}
                  type={showSignupPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  value={signupPassword}
                  onChange={(e) => { setSignupPassword(e.target.value); setSignupErrors(p => ({ ...p, signupPassword: '' })); }}
                />
                <button className="auth-eye-btn" type="button" onClick={() => setShowSignupPw(v => !v)} aria-label={showSignupPw ? 'Hide password' : 'Show password'}>
                  <EyeIcon />
                </button>
              </div>
              <small className="auth-field-error">{signupErrors.signupPassword || ''}</small>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="auth-password-wrap">
                <input
                  id="confirmPassword"
                  className={`auth-input${signupErrors.confirmPassword ? ' invalid' : ''}`}
                  type={showConfirmPw ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setSignupErrors(p => ({ ...p, confirmPassword: '' })); }}
                />
                <button className="auth-eye-btn" type="button" onClick={() => setShowConfirmPw(v => !v)} aria-label={showConfirmPw ? 'Hide password' : 'Show password'}>
                  <EyeIcon />
                </button>
              </div>
              <small className="auth-field-error">{signupErrors.confirmPassword || ''}</small>
            </div>

            <button className="auth-submit-btn" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="auth-terms-note">
              By continuing, you agree to our{' '}
              <Link
                to="/terms"
                state={{ showFooterLoader: true }}
                className="auth-terms-link"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalPreviewType('terms');
                }}
              >
                Terms and Services
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy-policy"
                state={{ showFooterLoader: true }}
                className="auth-terms-link"
                onClick={(event) => {
                  event.preventDefault();
                  setLegalPreviewType('privacy');
                }}
              >
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {legalPreviewType && createPortal(
          <div
            className="auth-terms-preview-overlay"
            onClick={() => setLegalPreviewType(null)}
            role="presentation"
          >
            <div
              className="auth-terms-preview"
              role="dialog"
              aria-label={legalPreviewType === 'privacy' ? 'Privacy Policy preview' : 'Terms and Services preview'}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="auth-terms-preview__close"
                onClick={() => setLegalPreviewType(null)}
                aria-label="Close Terms preview"
              >
                ×
              </button>
              <h3>{legalPreviewType === 'privacy' ? 'Privacy Policy' : 'Terms and Services'}</h3>
              <iframe
                title={legalPreviewType === 'privacy' ? 'Privacy Policy' : 'Terms and Services'}
                src={legalPreviewType === 'privacy' ? '/privacy-policy?embed=1' : '/terms?embed=1'}
                className="auth-terms-preview__frame"
              />
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
