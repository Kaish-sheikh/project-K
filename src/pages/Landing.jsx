import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette, Smartphone, Mail, Camera, Clock, MapPin,
  Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles,
  Heart, Shield, Zap, Check
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import CountdownTimer from '../components/CountdownTimer';
import { templateThemes, testimonials } from '../data/sampleData';
import './Landing.css';

const FEATURES = [
  { icon: Palette, title: 'Premium Templates', desc: 'Curated, designer-crafted themes that make your wedding website feel like a luxury experience.' },
  { icon: Smartphone, title: 'Mobile-First Design', desc: 'Every template is perfectly responsive. Your guests will love browsing on any device.' },
  { icon: Mail, title: 'Smart RSVP', desc: 'Multi-step RSVP forms with meal selection, dietary needs, and guest management dashboard.' },
  { icon: Camera, title: 'Photo Galleries', desc: 'Stunning masonry layouts with lightbox viewing. Share your journey beautifully.' },
  { icon: Clock, title: 'Countdown Timer', desc: 'Elegant, animated countdown to your big day that builds anticipation for guests.' },
  { icon: MapPin, title: 'Event Details', desc: 'Beautiful event timelines with venue info, maps, and dress code — everything guests need.' },
];

const STEPS = [
  { num: '01', title: 'Choose Your Template', desc: 'Browse our curated collection of premium templates designed for modern couples.' },
  { num: '02', title: 'Customize Everything', desc: 'Make it yours with our live customizer. Change colors, fonts, photos, and content in real-time.' },
  { num: '03', title: 'Share & Celebrate', desc: 'Publish your site, manage RSVPs, and focus on what matters — your love story.' },
];

const PRICING = [
  { name: 'Free', price: '$0', period: 'forever', features: ['1 Template', 'Basic RSVP', 'Photo Gallery', 'Mobile Responsive'], cta: 'Start Free', popular: false },
  { name: 'Premium', price: '$29', period: 'one-time', features: ['All Templates', 'Advanced RSVP & Dashboard', 'Unlimited Photos', 'Custom Domain', 'Password Protection', 'Priority Support'], cta: 'Go Premium', popular: true },
  { name: 'Luxe', price: '$79', period: 'one-time', features: ['Everything in Premium', 'Custom Design Consultation', 'Video Backgrounds', 'Guest Book', 'Save-the-Date Page', 'Concierge Setup'], cta: 'Choose Luxe', popular: false },
];

