import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Loader2, CheckCircle2, Shuffle,
  Sparkles, Crown, Flower2, Eye, EyeOff
} from 'lucide-react';
import AvatarFigure from '../components/AvatarFigure';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/client';
import './AvatarStudio.css';

// =========================================
// Palette & Option Constants
// =========================================

const SKIN_TONES = [
  { name: 'Fair', hex: '#FDDCB5' },
  { name: 'Light', hex: '#F5C7A1' },
  { name: 'Peach', hex: '#E8B48A' },
  { name: 'Warm', hex: '#D4A574' },
  { name: 'Tan', hex: '#C19A6B' },
  { name: 'Bronze', hex: '#A67C52' },
  { name: 'Brown', hex: '#8B6340' },
  { name: 'Deep', hex: '#5C3D2E' },
];

const HAIR_COLORS = [
  { name: 'Black', hex: '#1C1008' },
  { name: 'Dark Brown', hex: '#3B2314' },
  { name: 'Brown', hex: '#6B4423' },
  { name: 'Auburn', hex: '#8B4513' },
  { name: 'Red', hex: '#A0522D' },
  { name: 'Blonde', hex: '#C8A951' },
  { name: 'Platinum', hex: '#E8D5B7' },
  { name: 'Gray', hex: '#9E9E9E' },
];

const HAIR_STYLES = [
  { id: 'short', label: 'Short', icon: '✂️' },
  { id: 'straight', label: 'Straight', icon: '📏' },
  { id: 'wavy', label: 'Wavy', icon: '🌊' },
  { id: 'curly', label: 'Curly', icon: '🔄' },
  { id: 'bun', label: 'Bun', icon: '🔵' },
  { id: 'braided', label: 'Braided', icon: '🎀' },
];

const HEIGHTS = [
  { id: 'petite', label: 'Petite' },
  { id: 'average', label: 'Average' },
  { id: 'tall', label: 'Tall' },
];

// ---- Outfit Styles ----
const BRIDE_OUTFIT_STYLES = [
  { id: 'western', label: 'Gown', icon: '👗' },
  { id: 'lehenga', label: 'Lehenga', icon: '🪷' },
  { id: 'saree', label: 'Saree', icon: '🧣' },
];

const GROOM_OUTFIT_STYLES = [
  { id: 'western', label: 'Suit', icon: '🤵' },
  { id: 'sherwani', label: 'Sherwani', icon: '🪷' },
  { id: 'kurta', label: 'Kurta', icon: '👘' },
];

// ---- Accessories by outfit type ----
const BRIDE_ACCESSORIES_WESTERN = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'veil', label: 'Veil', icon: '👰' },
  { id: 'tiara', label: 'Tiara', icon: '👑' },
  { id: 'bouquet', label: 'Bouquet', icon: '💐' },
];

const BRIDE_ACCESSORIES_INDIAN = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'maangtikka', label: 'Maangtikka', icon: '💎' },
  { id: 'dupatta', label: 'Dupatta', icon: '🧣' },
  { id: 'jhumka', label: 'Jhumka', icon: '✨' },
];

const GROOM_ACCESSORIES_WESTERN = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'bowtie', label: 'Bow Tie', icon: '🎀' },
  { id: 'boutonniere', label: 'Flower Pin', icon: '🌸' },
];

const GROOM_ACCESSORIES_INDIAN = [
  { id: 'none', label: 'None', icon: '—' },
  { id: 'pagdi', label: 'Pagdi', icon: '👳' },
  { id: 'dupattaGroom', label: 'Stole', icon: '🧣' },
  { id: 'kalgi', label: 'Kalgi', icon: '🪶' },
];

