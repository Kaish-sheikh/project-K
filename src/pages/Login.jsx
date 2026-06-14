import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-page__bg">
        <div className="auth-page__gradient" />
        <div className="auth-page__ring" />
        <div className="auth-page__ring" />
        <div className="auth-page__ring" />
      </div>

      <div className="auth-card">
        <div className="auth-card__logo">
          <span className="auth-card__logo-text font-heading">
            Eternal<span className="auth-card__logo-accent">Vow</span>
          </span>
        </div>

        <h1 className="auth-card__title font-heading">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to manage your wedding website</p>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form">
          {error && (
            <div className="auth-error" id="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <Mail size={16} className="auth-field__icon" />
            <input
              type="email"
              className="auth-input"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              id="login-email"
            />
          </div>

          <div className="auth-field">
            <Lock size={16} className="auth-field__icon" />
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              id="login-password"
            />
          </div>

          <button
            type="submit"
            className={`auth-submit ${loading ? 'auth-submit--loading' : ''}`}
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <div className="auth-spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>

        <Link to="/" className="auth-card__home">
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
