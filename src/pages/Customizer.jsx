import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Palette, Type, Users, Calendar, MapPin, Eye, EyeOff, Save,
  ChevronDown, ChevronUp, Layout, Image, RotateCcw, Loader2, CheckCircle2, Download, UploadCloud, X
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import Serenity from '../templates/Serenity';
import Opulence from '../templates/Opulence';
import Garden from '../templates/Garden';
import { coupleData as defaultCoupleData, weddingDetails as defaultWeddingDetails } from '../data/sampleData';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/client';
import Navbar from '../components/Navbar';
import './Customizer.css';

const TEMPLATES = {
  serenity: { component: Serenity, name: 'Serenity', label: 'Minimalist Modern' },
  opulence: { component: Opulence, name: 'Opulence', label: 'Luxury Gold & Dark' },
  garden: { component: Garden, name: 'Garden', label: 'Romantic Botanical' },
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

export default function Customizer() {
  const { templateId } = useParams();
  const { weddingId } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState(templateId || 'serenity');
  const [showPreview, setShowPreview] = useState(true);
  const [expandedSection, setExpandedSection] = useState('template');
  const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [loadingData, setLoadingData] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isExtractingPhotos, setIsExtractingPhotos] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Customization state
  const [customData, setCustomData] = useState({
    couple: { ...defaultCoupleData },
    wedding: { ...defaultWeddingDetails },
  });
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [selectedFont, setSelectedFont] = useState(0);

  // Load saved wedding data from API on mount
  useEffect(() => {
    if (!weddingId) {
      setLoadingData(false);
      return;
    }

    api.getMyWedding()
      .then(data => {
        // Merge saved data with defaults (in case saved data is partial)
        const couple = data.coupleData && data.coupleData.partner1?.firstName !== undefined
          ? data.coupleData
          : defaultCoupleData;
        const wedding = data.weddingDetails && data.weddingDetails.date !== undefined
          ? data.weddingDetails
          : defaultWeddingDetails;

        setCustomData({ couple, wedding });
        setActiveTemplate(data.template || templateId || 'serenity');
        setSelectedPalette(data.colorPalette || 0);
        setSelectedFont(data.fontPairing || 0);
      })
      .catch(err => {
        console.warn('Could not load wedding data, using defaults:', err.message);
      })
      .finally(() => setLoadingData(false));
  }, [weddingId]);

  const TemplateComponent = TEMPLATES[activeTemplate]?.component || Serenity;

  const updateCouple = (partner, field, value) => {
    setCustomData(prev => ({
      ...prev,
      couple: {
        ...prev.couple,
        [partner]: { ...prev.couple[partner], [field]: value },
      },
    }));
  };

  const updateWedding = (field, value) => {
    setCustomData(prev => ({
      ...prev,
      wedding: { ...prev.wedding, [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!weddingId) {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 2000);
      return;
    }

    setSaveState('saving');
    try {
      await api.saveWedding(weddingId, {
        template: activeTemplate,
        coupleData: customData.couple,
        weddingDetails: customData.wedding,
        colorPalette: selectedPalette,
        fontPairing: selectedFont,
      });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleReset = () => {
    setCustomData({
      couple: { ...defaultCoupleData },
      wedding: { ...defaultWeddingDetails },
    });
    setSelectedPalette(0);
    setSelectedFont(0);
  };

  const handleExportPDF = async () => {
    // Target the inner frame, not the scrolling container, to prevent cutoff
    const element = document.getElementById('pdf-content');
    if (!element) return;
    
    setIsExporting(true);
    
    try {
      // Dynamically import to avoid Vite module resolution issues with older UMD bundles
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const filename = `${customData.couple.partner1.firstName}-${customData.couple.partner2.firstName}-wedding.pdf`;
      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Generate the PDF as a blob to explicitly enforce the filename
      const pdfWorker = html2pdf().set(opt).from(element);
      const pdfBlob = await pdfWorker.output('blob');
      
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Export failed:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        setCustomData(prev => {
          const currentGallery = prev.wedding.gallery || [];
          return {
            ...prev,
            wedding: {
              ...prev.wedding,
              gallery: [...currentGallery, compressedDataUrl]
            }
          };
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(processFile);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(processFile);
  };

  const removeGalleryPhoto = (index) => {
    const newGallery = [...(customData.wedding.gallery || [])];
    newGallery.splice(index, 1);
    updateWedding('gallery', newGallery);
  };

  const handleExtractPhotos = async () => {
    setIsExtractingPhotos(true);
    // Simulate API fetch delay
    await new Promise(r => setTimeout(r, 2000));
    
    setCustomData(prev => ({
      ...prev,
      wedding: {
        ...prev.wedding,
        venue: {
          ...prev.wedding.venue,
          ceremony: {
            ...prev.wedding.venue.ceremony,
            photos: [
              'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
              'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            ]
          }
        }
      }
    }));
    setIsExtractingPhotos(false);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loadingData) {
    return (
      <div className="customizer" id="customizer-page">
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem', color: 'var(--color-muted)' }}>
          <Loader2 size={20} className="animate-spin" style={{ animation: 'authSpin 0.7s linear infinite' }} />
          <span>Loading your wedding data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="customizer" id="customizer-page">
      <Navbar />

      <div className="customizer__layout">
        {/* Sidebar */}
        <aside className={`customizer__sidebar ${!showPreview ? 'customizer__sidebar--full' : ''}`}>
          <div className="customizer__sidebar-header">
            <h2 className="customizer__sidebar-title font-heading">Customize</h2>
            <div className="customizer__sidebar-actions">
              <button 
                className="customizer__icon-btn" 
                onClick={handleExportPDF} 
                title="Export as PDF"
                disabled={isExporting}
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              </button>
              <button className="customizer__icon-btn" onClick={() => setShowPreview(!showPreview)} title={showPreview ? 'Hide Preview' : 'Show Preview'}>
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button className="customizer__icon-btn" onClick={handleReset} title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <div className="customizer__sections">
            {/* Template Selection */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('template')} id="cust-template-toggle">
                <div className="cust-section__header-left">
                  <Layout size={16} />
                  <span>Template</span>
                </div>
                {expandedSection === 'template' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'template' && (
                <div className="cust-section__content">
                  <div className="cust-templates">
                    {Object.entries(TEMPLATES).map(([id, tmpl]) => (
                      <button
                        key={id}
                        className={`cust-template-btn ${activeTemplate === id ? 'cust-template-btn--active' : ''}`}
                        onClick={() => setActiveTemplate(id)}
                        id={`cust-select-${id}`}
                      >
                        <span className="cust-template-btn__name">{tmpl.name}</span>
                        <span className="cust-template-btn__label">{tmpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Couple Details */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('couple')} id="cust-couple-toggle">
                <div className="cust-section__header-left">
                  <Users size={16} />
                  <span>Couple Details</span>
                </div>
                {expandedSection === 'couple' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'couple' && (
                <div className="cust-section__content">
                  <div className="cust-field">
                    <label className="cust-label">Partner 1 — First Name</label>
                    <input
                      type="text"
                      className="cust-input"
                      value={customData.couple.partner1.firstName}
                      onChange={e => updateCouple('partner1', 'firstName', e.target.value)}
                      id="cust-partner1-name"
                    />
                  </div>
                  <div className="cust-field">
                    <label className="cust-label">Partner 2 — First Name</label>
                    <input
                      type="text"
                      className="cust-input"
                      value={customData.couple.partner2.firstName}
                      onChange={e => updateCouple('partner2', 'firstName', e.target.value)}
                      id="cust-partner2-name"
                    />
                  </div>
                  <div className="cust-field">
                    <label className="cust-label">Wedding Hashtag</label>
                    <input
                      type="text"
                      className="cust-input"
                      value={customData.couple.hashtag}
                      onChange={e => setCustomData(prev => ({ ...prev, couple: { ...prev.couple, hashtag: e.target.value } }))}
                      id="cust-hashtag"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Gallery Section */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('gallery')}>
                <div className="cust-section__header-left">
                  <Image size={16} />
                  <span>Pre-Wedding Photos</span>
                </div>
                {expandedSection === 'gallery' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'gallery' && (
                <div className="cust-section__content">
                  <div 
                    className={`drag-drop-zone ${isDragging ? 'drag-drop-zone--active' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('gallery-upload').click()}
                  >
                    <UploadCloud size={24} />
                    <p className="drag-drop-zone__text">Drag & drop photos here</p>
                    <p className="drag-drop-zone__subtext">or click to browse</p>
                    <input 
                      type="file" 
                      id="gallery-upload" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileInput}
                    />
                  </div>

                  {customData.wedding.gallery && customData.wedding.gallery.length > 0 && (
                    <div className="gallery-thumbnails">
                      {customData.wedding.gallery.map((url, i) => (
                        <div className="gallery-thumbnail" key={i}>
                          <img src={url} alt={`Gallery ${i + 1}`} />
                          <button 
                            className="gallery-thumbnail__remove" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryPhoto(i);
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wedding Details */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('wedding')} id="cust-wedding-toggle">
                <div className="cust-section__header-left">
                  <Calendar size={16} />
                  <span>Wedding Details</span>
                </div>
                {expandedSection === 'wedding' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'wedding' && (
                <div className="cust-section__content">
                  <div className="cust-field">
                    <label className="cust-label">Wedding Date</label>
                    <input
                      type="datetime-local"
                      className="cust-input"
                      value={(customData.wedding.date || '').slice(0, 16)}
                      onChange={e => updateWedding('date', e.target.value)}
                      id="cust-date"
                    />
                  </div>
                  <div className="cust-field">
                    <label className="cust-label">Dress Code</label>
                    <input
                      type="text"
                      className="cust-input"
                      value={customData.wedding.dressCode}
                      onChange={e => updateWedding('dressCode', e.target.value)}
                      id="cust-dresscode"
                    />
                  </div>
                  <div className="cust-field">
                    <label className="cust-label">Ceremony Venue</label>
                    <input
                      type="text"
                      className="cust-input"
                      value={customData.wedding.venue.ceremony.name}
                      onChange={e => setCustomData(prev => ({
                        ...prev,
                        wedding: {
                          ...prev.wedding,
                          venue: {
                            ...prev.wedding.venue,
                            ceremony: { ...prev.wedding.venue.ceremony, name: e.target.value },
                          },
                        },
                      }))}
                      id="cust-venue"
                    />
                  </div>
                  <div className="cust-field">
                    <label className="cust-label">Google Maps Link</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <input
                        type="url"
                        className="cust-input"
                        value={customData.wedding.venue.ceremony.mapUrl || ''}
                        onChange={e => setCustomData(prev => ({
                          ...prev,
                          wedding: {
                            ...prev.wedding,
                            venue: {
                              ...prev.wedding.venue,
                              ceremony: { ...prev.wedding.venue.ceremony, mapUrl: e.target.value },
                            },
                          },
                        }))}
                        placeholder="https://maps.google.com/..."
                      />
                      <button 
                        className="btn btn-primary" 
                        onClick={handleExtractPhotos}
                        disabled={isExtractingPhotos || !customData.wedding.venue.ceremony.mapUrl}
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        {isExtractingPhotos ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                        {isExtractingPhotos ? 'Extracting Photos...' : 'Extract Venue Photos'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('colors')} id="cust-colors-toggle">
                <div className="cust-section__header-left">
                  <Palette size={16} />
                  <span>Color Palette</span>
                </div>
                {expandedSection === 'colors' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'colors' && (
                <div className="cust-section__content">
                  <div className="cust-palettes">
                    {COLOR_PALETTES.map((palette, i) => (
                      <button
                        key={i}
                        className={`cust-palette ${selectedPalette === i ? 'cust-palette--active' : ''}`}
                        onClick={() => setSelectedPalette(i)}
                      >
                        <div className="cust-palette__colors">
                          {palette.colors.map((c, j) => (
                            <span key={j} style={{ background: c }} />
                          ))}
                        </div>
                        <span className="cust-palette__name">{palette.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Font Pairing */}
            <div className="cust-section">
              <button className="cust-section__header" onClick={() => toggleSection('fonts')} id="cust-fonts-toggle">
                <div className="cust-section__header-left">
                  <Type size={16} />
                  <span>Typography</span>
                </div>
                {expandedSection === 'fonts' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedSection === 'fonts' && (
                <div className="cust-section__content">
                  <div className="cust-fonts">
                    {FONT_PAIRINGS.map((font, i) => (
                      <button
                        key={i}
                        className={`cust-font ${selectedFont === i ? 'cust-font--active' : ''}`}
                        onClick={() => setSelectedFont(i)}
                      >
                        <span className="cust-font__name">{font.name}</span>
                        <span className="cust-font__preview" style={{ fontFamily: font.heading }}>{font.heading}</span>
                        <span className="cust-font__body">{font.body}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="customizer__save">
            <button
              className={`btn btn-primary customizer__save-btn ${saveState === 'saved' ? 'customizer__save-btn--saved' : ''}`}
              onClick={handleSave}
              disabled={saveState === 'saving'}
              id="cust-save"
            >
              {saveState === 'saving' ? (
                <>
                  <Loader2 size={16} style={{ animation: 'authSpin 0.7s linear infinite' }} />
                  Saving...
                </>
              ) : saveState === 'saved' ? (
                <>
                  <CheckCircle2 size={16} />
                  Saved!
                </>
              ) : saveState === 'error' ? (
                <>
                  <Save size={16} />
                  Save Failed — Retry
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Preview */}
        {showPreview && (
          <main className="customizer__preview" id="customizer-preview">
            <div className="customizer__preview-frame" id="pdf-content">
              <TemplateComponent customData={customData} weddingId={weddingId} />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
