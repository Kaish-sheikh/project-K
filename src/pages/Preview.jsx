import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Wand2, Loader2, AlertCircle } from 'lucide-react';
import Serenity from '../templates/Serenity';
import Opulence from '../templates/Opulence';
import Garden from '../templates/Garden';
import DesiRoyal from '../templates/DesiRoyal';
import * as api from '../api/client';
import './Preview.css';

const TEMPLATES = {
  serenity: Serenity,
  opulence: Opulence,
  garden: Garden,
  desiroyal: DesiRoyal,
};

const COLOR_PALETTES = [
  { name: 'Classic', colors: ['#F5F0EB', '#2C3E50', '#A8B5A2', '#D4C5B9'] },
  { name: 'Rose Gold', colors: ['#FDF8F0', '#B76E79', '#E8C4C4', '#D4C5B9'] },
  { name: 'Navy', colors: ['#1A1A2E', '#D4AF37', '#F5F0EB', '#2C2C3E'] },
  { name: 'Sage', colors: ['#F5F0EB', '#6B7F5E', '#C9D4C5', '#8BA888'] },
  { name: 'Blush', colors: ['#FDF6F0', '#D4A0A0', '#F2E0D0', '#C9A0A0'] },
  { name: 'Midnight', colors: ['#0F0F1A', '#C9B896', '#1A1A2E', '#2C2C3E'] },
];

const FONT_PAIRINGS = [
  { name: 'Classic Serif', heading: 'Cormorant Garamond', body: 'Montserrat' },
  { name: 'Modern Display', heading: 'Playfair Display', body: 'Raleway' },
  { name: 'Romantic Script', heading: 'Great Vibes', body: 'Lato' },
];

function getThemeStyles(templateId, paletteIndex, fontIndex) {
  const palette = COLOR_PALETTES[paletteIndex] || COLOR_PALETTES[0];
  const font = FONT_PAIRINGS[fontIndex] || FONT_PAIRINGS[0];
  const colors = palette.colors;

  const styles = {
    '--font-heading': `'${font.heading}', 'Cormorant Garamond', serif`,
    '--font-body': `'${font.body}', 'Montserrat', sans-serif`,
  };

  const isDark = ['Navy', 'Midnight'].includes(palette.name);

  if (templateId === 'serenity') {
    styles['--ser-bg'] = colors[0];
    styles['--ser-text'] = colors[1];
    styles['--ser-accent'] = colors[2];
    styles['--ser-muted'] = isDark ? 'rgba(255,255,255,0.6)' : colors[3];
    styles['--ser-card'] = isDark ? colors[3] : '#FFFFFF';
  } else if (templateId === 'opulence') {
    styles['--op-bg'] = colors[0];
    styles['--op-bg-alt'] = isDark ? colors[3] : '#16162B';
    styles['--op-gold'] = colors[2];
    styles['--op-gold-light'] = isDark ? '#FFF2CC' : colors[2];
    styles['--op-gold-dark'] = isDark ? '#A67C00' : colors[2];
    styles['--op-text'] = colors[1];
    styles['--op-muted'] = isDark ? 'rgba(255,255,255,0.6)' : colors[3];
  } else if (templateId === 'garden') {
    styles['--gd-bg'] = colors[0];
    styles['--gd-blush'] = isDark ? colors[3] : colors[3];
    styles['--gd-pink'] = colors[2];
    styles['--gd-sage'] = colors[2];
    styles['--gd-sage-dark'] = colors[1];
    styles['--gd-text'] = colors[1];
    styles['--gd-muted'] = isDark ? 'rgba(255,255,255,0.6)' : colors[3];
    styles['--gd-card'] = isDark ? colors[3] : '#FFFFFF';
  } else if (templateId === 'desiroyal') {
    styles['--dr-bg'] = colors[0];
    styles['--dr-red'] = colors[1];
    styles['--dr-gold'] = colors[2];
    styles['--dr-maroon'] = colors[3];
    styles['--dr-bg-cream'] = colors[4] || '#FDF5E6';
    styles['--dr-text'] = colors[4] || '#FDF5E6';
    styles['--dr-text-dark'] = '#2C1810';
    styles['--dr-muted'] = 'rgba(253, 245, 230, 0.6)';
  }

  return styles;
}

export default function Preview() {
  const { templateId } = useParams();
  const [searchParams] = useSearchParams();
  const queryWeddingId = searchParams.get('weddingId');

  const [loading, setLoading] = useState(!!queryWeddingId);
  const [error, setError] = useState(null);
  const [customWedding, setCustomWedding] = useState(null);

  useEffect(() => {
    if (!queryWeddingId) return;

    setLoading(true);
    setError(null);
    api.getPublicWedding(queryWeddingId)
      .then(data => {
        setCustomWedding(data);
      })
      .catch(err => {
        console.error('Failed to load public wedding:', err);
        setError(err.message || 'Failed to load wedding details.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryWeddingId]);

  if (queryWeddingId) {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', color: 'var(--color-rose-gold)', background: 'var(--color-cream)' }}>
          <Loader2 size={32} style={{ animation: 'authSpin 0.7s linear infinite' }} />
          <span style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>Entering Wedding Venue...</span>
        </div>
      );
    }

    if (error || !customWedding) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', color: 'var(--color-error)', background: 'var(--color-cream)', padding: '2rem', textAlign: 'center' }}>
          <AlertCircle size={40} />
          <h2 className="font-heading" style={{ fontSize: '1.75rem' }}>Wedding Invitation Not Found</h2>
          <p style={{ maxWidth: '400px', color: 'var(--text-secondary)' }}>The wedding page link you used might be incorrect, expired, or deactivated.</p>
          <Link to="/" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>Back to EternalVow</Link>
        </div>
      );
    }

    const templateName = customWedding.template || 'serenity';
    const TemplateComponent = TEMPLATES[templateName] || Serenity;
    const themeStyles = getThemeStyles(templateName, customWedding.colorPalette, customWedding.fontPairing);

    // Merge avatars into coupleData so templates can render CoupleAvatars
    const coupleWithAvatars = {
      ...customWedding.coupleData,
      avatars: customWedding.avatars || customWedding.coupleData?.avatars || null,
    };

    return (
      <div style={themeStyles}>
        <TemplateComponent 
          customData={{ couple: coupleWithAvatars, wedding: customWedding.weddingDetails }} 
          weddingId={customWedding.id} 
        />
      </div>
    );
  }

  // Default behavior (previewing sample template data from templates view)
  const id = templateId || 'serenity';
  const TemplateComponent = TEMPLATES[id] || Serenity;

  return (
    <div className="preview-page" id="preview-page">
      <div className="preview-bar">
        <Link to="/templates" className="preview-bar__back" id="preview-back">
          <ArrowLeft size={18} />
          <span>Back to Templates</span>
        </Link>
        <div className="preview-bar__info">
          <span className="preview-bar__label">Previewing:</span>
          <span className="preview-bar__name font-heading">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
        </div>
        <div className="preview-bar__actions">
          <Link to={`/customizer/${id}`} className="btn btn-primary btn-sm" id="preview-customize">
            <Wand2 size={14} /> Customize This
          </Link>
        </div>
      </div>
      <div className="preview-content">
        <TemplateComponent />
      </div>
    </div>
  );
}