// ---- Outfit Color Presets ----
const OUTFIT_PRESETS_WESTERN = {
  bride: [
    { name: 'Classic White', hex: '#FFFFFF' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Champagne', hex: '#F7E7CE' },
    { name: 'Blush', hex: '#F2D0D0' },
    { name: 'Rose Gold', hex: '#E8B4B4' },
    { name: 'Lavender', hex: '#D8C8E8' },
    { name: 'Sage', hex: '#C9D4C5' },
    { name: 'Red', hex: '#C04040' },
  ],
  groom: [
    { name: 'Classic Black', hex: '#1A1A2E' },
    { name: 'Midnight Navy', hex: '#1B2A4A' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Slate Gray', hex: '#708090' },
    { name: 'Burgundy', hex: '#722F37' },
    { name: 'Forest', hex: '#2D4A2D' },
    { name: 'Tan', hex: '#C9A96E' },
    { name: 'White', hex: '#F5F0EB' },
  ],
};

const OUTFIT_PRESETS_INDIAN = {
  bride: [
    { name: 'Bridal Red', hex: '#C41E3A' },
    { name: 'Maroon', hex: '#800020' },
    { name: 'Hot Pink', hex: '#D4367A' },
    { name: 'Gold', hex: '#D4AF37' },
    { name: 'Royal Blue', hex: '#2B4C8C' },
    { name: 'Emerald', hex: '#2D6A4F' },
    { name: 'Deep Purple', hex: '#5B2C6F' },
    { name: 'Peach', hex: '#F0A080' },
  ],
  groom: [
    { name: 'Ivory Gold', hex: '#F5E6C8' },
    { name: 'Maroon', hex: '#800020' },
    { name: 'Royal Blue', hex: '#2B4C8C' },
    { name: 'Emerald', hex: '#2D6A4F' },
    { name: 'Champagne', hex: '#E8D5B7' },
    { name: 'Coral', hex: '#D4675A' },
    { name: 'Navy Gold', hex: '#1B2A4A' },
    { name: 'White', hex: '#FAFAF5' },
  ],
};

const DEFAULT_AVATARS = {
  bride: {
    skinTone: '#D4A574',
    hairStyle: 'wavy',
    hairColor: '#3B2314',
    outfitColor: '#FFFFFF',
    outfitStyle: 'western',
    height: 'average',
    accessory: 'veil',
  },
  groom: {
    skinTone: '#C19A6B',
    hairStyle: 'short',
    hairColor: '#1C1008',
    outfitColor: '#1A1A2E',
    outfitStyle: 'western',
    height: 'tall',
    accessory: 'bowtie',
  },
  showOnWebsite: true,
};

// =========================================
// Helper to get current options dynamically
// =========================================

function getAccessories(gender, outfitStyle) {
  const isIndian = ['lehenga', 'saree', 'sherwani', 'kurta'].includes(outfitStyle);
  if (gender === 'bride') return isIndian ? BRIDE_ACCESSORIES_INDIAN : BRIDE_ACCESSORIES_WESTERN;
  return isIndian ? GROOM_ACCESSORIES_INDIAN : GROOM_ACCESSORIES_WESTERN;
}

function getOutfitPresets(gender, outfitStyle) {
  const isIndian = ['lehenga', 'saree', 'sherwani', 'kurta'].includes(outfitStyle);
  const presets = isIndian ? OUTFIT_PRESETS_INDIAN : OUTFIT_PRESETS_WESTERN;
  return presets[gender];
}

function getOutfitLabel(gender, outfitStyle) {
  const labels = {
    western: gender === 'bride' ? 'Dress Color' : 'Suit Color',
    lehenga: 'Lehenga Color',
    saree: 'Saree Color',
    sherwani: 'Sherwani Color',
    kurta: 'Kurta Color',
  };
  return labels[outfitStyle] || 'Outfit Color';
}

// =========================================
// AvatarStudio Component
// =========================================

export default function AvatarStudio({ embedded = false }) {
  const { weddingId } = useAuth();
  const [activeTab, setActiveTab] = useState('bride');
  const [avatars, setAvatars] = useState(DEFAULT_AVATARS);
  const [animated, setAnimated] = useState(true);
  const [saveState, setSaveState] = useState('idle');
  const [loading, setLoading] = useState(true);

  // Load saved avatar data
  useEffect(() => {
    if (!weddingId) {
      setLoading(false);
      return;
    }

    api.getMyWedding()
      .then(data => {
        if (data.avatars) {
          setAvatars({
            bride: { ...DEFAULT_AVATARS.bride, ...(data.avatars.bride || {}) },
            groom: { ...DEFAULT_AVATARS.groom, ...(data.avatars.groom || {}) },
            showOnWebsite: data.avatars.showOnWebsite !== false,
          });
        }
      })
      .catch(err => console.warn('Could not load avatar data:', err.message))
      .finally(() => setLoading(false));
  }, [weddingId]);

  const current = avatars[activeTab];

  const updateField = (field, value) => {
    setAvatars(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  // When outfit style changes, auto-switch accessory to a compatible one
  const handleOutfitStyleChange = (newStyle) => {
    const isNewIndian = ['lehenga', 'saree', 'sherwani', 'kurta'].includes(newStyle);
    const isOldIndian = ['lehenga', 'saree', 'sherwani', 'kurta'].includes(current.outfitStyle);

    setAvatars(prev => {
      const updated = { ...prev[activeTab], outfitStyle: newStyle };

      // If switching between western ↔ indian, reset accessory & pick a contextual color
      if (isNewIndian !== isOldIndian) {
        if (isNewIndian) {
          updated.accessory = activeTab === 'bride' ? 'maangtikka' : 'pagdi';
          updated.outfitColor = activeTab === 'bride' ? '#C41E3A' : '#F5E6C8';
        } else {
          updated.accessory = activeTab === 'bride' ? 'veil' : 'bowtie';
          updated.outfitColor = activeTab === 'bride' ? '#FFFFFF' : '#1A1A2E';
        }
      }

      return { ...prev, [activeTab]: updated };
    });
  };

  const randomize = () => {
    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const gender = activeTab;
    const outfitStyles = gender === 'bride' ? BRIDE_OUTFIT_STYLES : GROOM_OUTFIT_STYLES;
    const chosenStyle = randomPick(outfitStyles).id;
    const presets = getOutfitPresets(gender, chosenStyle);
    const accessories = getAccessories(gender, chosenStyle);

    setAvatars(prev => ({
      ...prev,
      [gender]: {
        skinTone: randomPick(SKIN_TONES).hex,
        hairStyle: randomPick(HAIR_STYLES).id,
        hairColor: randomPick(HAIR_COLORS).hex,
        outfitColor: randomPick(presets).hex,
        outfitStyle: chosenStyle,
        height: randomPick(HEIGHTS).id,
        accessory: randomPick(accessories).id,
      },
    }));
  };

  const handleSave = async () => {
    if (!weddingId) return;
    setSaveState('saving');
    try {
      const currentData = await api.getMyWedding();
      await api.saveWedding(weddingId, {
        ...currentData,
        avatars,
      });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      console.error('Failed to save avatars:', err);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className={embedded ? "avatar-studio--embedded" : "avatar-studio"} id="avatar-studio-page">
        {!embedded && <Navbar />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem', color: 'var(--color-muted)' }}>
          <Loader2 size={20} style={{ animation: 'authSpin 0.7s linear infinite' }} />
          <span>Loading Avatar Studio...</span>
        </div>
      </div>
    );
  }

  const currentAccessories = getAccessories(activeTab, current.outfitStyle);
  const currentPresets = getOutfitPresets(activeTab, current.outfitStyle);
  const currentOutfitStyles = activeTab === 'bride' ? BRIDE_OUTFIT_STYLES : GROOM_OUTFIT_STYLES;

  return (
    <div className={embedded ? "avatar-studio--embedded" : "avatar-studio"} id="avatar-studio-page" style={embedded ? { height: '100%' } : {}}>
      {!embedded && <Navbar />}

      <div className="avatar-studio__layout" style={embedded ? { height: 'calc(100vh - 120px)', border: '1px solid var(--color-border)', borderRadius: '12px' } : {}}>
        <aside className="avatar-studio__controls" style={embedded ? { borderLeft: 'none' } : {}}>
          <div className="avatar-studio__controls-header">
            {!embedded && (
              <Link to="/dashboard" className="avatar-studio__back">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            )}
            <h2 className="avatar-studio__title font-heading">
              <Sparkles size={20} /> Avatar Studio
            </h2>
            <p className="avatar-studio__subtitle">Create your cartoon wedding figures</p>
          </div>

          {/* Tab Switcher */}
          <div className="avatar-studio__tabs">
            <button
              className={`avatar-studio__tab ${activeTab === 'bride' ? 'avatar-studio__tab--active' : ''}`}
              onClick={() => setActiveTab('bride')}
              id="avatar-tab-bride"
            >
              <Crown size={16} /> Bride
            </button>
            <button
              className={`avatar-studio__tab ${activeTab === 'groom' ? 'avatar-studio__tab--active' : ''}`}
              onClick={() => setActiveTab('groom')}
              id="avatar-tab-groom"
            >
              <Flower2 size={16} /> Groom
            </button>
          </div>

          <div className="avatar-studio__options">
            {/* Skin Tone */}
            <div className="avatar-option">
              <label className="avatar-option__label">Skin Tone</label>
              <div className="avatar-option__swatches">
                {SKIN_TONES.map(tone => (
                  <button
                    key={tone.hex}
                    className={`avatar-swatch avatar-swatch--round ${current.skinTone === tone.hex ? 'avatar-swatch--active' : ''}`}
                    style={{ background: tone.hex }}
                    onClick={() => updateField('skinTone', tone.hex)}
                    title={tone.name}
                  />
                ))}
              </div>
            </div>

            {/* Outfit Style (NEW) */}
            <div className="avatar-option">
              <label className="avatar-option__label">Outfit Style</label>
              <div className="avatar-option__grid">
                {currentOutfitStyles.map(style => (
                  <button
                    key={style.id}
                    className={`avatar-style-btn ${current.outfitStyle === style.id ? 'avatar-style-btn--active' : ''}`}
                    onClick={() => handleOutfitStyleChange(style.id)}
                  >
                    <span className="avatar-style-btn__icon">{style.icon}</span>
                    <span className="avatar-style-btn__label">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Style */}
            <div className="avatar-option">
              <label className="avatar-option__label">Hair Style</label>
              <div className="avatar-option__grid">
                {HAIR_STYLES.map(style => (
                  <button
                    key={style.id}
                    className={`avatar-style-btn ${current.hairStyle === style.id ? 'avatar-style-btn--active' : ''}`}
                    onClick={() => updateField('hairStyle', style.id)}
                  >
                    <span className="avatar-style-btn__icon">{style.icon}</span>
                    <span className="avatar-style-btn__label">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Color */}
            <div className="avatar-option">
              <label className="avatar-option__label">Hair Color</label>
              <div className="avatar-option__swatches">
                {HAIR_COLORS.map(color => (
                  <button
                    key={color.hex}
                    className={`avatar-swatch avatar-swatch--round ${current.hairColor === color.hex ? 'avatar-swatch--active' : ''}`}
                    style={{ background: color.hex }}
                    onClick={() => updateField('hairColor', color.hex)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="avatar-option">
              <label className="avatar-option__label">Height</label>
              <div className="avatar-option__radio-group">
                {HEIGHTS.map(h => (
                  <button
                    key={h.id}
                    className={`avatar-radio ${current.height === h.id ? 'avatar-radio--active' : ''}`}
                    onClick={() => updateField('height', h.id)}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit Color — contextual label */}
            <div className="avatar-option">
              <label className="avatar-option__label">{getOutfitLabel(activeTab, current.outfitStyle)}</label>
              <div className="avatar-option__swatches">
                {currentPresets.map(preset => (
                  <button
                    key={preset.hex}
                    className={`avatar-swatch avatar-swatch--square ${current.outfitColor === preset.hex ? 'avatar-swatch--active' : ''}`}
                    style={{ background: preset.hex }}
                    onClick={() => updateField('outfitColor', preset.hex)}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Accessory — dynamically switches between western/indian */}
            <div className="avatar-option">
              <label className="avatar-option__label">Accessory</label>
              <div className="avatar-option__grid">
                {currentAccessories.map(acc => (
                  <button
                    key={acc.id}
                    className={`avatar-style-btn ${current.accessory === acc.id ? 'avatar-style-btn--active' : ''}`}
                    onClick={() => updateField('accessory', acc.id)}
                  >
                    <span className="avatar-style-btn__icon">{acc.icon}</span>
                    <span className="avatar-style-btn__label">{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Show on Website Toggle */}
            <div className="avatar-option avatar-option--toggle">
              <label className="avatar-option__label">Show on Wedding Website</label>
              <button
                className={`avatar-toggle ${avatars.showOnWebsite ? 'avatar-toggle--on' : ''}`}
                onClick={() => setAvatars(prev => ({ ...prev, showOnWebsite: !prev.showOnWebsite }))}
                id="avatar-toggle-show"
              >
                {avatars.showOnWebsite ? <Eye size={14} /> : <EyeOff size={14} />}
                <span>{avatars.showOnWebsite ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="avatar-studio__actions">
            <button className="btn btn-secondary avatar-studio__randomize" onClick={randomize} id="avatar-randomize">
              <Shuffle size={16} /> Randomize
            </button>
            <button
              className={`btn btn-primary avatar-studio__save ${saveState === 'saved' ? 'avatar-studio__save--saved' : ''}`}
              onClick={handleSave}
              disabled={saveState === 'saving'}
              id="avatar-save"
            >
              {saveState === 'saving' ? (
                <><Loader2 size={16} style={{ animation: 'authSpin 0.7s linear infinite' }} /> Saving...</>
              ) : saveState === 'saved' ? (
                <><CheckCircle2 size={16} /> Saved!</>
              ) : saveState === 'error' ? (
                <><Save size={16} /> Failed — Retry</>
              ) : (
                <><Save size={16} /> Save Avatars</>
              )}
            </button>
          </div>
        </aside>

        {/* Live Preview */}
        <main className="avatar-studio__preview">
          <div className="avatar-studio__preview-header">
            <h3 className="font-heading">Live Preview</h3>
            <button
              className="avatar-studio__anim-toggle"
              onClick={() => setAnimated(!animated)}
              title={animated ? 'Pause animations' : 'Play animations'}
            >
              {animated ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>

          <div className="avatar-studio__preview-stage">
            <div className="avatar-studio__stage-bg" aria-hidden="true">
              <div className="avatar-studio__stage-arch" />
            </div>

            <div className="avatar-studio__preview-figures">
              <div className="avatar-studio__preview-person">
                <AvatarFigure
                  gender="bride"
                  {...avatars.bride}
                  animated={animated}
                  className="avatar-studio__figure"
                />
                <span className="avatar-studio__preview-label font-heading">Bride</span>
              </div>

              <div className="avatar-studio__preview-hearts" aria-hidden="true">
                <span className="preview-heart preview-heart--1">♥</span>
                <span className="preview-heart preview-heart--2">♥</span>
                <span className="preview-heart preview-heart--3">♥</span>
              </div>

              <div className="avatar-studio__preview-person">
                <AvatarFigure
                  gender="groom"
                  {...avatars.groom}
                  animated={animated}
                  className="avatar-studio__figure"
                />
                <span className="avatar-studio__preview-label font-heading">Groom</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
