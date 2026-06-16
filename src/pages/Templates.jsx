import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Wand2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { templateThemes } from '../data/sampleData';
import './Templates.css';

const FILTERS = ['All', 'Modern', 'Luxury', 'Romantic', 'Cultural'];

export default function Templates() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? templateThemes
    : templateThemes.filter(t => t.category === activeFilter);

  return (
    <div className="templates-page">
      <Navbar />

      <section className="templates-hero" id="templates-hero">
        <div className="container">
          <ScrollReveal>
            <span className="section-tag">Our Collection</span>
            <h1 className="templates-hero__title font-heading">Premium Templates</h1>
            <p className="templates-hero__subtitle">
              Each template is handcrafted by professional designers. Choose your style, customize every detail, and create something unforgettable.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="templates-gallery section-sm" id="templates-gallery">
        <div className="container">
          <div className="templates-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`templates-filter ${activeFilter === f ? 'templates-filter--active' : ''}`}
                onClick={() => setActiveFilter(f)}
                id={`filter-${f.toLowerCase()}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="templates-grid">
            {filtered.map((template, i) => (
              <ScrollReveal key={template.id} delay={i * 150} direction="scale">
                <div className="template-card" id={`template-card-${template.id}`}>
                  <div
                    className="template-card__preview"
                    style={{ background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]}, ${template.colors[3]})` }}
                  >
                    {template.popular && <div className="template-card__popular">Popular</div>}
                    <div className="template-card__mock">
                      <div className="tc-mock__header" style={{ background: `${template.colors[0]}DD` }}>
                        <div className="tc-mock__dots">
                          {template.colors.slice(0, 3).map((c, j) => (
                            <span key={j} style={{ background: c }} />
                          ))}
                        </div>
                      </div>
                      <div className="tc-mock__body" style={{ background: `linear-gradient(180deg, ${template.colors[1]}30, ${template.colors[3]}50)` }}>
                        <span className="tc-mock__title font-script" style={{ color: template.colors[1] }}>S & J</span>
                        <span className="tc-mock__date" style={{ color: template.colors[1], opacity: 0.7 }}>October 17, 2026</span>
                        <div className="tc-mock__divider" style={{ background: `${template.colors[1]}40` }} />
                        <div className="tc-mock__blocks">
                          <div style={{ background: `${template.colors[0]}60` }} />
                          <div style={{ background: `${template.colors[3]}50`, width: '70%' }} />
                          <div style={{ background: `${template.colors[0]}40`, width: '85%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="template-card__overlay">
                      <Link to={`/preview/${template.id}`} className="btn btn-white btn-sm">
                        <Eye size={14} /> Preview
                      </Link>
                      <Link to={`/customizer/${template.id}`} className="btn btn-primary btn-sm">
                        <Wand2 size={14} /> Customize
                      </Link>
                    </div>
                  </div>

                  <div className="template-card__info">
                    <div className="template-card__top">
                      <div>
                        <h3 className="template-card__name font-heading">{template.name}</h3>
                        <p className="template-card__tagline">{template.tagline}</p>
                      </div>
                      <div className="template-card__colors">
                        {template.colors.map((c, j) => (
                          <span key={j} className="template-card__color" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                    <p className="template-card__desc">{template.description}</p>
                    <div className="template-card__features">
                      {template.features.map((f, j) => (
                        <span key={j} className="template-card__feature-tag">{f}</span>
                      ))}
                    </div>
                    <div className="template-card__fonts">
                      <span className="template-card__font-label">Fonts:</span>
                      {template.fonts.map((f, j) => (
                        <span key={j} className="template-card__font">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="templates-empty">
              <p>No templates match this filter. Try another category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="templates-cta section" id="templates-cta">
        <div className="container">
          <ScrollReveal>
            <div className="templates-cta__content">
              <h2 className="templates-cta__title font-heading">Can't Decide? Try Them All!</h2>
              <p className="templates-cta__text">Jump into our customizer and switch between templates instantly. Your content carries over seamlessly.</p>
              <Link to="/customizer" className="btn btn-primary btn-lg" id="templates-start-building">
                Start Customizing <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
