import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, DollarSign, Users, Globe, ArrowRight, Sparkles,
  BarChart3, Target, Rocket, Shield, Heart, CheckCircle2, Send,
  Briefcase, PieChart, Zap, Award, Star, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import './Investors.css';

const MARKET_STATS = [
  { value: '$300B+', label: 'Global Wedding Industry', icon: Globe },
  { value: '$110B', label: 'Wedding Tech Market by 2028', icon: TrendingUp },
  { value: '2.5M', label: 'Weddings per Year (US Alone)', icon: Heart },
  { value: '89%', label: 'Couples Use a Wedding Website', icon: Users },
];

const REVENUE_MODEL = [
  { tier: 'Free', price: '$0', desc: 'Acquisition funnel — drives organic sign-ups', color: '#A8B5A2' },
  { tier: 'Premium', price: '$29', desc: 'Core revenue — one-time payment, 72% conversion target', color: '#B76E79' },
  { tier: 'Luxe', price: '$79', desc: 'High-margin upsell — white-glove service', color: '#D4AF37' },
  { tier: 'Custom Domain', price: '$12/yr', desc: 'Recurring revenue — annual domain renewal', color: '#2C3E50' },
];

const TRACTION = [
  { metric: 'Templates Shipped', value: '3', icon: Sparkles },
  { metric: 'Features Built', value: '15+', icon: Zap },
  { metric: 'Lines of Code', value: '10K+', icon: BarChart3 },
  { metric: 'Tech Stack', value: 'React + Node', icon: Rocket },
];

const COMPETITIVE_ADVANTAGES = [
  { title: 'Design-First Approach', desc: 'While competitors offer cookie-cutter templates, our designs rival luxury agencies — at a fraction of the cost.', icon: Award },
  { title: 'Full-Stack Ownership', desc: 'We own the entire stack: templates, customizer, RSVP system, guest management, and deployment pipeline.', icon: Shield },
  { title: 'AI-Powered Features', desc: 'Smart venue photo extraction, auto-compression galleries, and intelligent PDF export — tech competitors don\'t have.', icon: Zap },
  { title: 'Zero-Friction Onboarding', desc: 'From sign-up to a fully customized wedding website in under 5 minutes. No learning curve.', icon: Rocket },
];

const USE_OF_FUNDS = [
  { category: 'Product & Engineering', percent: 40, color: '#B76E79' },
  { category: 'Marketing & Growth', percent: 25, color: '#D4AF37' },
  { category: 'Infrastructure & Hosting', percent: 15, color: '#2C3E50' },
  { category: 'Design & UX Research', percent: 10, color: '#A8B5A2' },
  { category: 'Operations & Legal', percent: 10, color: '#8BA888' },
];

