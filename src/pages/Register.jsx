import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must contain uppercase, lowercase, and a number');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
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

        <h1 className="auth-card__title font-heading">Create Account</h1>
        <p className="auth-card__subtitle">Start building your dream wedding website</p>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form">
          {error && (
            <div className="auth-error" id="register-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="auth-field">
            <User size={16} className="auth-field__icon" />
            <input
              type="text"
              className="auth-input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
              id="register-name"
            />
          </div>

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
              id="register-email"
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
              minLength={8}
              autoComplete="new-password"
              id="register-password"
            />
            <p className="auth-field__hint">Min. 8 characters with uppercase, lowercase & number</p>
          </div>

          <button
            type="submit"
            className={`auth-submit ${loading ? 'auth-submit--loading' : ''}`}
            disabled={loading}
            id="register-submit"
          >
            {loading ? (
              <div className="auth-spinner" />
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <Link to="/" className="auth-card__home">
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