export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      <Navbar transparent />

      {/* === HERO === */}
      <section className="hero" id="hero">
        <div className="hero__bg">
          <div className="hero__gradient" />
          <div className="hero__particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="hero__particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                  opacity: 0.2 + Math.random() * 0.3,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero__content container">
          <div className="hero__badge">
            <Sparkles size={14} />
            <span>Premium Wedding Websites</span>
          </div>
          <h1 className="hero__title font-heading">
            Your Love Story,<br />
            <span className="hero__title-accent font-script">Beautifully Told</span>
          </h1>
          <p className="hero__subtitle">
            Create a stunning wedding website in minutes. Premium templates, smart RSVP management, and unforgettable design — all in one place.
          </p>
          <div className="hero__actions">
            <Link to="/register" className="btn btn-primary btn-lg" id="hero-cta-primary">
              Start Building <ArrowRight size={18} />
            </Link>
            <Link to="/templates" className="btn btn-secondary btn-lg hero__btn-secondary" id="hero-cta-secondary">
              View Templates
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">2,500+</span>
              <span className="hero__stat-label">Couples Served</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">4.9★</span>
              <span className="hero__stat-label">Average Rating</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-value">50K+</span>
              <span className="hero__stat-label">RSVPs Collected</span>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="features section" id="features">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Features</span>
              <h2 className="section-title font-heading">Everything You Need for the Perfect Day</h2>
              <p className="section-subtitle">From stunning design to seamless planning tools — we've thought of everything.</p>
            </div>
          </ScrollReveal>

          <div className="features__grid">
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="feature-card" id={`feature-${i}`}>
                  <div className="feature-card__icon">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__desc">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === TEMPLATE SHOWCASE === */}
      <section className="showcase section" id="templates-showcase">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Templates</span>
              <h2 className="section-title font-heading">Designs That Take Your Breath Away</h2>
              <p className="section-subtitle">Each template is crafted by professional designers to create a lasting impression.</p>
            </div>
          </ScrollReveal>

          <div className="showcase__grid">
            {templateThemes.map((template, i) => (
              <ScrollReveal key={template.id} delay={i * 200} direction="scale">
                <Link to={`/preview/${template.id}`} className="template-preview" id={`template-${template.id}`}>
                  <div className="template-preview__image" style={{
                    background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]}, ${template.colors[3]})`,
                  }}>
                    <div className="template-preview__badge">{template.category}</div>
                    <div className="template-preview__hover">
                      <span className="btn btn-white btn-sm">Preview Theme</span>
                    </div>
                    {/* Mock template content */}
                    <div className="template-preview__mock">
                      <div className="mock__nav" style={{ background: `${template.colors[0]}CC` }}>
                        <div className="mock__dots">
                          {template.colors.slice(0, 3).map((c, j) => (
                            <div key={j} className="mock__dot" style={{ background: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="mock__hero" style={{ background: `linear-gradient(180deg, ${template.colors[1]}40, ${template.colors[3]}60)` }}>
                        <span className="mock__title font-script" style={{ color: template.colors[1] }}>S & J</span>
                        <span className="mock__subtitle" style={{ color: template.colors[1] }}>October 17, 2026</span>
                      </div>
                      <div className="mock__sections">
                        <div className="mock__block" style={{ background: `${template.colors[0]}80` }} />
                        <div className="mock__block mock__block--sm" style={{ background: `${template.colors[3]}60` }} />
                      </div>
                    </div>
                  </div>
                  <div className="template-preview__info">
                    <div>
                      <h3 className="template-preview__name font-heading">{template.name}</h3>
                      <p className="template-preview__tagline">{template.tagline}</p>
                    </div>
                    <div className="template-preview__colors">
                      {template.colors.map((color, j) => (
                        <div key={j} className="template-preview__color" style={{ background: color }} />
                      ))}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="showcase__cta">
              <Link to="/templates" className="btn btn-secondary btn-lg" id="showcase-view-all">
                View All Templates <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="how-it-works section" id="how-it-works">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Simple Process</span>
              <h2 className="section-title font-heading">Three Steps to Your Dream Website</h2>
            </div>
          </ScrollReveal>

          <div className="steps">
            {STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 200}>
                <div className="step" id={`step-${i}`}>
                  <div className="step__number font-heading">{step.num}</div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__desc">{step.desc}</p>
                  {i < STEPS.length - 1 && <div className="step__connector" />}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="testimonials section" id="testimonials">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Loved By Couples</span>
              <h2 className="section-title font-heading">Real Stories, Real Love</h2>
            </div>
          </ScrollReveal>

          <div className="testimonials__slider">
            <button
              className="testimonials__nav testimonials__nav--prev"
              onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
              id="testimonial-prev"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="testimonials__track">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-card ${i === currentTestimonial ? 'testimonial-card--active' : ''}`}
                >
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="testimonial-card__quote">"{t.quote}"</blockquote>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">
                      <Heart size={16} />
                    </div>
                    <div>
                      <p className="testimonial-card__name font-heading">{t.couple}</p>
                      <p className="testimonial-card__location">{t.location} · {t.template} Theme</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="testimonials__nav testimonials__nav--next"
              onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
              aria-label="Next testimonial"
              id="testimonial-next"
            >
              <ChevronRight size={20} />
            </button>

            <div className="testimonials__dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials__dot ${i === currentTestimonial ? 'testimonials__dot--active' : ''}`}
                  onClick={() => setCurrentTestimonial(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === PRICING === */}
      <section className="pricing section" id="pricing">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Pricing</span>
              <h2 className="section-title font-heading">Simple, Transparent Pricing</h2>
              <p className="section-subtitle">No monthly fees. No hidden costs. Just beautiful wedding websites.</p>
            </div>
          </ScrollReveal>

          <div className="pricing__grid">
            {PRICING.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`} id={`pricing-${plan.name.toLowerCase()}`}>
                  {plan.popular && <div className="pricing-card__badge">Most Popular</div>}
                  <h3 className="pricing-card__name font-heading">{plan.name}</h3>
                  <div className="pricing-card__price">
                    <span className="pricing-card__amount">{plan.price}</span>
                    <span className="pricing-card__period">/{plan.period}</span>
                  </div>
                  <ul className="pricing-card__features">
                    {plan.features.map((f, j) => (
                      <li key={j} className="pricing-card__feature">
                        <Check size={16} className="pricing-card__check" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/customizer"
                    className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} pricing-card__cta`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="final-cta" id="final-cta">
        <div className="container">
          <ScrollReveal>
            <div className="final-cta__content">
              <h2 className="final-cta__title font-heading">Ready to Tell Your Story?</h2>
              <p className="final-cta__text">Join thousands of couples who chose EternalVow for their most special day.</p>
              <div className="final-cta__actions">
                <Link to="/register" className="btn btn-primary btn-lg" id="final-cta-btn">
                  Start Building — It's Free <ArrowRight size={18} />
                </Link>
              </div>
              <div className="final-cta__trust">
                <Shield size={14} />
                <span>No credit card required · Free forever plan available</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