export default function Investors() {
  const [formData, setFormData] = useState({ name: '', email: '', firm: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="investors" id="investors-page">
      <Navbar />

      {/* Hero */}
      <section className="inv-hero" id="inv-hero">
        <div className="inv-hero__bg-grid" />
        <div className="inv-hero__glow inv-hero__glow--1" />
        <div className="inv-hero__glow inv-hero__glow--2" />
        <div className="container">
          <ScrollReveal>
            <div className="inv-hero__badge">
              <Briefcase size={14} />
              <span>Investor Relations</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="inv-hero__title font-heading">
              Disrupting the <span className="inv-hero__gradient-text">$300B Wedding Industry</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="inv-hero__subtitle">
              EternalVow is building the premium wedding website platform that couples actually deserve.
              We're raising our <strong>seed round</strong> to scale from MVP to market leader.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="inv-hero__actions">
              <a href="#inv-contact" className="btn btn-primary btn-lg">
                Get in Touch <ArrowRight size={18} />
              </a>
              <a href="#inv-market" className="btn btn-secondary btn-lg">
                View the Opportunity <ChevronRight size={18} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Market Stats */}
      <section className="inv-section" id="inv-market">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag">Market Opportunity</span>
              <h2 className="inv-title font-heading">A Massive, Growing Market</h2>
              <p className="inv-subtitle">The wedding industry is one of the most recession-resistant markets in the world. Couples will always get married — and they increasingly want premium digital experiences.</p>
            </div>
          </ScrollReveal>
          <div className="inv-stats-grid">
            {MARKET_STATS.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="inv-stat-card">
                  <stat.icon size={24} className="inv-stat-card__icon" />
                  <div className="inv-stat-card__value">{stat.value}</div>
                  <div className="inv-stat-card__label">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="inv-section inv-section--dark" id="inv-problem">
        <div className="container container-lg">
          <div className="inv-problem-grid">
            <ScrollReveal direction="left">
              <div className="inv-problem-card inv-problem-card--problem">
                <span className="inv-problem-card__tag">The Problem</span>
                <h3 className="inv-problem-card__title font-heading">Wedding websites today are uninspiring</h3>
                <ul className="inv-problem-card__list">
                  <li>Generic templates that all look the same</li>
                  <li>Clunky, outdated customization tools</li>
                  <li>No intelligent features (AI photo, PDF export)</li>
                  <li>Premium quality locked behind $200+ price tags</li>
                  <li>Poor mobile experience for guests</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="inv-problem-card inv-problem-card--solution">
                <span className="inv-problem-card__tag inv-problem-card__tag--gold">Our Solution</span>
                <h3 className="inv-problem-card__title font-heading">EternalVow: Premium, Intelligent, Affordable</h3>
                <ul className="inv-problem-card__list inv-problem-card__list--checks">
                  <li><CheckCircle2 size={16} /> Luxury-grade templates at indie pricing</li>
                  <li><CheckCircle2 size={16} /> Live customizer with real-time preview</li>
                  <li><CheckCircle2 size={16} /> AI venue photo extraction & smart galleries</li>
                  <li><CheckCircle2 size={16} /> One-click PDF export for sharing</li>
                  <li><CheckCircle2 size={16} /> Full RSVP & guest management suite</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Traction */}
      <section className="inv-section" id="inv-traction">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag">Traction</span>
              <h2 className="inv-title font-heading">What We've Built So Far</h2>
              <p className="inv-subtitle">We're pre-revenue and pre-launch, but the product is functional and feature-rich. Here's what our founding team has shipped:</p>
            </div>
          </ScrollReveal>
          <div className="inv-traction-grid">
            {TRACTION.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="inv-traction-card">
                  <item.icon size={20} className="inv-traction-card__icon" />
                  <div className="inv-traction-card__value">{item.value}</div>
                  <div className="inv-traction-card__metric">{item.metric}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="inv-section inv-section--cream" id="inv-advantages">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag">Why Us</span>
              <h2 className="inv-title font-heading">Our Competitive Moat</h2>
            </div>
          </ScrollReveal>
          <div className="inv-advantages-grid">
            {COMPETITIVE_ADVANTAGES.map((adv, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <div className="inv-advantage-card">
                  <div className="inv-advantage-card__icon-wrap">
                    <adv.icon size={22} />
                  </div>
                  <h3 className="inv-advantage-card__title">{adv.title}</h3>
                  <p className="inv-advantage-card__desc">{adv.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="inv-section" id="inv-revenue">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag">Business Model</span>
              <h2 className="inv-title font-heading">Revenue Architecture</h2>
              <p className="inv-subtitle">A simple, scalable freemium model with strong unit economics.</p>
            </div>
          </ScrollReveal>
          <div className="inv-revenue-grid">
            {REVENUE_MODEL.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="inv-revenue-card" style={{ borderTopColor: item.color }}>
                  <div className="inv-revenue-card__price" style={{ color: item.color }}>{item.price}</div>
                  <div className="inv-revenue-card__tier">{item.tier}</div>
                  <p className="inv-revenue-card__desc">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use of Funds */}
      <section className="inv-section inv-section--dark" id="inv-funds">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag inv-tag--gold">The Ask</span>
              <h2 className="inv-title font-heading" style={{ color: 'white' }}>Use of Funds</h2>
              <p className="inv-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>We're raising <strong style={{ color: '#D4AF37' }}>$250K</strong> in seed funding to take EternalVow from MVP to market launch.</p>
            </div>
          </ScrollReveal>
          <div className="inv-funds-layout">
            <ScrollReveal direction="left">
              <div className="inv-funds-chart">
                {USE_OF_FUNDS.map((item, i) => (
                  <div className="inv-funds-bar" key={i}>
                    <div className="inv-funds-bar__label">{item.category}</div>
                    <div className="inv-funds-bar__track">
                      <div
                        className="inv-funds-bar__fill"
                        style={{ width: `${item.percent}%`, background: item.color }}
                      />
                    </div>
                    <div className="inv-funds-bar__percent">{item.percent}%</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="inv-funds-milestones">
                <h3 className="font-heading" style={{ color: 'white', marginBottom: '1.5rem' }}>Key Milestones</h3>
                <div className="inv-milestone">
                  <div className="inv-milestone__num">Q1</div>
                  <div>
                    <strong>Product Launch</strong>
                    <p>Launch 5+ templates, payment integration, custom domain system</p>
                  </div>
                </div>
                <div className="inv-milestone">
                  <div className="inv-milestone__num">Q2</div>
                  <div>
                    <strong>Growth Phase</strong>
                    <p>1,000+ users, social media campaigns, influencer partnerships</p>
                  </div>
                </div>
                <div className="inv-milestone">
                  <div className="inv-milestone__num">Q3</div>
                  <div>
                    <strong>Scale & Monetize</strong>
                    <p>Premium upsells, vendor marketplace, international expansion</p>
                  </div>
                </div>
                <div className="inv-milestone">
                  <div className="inv-milestone__num">Q4</div>
                  <div>
                    <strong>Series A Ready</strong>
                    <p>10,000+ users, $50K+ MRR, proven unit economics</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="inv-section" id="inv-contact">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="inv-section__header">
              <span className="inv-tag">Connect</span>
              <h2 className="inv-title font-heading">Let's Build the Future of Weddings</h2>
              <p className="inv-subtitle">Interested in learning more? Drop us a note and we'll send you our full pitch deck.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            {submitted ? (
              <div className="inv-contact-success">
                <CheckCircle2 size={48} />
                <h3 className="font-heading">Thank You!</h3>
                <p>We've received your message. Our team will send you the full pitch deck within 24 hours.</p>
              </div>
            ) : (
              <form className="inv-contact-form" onSubmit={handleSubmit}>
                <div className="inv-contact-form__row">
                  <div className="inv-contact-form__field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="inv-contact-form__field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@venture.com"
                    />
                  </div>
                </div>
                <div className="inv-contact-form__field">
                  <label>Firm / Organization</label>
                  <input
                    type="text"
                    value={formData.firm}
                    onChange={e => setFormData({ ...formData, firm: e.target.value })}
                    placeholder="Sequoia Capital"
                  />
                </div>
                <div className="inv-contact-form__field">
                  <label>Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="I'd love to learn more about EternalVow's seed round..."
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg inv-contact-form__submit">
                  <Send size={18} />
                  Request Pitch Deck
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
