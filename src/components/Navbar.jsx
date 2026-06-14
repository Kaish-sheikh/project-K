import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ transparent = false, dark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;
  const navClass = `navbar ${scrolled ? 'navbar--scrolled' : ''} ${transparent && !scrolled ? 'navbar--transparent' : ''} ${dark ? 'navbar--dark' : ''} ${menuOpen ? 'navbar--open' : ''}`;

  return (
    <nav className={navClass} id="main-navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__logo" id="nav-logo">
          <Heart className="navbar__logo-icon" size={20} />
          <span className="navbar__logo-text">
            <span className="font-script">EternalVow</span>
          </span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`} id="nav-home">Home</Link>
          <Link to="/templates" className={`navbar__link ${isActive('/templates') ? 'navbar__link--active' : ''}`} id="nav-templates">Templates</Link>
          {isAuthenticated && (
            <>
              <Link to="/customizer" className={`navbar__link ${isActive('/customizer') ? 'navbar__link--active' : ''}`} id="nav-customizer">Customizer</Link>
              <Link to="/dashboard" className={`navbar__link ${isActive('/dashboard') ? 'navbar__link--active' : ''}`} id="nav-dashboard">Dashboard</Link>
            </>
          )}
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm navbar__cta" id="nav-cta">
              <User size={14} />
              {user?.name?.split(' ')[0] || 'Dashboard'}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm navbar__cta" id="nav-cta">
              <LogIn size={14} />
              Sign In
            </Link>
          )}
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="nav-hamburger"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
