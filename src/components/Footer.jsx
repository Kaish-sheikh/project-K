import { Heart, Globe, Mail, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <Heart size={18} className="footer__logo-icon" />
            <span className="font-script footer__logo-text">EternalVow</span>
          </Link>
          <p className="footer__tagline">Your love story, beautifully told.</p>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="Instagram" id="footer-instagram">
              <Globe size={18} />
            </a>
            <a href="#" className="footer__social" aria-label="Email" id="footer-email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer__nav">
          <h4 className="footer__nav-title">Product</h4>
          <Link to="/templates" className="footer__nav-link" id="footer-templates">Templates</Link>
          <Link to="/customizer" className="footer__nav-link" id="footer-customizer">Customizer</Link>
          <Link to="/dashboard" className="footer__nav-link" id="footer-dashboard">Dashboard</Link>
          <a href="#" className="footer__nav-link">Pricing</a>
        </div>

        <div className="footer__nav">
          <h4 className="footer__nav-title">Company</h4>
          <a href="#" className="footer__nav-link">About</a>
          <a href="#" className="footer__nav-link">Blog</a>
          <a href="#" className="footer__nav-link">Careers</a>
          <a href="#" className="footer__nav-link">Contact</a>
        </div>

        <div className="footer__newsletter">
          <h4 className="footer__nav-title">Stay Updated</h4>
          <p className="footer__newsletter-text">Get wedding planning tips & new template announcements.</p>
          <form className="footer__form" onSubmit={(e) => e.preventDefault()} id="footer-newsletter-form">
            <input
              type="email"
              placeholder="Your email"
              className="footer__input"
              id="footer-email-input"
            />
            <button type="submit" className="btn btn-primary btn-sm" id="footer-subscribe-btn">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom container">
        <p className="footer__copyright">
          © {new Date().getFullYear()} EternalVow. Made with <Heart size={12} className="footer__heart" /> for couples everywhere.
        </p>
        <div className="footer__legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>

      <button className="footer__scroll-top" onClick={scrollToTop} aria-label="Scroll to top" id="scroll-to-top">
        <ArrowUp size={18} />
      </button>
    </footer>
  );
}
