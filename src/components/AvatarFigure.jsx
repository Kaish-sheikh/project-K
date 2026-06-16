import { useMemo } from 'react';
import './AvatarFigure.css';

// =========================================
// Hair path generators for different styles
// =========================================

function getHairPath(style, gender) {
  // All paths are relative to a head centered at (100, 60), radius ~28
  const paths = {
    short: {
      path: 'M72,58 Q72,28 100,24 Q128,28 128,58 Q128,42 118,36 Q108,30 100,30 Q92,30 82,36 Q72,42 72,58Z',
      backPath: null,
    },
    straight: {
      path: 'M68,55 Q68,22 100,18 Q132,22 132,55 L132,90 Q128,85 125,90 L125,60 Q125,35 100,32 Q75,35 75,60 L75,90 Q72,85 68,90Z',
      backPath: 'M65,55 Q65,18 100,14 Q135,18 135,55 L135,100 Q132,95 128,100 L128,55 Q128,30 100,26 Q72,30 72,55 L72,100 Q68,95 65,100Z',
    },
    wavy: {
      path: 'M68,55 Q68,22 100,18 Q132,22 132,55 Q134,65 130,72 Q126,80 130,88 Q128,82 125,78 Q122,72 125,62 L125,55 Q125,35 100,32 Q75,35 75,55 L75,62 Q78,72 75,78 Q72,82 70,88 Q74,80 70,72 Q66,65 68,55Z',
      backPath: null,
    },
    curly: {
      path: 'M68,58 Q65,25 100,20 Q135,25 132,58 Q136,52 134,45 Q132,38 128,42 Q130,32 125,28 Q118,24 115,32 Q112,22 100,20 Q88,22 85,32 Q82,24 75,28 Q70,32 72,42 Q68,38 66,45 Q64,52 68,58Z M132,58 Q134,68 130,75 Q126,70 128,62Z M68,58 Q66,68 70,75 Q74,70 72,62Z',
      backPath: null,
    },
    bun: {
      path: 'M72,58 Q72,28 100,24 Q128,28 128,58 Q128,42 118,36 Q108,30 100,30 Q92,30 82,36 Q72,42 72,58Z',
      backPath: null,
      extra: { cx: 100, cy: 20, r: 14 },
    },
    braided: {
      path: 'M68,55 Q68,22 100,18 Q132,22 132,55 L130,65 L125,55 Q125,35 100,32 Q75,35 75,55 L70,65Z',
      backPath: null,
      braidPath: 'M130,65 Q132,78 128,90 Q126,96 130,102 Q128,108 125,102 Q122,96 124,88 Q128,76 126,65Z M70,65 Q68,78 72,90 Q74,96 70,102 Q72,108 75,102 Q78,96 76,88 Q72,76 74,65Z',
    },
  };

  return paths[style] || paths.short;
}

// =========================================
// Accessory SVG renderers
// =========================================

function renderAccessory(accessory, gender, outfitColor, outfitHighlight) {
  switch (accessory) {
    case 'veil':
      return (
        <g className="avatar-accessory avatar-accessory--veil">
          <ellipse cx="100" cy="30" rx="40" ry="15" fill="white" opacity="0.25" />
          <path d="M65,35 Q60,60 55,100 Q58,95 65,90 Q70,70 75,55Z" fill="white" opacity="0.18" />
          <path d="M135,35 Q140,60 145,100 Q142,95 135,90 Q130,70 125,55Z" fill="white" opacity="0.18" />
        </g>
      );
    case 'tiara':
      return (
        <g className="avatar-accessory avatar-accessory--tiara">
          <path d="M82,32 L88,20 L94,28 L100,16 L106,28 L112,20 L118,32" fill="none" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="100" cy="16" r="2.5" fill="#D4AF37" />
          <circle cx="88" cy="22" r="1.5" fill="#D4AF37" />
          <circle cx="112" cy="22" r="1.5" fill="#D4AF37" />
        </g>
      );
    case 'bouquet':
      return (
        <g className="avatar-accessory avatar-accessory--bouquet" transform="translate(60, 140)">
          <line x1="20" y1="15" x2="18" y2="35" stroke="#6B9B6B" strokeWidth="2" />
          <line x1="25" y1="12" x2="25" y2="35" stroke="#6B9B6B" strokeWidth="2" />
          <line x1="30" y1="15" x2="32" y2="35" stroke="#6B9B6B" strokeWidth="2" />
          <circle cx="18" cy="12" r="6" fill="#E8A0A0" />
          <circle cx="28" cy="8" r="7" fill="#F2C0C0" />
          <circle cx="36" cy="14" r="5" fill="#D4A0A0" />
          <circle cx="22" cy="5" r="5" fill="#E8C4C4" />
          <circle cx="32" cy="4" r="4" fill="#F0B0B0" />
          <circle cx="18" cy="12" r="2" fill="#C07070" />
          <circle cx="28" cy="8" r="2.5" fill="#D09090" />
          <circle cx="36" cy="14" r="1.5" fill="#B06060" />
        </g>
      );
    case 'bowtie':
      return (
        <g className="avatar-accessory avatar-accessory--bowtie">
          <path d="M90,102 L80,96 L80,108 Z" fill="#8B0000" />
          <path d="M110,102 L120,96 L120,108 Z" fill="#8B0000" />
          <circle cx="100" cy="102" r="3" fill="#8B0000" />
        </g>
      );
    case 'boutonniere':
      return (
        <g className="avatar-accessory avatar-accessory--boutonniere" transform="translate(118, 112)">
          <line x1="5" y1="5" x2="5" y2="14" stroke="#6B9B6B" strokeWidth="1.5" />
          <circle cx="5" cy="4" r="4" fill="#E8A0A0" />
          <circle cx="5" cy="4" r="1.5" fill="#C07070" />
          <ellipse cx="2" cy="8" rx="2" ry="3" fill="#8BA888" />
        </g>
      );
    // ---- Indian Bride Accessories ----
    case 'maangtikka':
      return (
        <g className="avatar-accessory avatar-accessory--tiara">
          {/* Chain along parting */}
          <path d="M100,32 L100,18" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Central pendant */}
          <circle cx="100" cy="33" r="4" fill="#D4AF37" />
          <circle cx="100" cy="33" r="2" fill="#C41E3A" />
          {/* Side chains */}
          <path d="M100,18 Q92,16 85,22" fill="none" stroke="#D4AF37" strokeWidth="1" />
          <path d="M100,18 Q108,16 115,22" fill="none" stroke="#D4AF37" strokeWidth="1" />
          {/* Small gems */}
          <circle cx="100" cy="18" r="2" fill="#D4AF37" />
          <circle cx="92" cy="19" r="1.2" fill="#D4AF37" />
          <circle cx="108" cy="19" r="1.2" fill="#D4AF37" />
        </g>
      );
    case 'dupatta':
      return (
        <g className="avatar-accessory avatar-accessory--veil">
          {/* Dupatta draped over head */}
          <path d="M70,35 Q68,20 100,16 Q132,20 130,35 Q135,55 140,90 Q138,85 132,82 Q128,60 125,45 Q120,32 100,30 Q80,32 75,45 Q72,60 68,82 Q62,85 60,90 Q65,55 70,35Z"
            fill={outfitColor} opacity="0.5" />
          {/* Gold border */}
          <path d="M60,88 Q62,85 68,82" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
          <path d="M140,88 Q138,85 132,82" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
        </g>
      );
    case 'jhumka':
      return (
        <g className="avatar-accessory">
          {/* Left jhumka */}
          <circle cx="70" cy="68" r="2" fill="#D4AF37" />
          <path d="M68,70 Q70,76 72,70" fill="#D4AF37" />
          <circle cx="70" cy="77" r="3" fill="#D4AF37" />
          <circle cx="70" cy="77" r="1.5" fill="#C41E3A" />
          {/* Right jhumka */}
          <circle cx="130" cy="68" r="2" fill="#D4AF37" />
          <path d="M128,70 Q130,76 132,70" fill="#D4AF37" />
          <circle cx="130" cy="77" r="3" fill="#D4AF37" />
          <circle cx="130" cy="77" r="1.5" fill="#C41E3A" />
        </g>
      );
    // ---- Indian Groom Accessories ----
    case 'pagdi':
      return (
        <g className="avatar-accessory">
          {/* Turban wraps */}
          <path d="M68,50 Q65,28 100,20 Q135,28 132,50 Q132,35 120,26 Q108,20 100,20 Q92,20 80,26 Q68,35 68,50Z"
            fill={outfitColor} />
          <path d="M70,48 Q70,32 100,24 Q130,32 130,48 Q130,38 118,30 Q106,24 100,24 Q94,24 82,30 Q70,38 70,48Z"
            fill={outfitHighlight} opacity="0.6" />
          {/* Turban fold lines */}
          <path d="M75,42 Q88,35 100,34 Q112,35 125,42" fill="none" stroke={outfitColor} strokeWidth="1.5" opacity="0.5" />
          <path d="M78,38 Q90,30 100,29 Q110,30 122,38" fill="none" stroke={outfitColor} strokeWidth="1" opacity="0.4" />
          {/* Sarpech / front ornament */}
          <circle cx="100" cy="26" r="4" fill="#D4AF37" />
          <circle cx="100" cy="26" r="2" fill="#C41E3A" />
          {/* Feather / kalgi */}
          <path d="M104,26 Q110,14 108,8 Q106,14 104,20" fill="#D4AF37" opacity="0.7" />
        </g>
      );
    case 'dupattaGroom':
      return (
        <g className="avatar-accessory">
          {/* Stole draped from left shoulder */}
          <path d="M65,98 Q60,110 58,135 Q56,150 60,170 Q62,165 64,170 Q60,148 62,130 Q64,112 70,100Z"
            fill={outfitColor} opacity="0.6" />
          <path d="M60,168 L60,172" stroke="#D4AF37" strokeWidth="2" opacity="0.5" />
        </g>
      );
    case 'kalgi':
      return (
        <g className="avatar-accessory avatar-accessory--tiara">
          {/* Turban ornament — plume */}
          <path d="M100,28 Q104,16 106,6 Q104,10 100,14 Q96,10 94,6 Q96,16 100,28Z" fill="#D4AF37" />
          <circle cx="100" cy="28" r="3" fill="#D4AF37" />
          <circle cx="100" cy="28" r="1.5" fill="#C41E3A" />
        </g>
      );
    default:
      return null;
  }
}

// =========================================
// Indian outfit SVG body renderers
// =========================================

function renderLehenga(outfitGradientId, outfitColor, outfitHighlight) {
  return (
    <g className="avatar-outfit">
      {/* Choli (blouse) */}
      <path d="M82,92 Q82,88 90,88 L110,88 Q118,88 118,92 L120,108 L80,108Z"
        fill={`url(#${outfitGradientId})`} />
      {/* Choli neckline decoration */}
      <path d="M88,88 Q100,94 112,88" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Sleeves — short cap */}
      <ellipse cx="78" cy="95" rx="8" ry="6" fill={`url(#${outfitGradientId})`} />
      <ellipse cx="122" cy="95" rx="8" ry="6" fill={`url(#${outfitGradientId})`} />
      {/* Waist band with gold */}
      <rect x="80" y="106" width="40" height="5" rx="2" fill="#D4AF37" opacity="0.6" />
      {/* Lehenga skirt — flared */}
      <path d="M78,110 Q70,140 50,202 L55,204 Q72,175 100,185 Q128,175 145,204 L150,202 Q130,140 122,110Z"
        fill={`url(#${outfitGradientId})`} />
      {/* Embroidery pattern on skirt */}
      <path d="M68,155 Q84,148 100,155 Q116,148 132,155" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
      <path d="M62,175 Q80,168 100,175 Q120,168 138,175" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.4" />
      <path d="M56,195 Q78,186 100,195 Q122,186 144,195" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" />
      {/* Bottom border */}
      <path d="M50,200 Q75,192 100,200 Q125,192 150,200 L150,204 Q125,196 100,204 Q75,196 50,204Z"
        fill="#D4AF37" opacity="0.5" />
    </g>
  );
}

function renderSaree(outfitGradientId, outfitColor, outfitHighlight, skinGradientId) {
  return (
    <g className="avatar-outfit">
      {/* Blouse */}
      <path d="M82,92 Q82,88 90,88 L110,88 Q118,88 118,92 L120,106 L80,106Z"
        fill={outfitHighlight} />
      {/* Blouse neckline */}
      <path d="M88,88 Q100,92 112,88" fill="none" stroke="#D4AF37" strokeWidth="1" />
      {/* Sleeves */}
      <ellipse cx="78" cy="95" rx="8" ry="6" fill={outfitHighlight} />
      <ellipse cx="122" cy="95" rx="8" ry="6" fill={outfitHighlight} />
      {/* Saree wrap — lower body */}
      <path d="M78,106 Q74,135 65,202 L135,202 Q126,135 122,106Z"
        fill={`url(#${outfitGradientId})`} />
      {/* Pleats at front */}
      <line x1="92" y1="110" x2="88" y2="200" stroke={outfitColor} strokeWidth="0.8" opacity="0.3" />
      <line x1="96" y1="110" x2="93" y2="200" stroke={outfitColor} strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="110" x2="98" y2="200" stroke={outfitColor} strokeWidth="0.8" opacity="0.3" />
      <line x1="104" y1="110" x2="103" y2="200" stroke={outfitColor} strokeWidth="0.8" opacity="0.3" />
      {/* Pallu draping over left shoulder and back */}
      <path d="M80,106 Q75,98 70,96 Q60,94 55,100 Q48,115 45,140 Q42,160 48,175 Q50,170 52,175 Q48,158 50,138 Q54,115 60,100 Q65,96 72,98 Q78,100 82,108Z"
        fill={`url(#${outfitGradientId})`} opacity="0.75" />
      {/* Pallu gold border */}
      <path d="M48,173 Q50,168 52,173" fill="none" stroke="#D4AF37" strokeWidth="2" opacity="0.6" />
      {/* Waist border */}
      <path d="M78,106 L122,106 L122,110 L78,110Z" fill="#D4AF37" opacity="0.4" />
      {/* Bottom border */}
      <path d="M65,198 L135,198 L135,202 L65,202Z" fill="#D4AF37" opacity="0.5" />
    </g>
  );
}

function renderSherwani(outfitGradientId, outfitColor, outfitHighlight) {
  return (
    <g className="avatar-outfit">
      {/* Main sherwani body — extends to knees */}
      <path d="M74,92 Q72,90 70,92 L65,170 L95,170 L95,92Z"
        fill={`url(#${outfitGradientId})`} />
      <path d="M126,92 Q128,90 130,92 L135,170 L105,170 L105,92Z"
        fill={`url(#${outfitGradientId})`} />
      {/* Front overlap panel */}
      <path d="M95,92 L105,92 L105,170 L95,170Z" fill={outfitHighlight} opacity="0.3" />
      {/* Ornate collar — mandarin/band */}
      <path d="M88,88 Q100,84 112,88 L112,94 Q100,90 88,94Z" fill={`url(#${outfitGradientId})`} />
      <path d="M88,88 Q100,84 112,88" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Button line */}
      <circle cx="100" cy="100" r="1.5" fill="#D4AF37" />
      <circle cx="100" cy="112" r="1.5" fill="#D4AF37" />
      <circle cx="100" cy="124" r="1.5" fill="#D4AF37" />
      <circle cx="100" cy="136" r="1.5" fill="#D4AF37" />
      <circle cx="100" cy="148" r="1.5" fill="#D4AF37" />
      {/* Embroidery accents */}
      <path d="M80,105 Q85,100 80,95" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
      <path d="M120,105 Q115,100 120,95" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
      <path d="M78,130 Q83,125 78,120" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
      <path d="M122,130 Q117,125 122,120" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.4" />
      {/* Shoulders */}
      <ellipse cx="72" cy="95" rx="10" ry="7" fill={`url(#${outfitGradientId})`} />
      <ellipse cx="128" cy="95" rx="10" ry="7" fill={`url(#${outfitGradientId})`} />
      {/* Churidar pants */}
      <path d="M67,168 L65,202 L85,202 L88,175 L100,178 L112,175 L115,202 L135,202 L133,168Z"
        fill={outfitColor} opacity="0.75" />
      {/* Bottom border */}
      <path d="M65,168 L135,168 L135,172 L65,172Z" fill="#D4AF37" opacity="0.4" />
    </g>
  );
}

function renderKurta(outfitGradientId, outfitColor, outfitHighlight) {
  return (
    <g className="avatar-outfit">
      {/* Kurta body — straight cut to mid-thigh */}
      <path d="M76,92 Q74,90 72,92 L68,160 L132,160 Q128,90 126,92 Q124,90 122,92 L122,92Z"
        fill={`url(#${outfitGradientId})`} />
      {/* Front slit */}
      <line x1="100" y1="98" x2="100" y2="160" stroke={outfitColor} strokeWidth="0.8" opacity="0.3" />
      {/* Simple collar */}
      <path d="M90,88 Q100,85 110,88 L110,94 Q100,91 90,94Z" fill={`url(#${outfitGradientId})`} />
      {/* Collar edge */}
      <path d="M90,88 Q100,85 110,88" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
      {/* Placket buttons */}
      <circle cx="100" cy="102" r="1.2" fill="#D4AF37" opacity="0.6" />
      <circle cx="100" cy="112" r="1.2" fill="#D4AF37" opacity="0.6" />
      <circle cx="100" cy="122" r="1.2" fill="#D4AF37" opacity="0.6" />
      {/* Sleeves */}
      <ellipse cx="72" cy="95" rx="10" ry="7" fill={`url(#${outfitGradientId})`} />
      <ellipse cx="128" cy="95" rx="10" ry="7" fill={`url(#${outfitGradientId})`} />
      {/* Pajama pants — loose */}
      <path d="M70,158 L68,202 L90,202 L94,170 L100,172 L106,170 L110,202 L132,202 L130,158Z"
        fill={outfitColor} opacity="0.7" />
      {/* Bottom border of kurta */}
      <path d="M68,158 L132,158 L132,162 L68,162Z" fill="#D4AF37" opacity="0.3" />
    </g>
  );
}

// =========================================
// Height scale mapping
// =========================================
const HEIGHT_SCALES = {
  petite: 0.88,
  average: 1.0,
  tall: 1.1,
};

// =========================================
// Main AvatarFigure Component
// =========================================

export default function AvatarFigure({
  gender = 'bride',
  skinTone = '#D4A574',
  hairStyle = 'wavy',
  hairColor = '#3B2314',
  outfitColor = '#FFFFFF',
  outfitStyle = 'western',
  height = 'average',
  accessory = 'none',
  animated = true,
  className = '',
}) {
  const scale = HEIGHT_SCALES[height] || 1.0;
  const isBride = gender === 'bride';
  const isIndianOutfit = ['lehenga', 'saree', 'sherwani', 'kurta'].includes(outfitStyle);

  const hairData = useMemo(() => getHairPath(hairStyle, gender), [hairStyle, gender]);

  // Compute outfit lighter shade for details
  const outfitHighlight = useMemo(() => {
    const hex = outfitColor.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 40);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 40);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 40);
    return `rgb(${r},${g},${b})`;
  }, [outfitColor]);

  const viewBoxHeight = Math.round(240 / scale);
  const animClass = animated ? 'avatar-figure--animated' : '';

  const outfitGradientId = `outfit-${gender}`;
  const skinGradientId = `skin-${gender}`;

  // Render the appropriate outfit body
  function renderOutfitBody() {
    if (outfitStyle === 'lehenga' && isBride) {
      return renderLehenga(outfitGradientId, outfitColor, outfitHighlight);
    }
    if (outfitStyle === 'saree' && isBride) {
      return renderSaree(outfitGradientId, outfitColor, outfitHighlight, skinGradientId);
    }
    if (outfitStyle === 'sherwani' && !isBride) {
      return renderSherwani(outfitGradientId, outfitColor, outfitHighlight);
    }
    if (outfitStyle === 'kurta' && !isBride) {
      return renderKurta(outfitGradientId, outfitColor, outfitHighlight);
    }

    // Default western outfits
    if (isBride) {
      return (
        <g className="avatar-outfit">
          <path d="M78,100 Q78,92 88,92 L112,92 Q122,92 122,100 L125,130 L75,130Z" fill={`url(#${outfitGradientId})`} />
          <path d="M75,130 Q72,155 55,200 L60,202 Q80,180 100,200 Q120,180 140,202 L145,200 Q128,155 125,130Z" fill={`url(#${outfitGradientId})`} />
          <path d="M76,128 Q100,134 124,128 L125,132 Q100,138 75,132Z" fill={outfitHighlight} opacity="0.5" />
          <ellipse cx="75" cy="100" rx="10" ry="8" fill={`url(#${outfitGradientId})`} />
          <ellipse cx="125" cy="100" rx="10" ry="8" fill={`url(#${outfitGradientId})`} />
        </g>
      );
    }
    return (
      <g className="avatar-outfit">
        <path d="M78,95 Q75,92 72,95 L68,140 L90,140 L90,95Z" fill={`url(#${outfitGradientId})`} />
        <path d="M122,95 Q125,92 128,95 L132,140 L110,140 L110,95Z" fill={`url(#${outfitGradientId})`} />
        <path d="M90,95 L110,95 L110,140 L90,140Z" fill="#F5F0EB" />
        <path d="M90,95 L100,110 L95,95Z" fill={outfitColor} opacity="0.8" />
        <path d="M110,95 L100,110 L105,95Z" fill={outfitColor} opacity="0.8" />
        <path d="M70,138 L68,200 L88,200 L92,155 L100,160 L108,155 L112,200 L132,200 L130,138Z" fill={outfitColor} opacity="0.85" />
        <ellipse cx="72" cy="98" rx="12" ry="8" fill={`url(#${outfitGradientId})`} />
        <ellipse cx="128" cy="98" rx="12" ry="8" fill={`url(#${outfitGradientId})`} />
      </g>
    );
  }

  return (
    <div className={`avatar-figure ${animClass} ${className}`}>
      <svg
        viewBox={`0 0 200 ${viewBoxHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="avatar-figure__svg"
        aria-label={`${gender} avatar`}
      >
        <defs>
          <radialGradient id={skinGradientId} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={skinTone} />
            <stop offset="100%" stopColor={skinTone} stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id={outfitGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={outfitHighlight} />
            <stop offset="100%" stopColor={outfitColor} />
          </linearGradient>
          <linearGradient id={`hair-${gender}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hairColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={hairColor} />
          </linearGradient>
          <filter id={`soft-shadow-${gender}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
          </filter>
          <filter id={`grain-${gender}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.12 0" />
          </filter>
          <radialGradient id={`blush-grad-${gender}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8A0A0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E8A0A0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="avatar-figure__body-group">
          {/* Back hair (long styles) */}
          {hairData.backPath && (
            <path d={hairData.backPath} fill={`url(#hair-${gender})`} opacity="0.7" />
          )}

          {/* Neck */}
          <rect x="93" y="82" width="14" height="18" rx="5" fill={`url(#${skinGradientId})`} />
          <ellipse cx="100" cy="87" rx="7" ry="3" fill="#000000" opacity="0.15" />

          {/* Body / Outfit */}
          {renderOutfitBody()}

          {/* Arms (skin) */}
          <g className="avatar-arms">
            <path
              d={isBride
                ? "M65,100 Q58,120 62,142 Q64,140 66,142 Q62,122 68,104Z"
                : "M60,100 Q54,120 58,145 Q60,143 62,145 Q58,122 64,104Z"
              }
              fill={`url(#${skinGradientId})`}
            />
            <path
              d={isBride
                ? "M135,100 Q142,120 138,142 Q136,140 134,142 Q138,122 132,104Z"
                : "M140,100 Q146,120 142,145 Q140,143 138,145 Q142,122 136,104Z"
              }
              fill={`url(#${skinGradientId})`}
            />
          </g>

          {/* Hands */}
          <circle cx={isBride ? 62 : 58} cy={isBride ? 144 : 147} r="5" fill={skinTone} />
          <circle cx={isBride ? 138 : 142} cy={isBride ? 144 : 147} r="5" fill={skinTone} />

          {/* Head */}
          <circle cx="100" cy="60" r="28" fill={`url(#${skinGradientId})`} />

          {/* Face features */}
          <g className="avatar-face">
            {/* Eyebrows */}
            <path d="M84,45 Q88,42 93,44" fill="none" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            <path d="M107,44 Q112,42 116,45" fill="none" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

            <g className="avatar-eyes">
              {/* Base */}
              <ellipse cx="90" cy="58" rx="3.5" ry="4" fill="#2C2C2C" />
              <ellipse cx="110" cy="58" rx="3.5" ry="4" fill="#2C2C2C" />
              {/* Primary catchlight */}
              <circle cx="91.5" cy="56.5" r="1.5" fill="white" />
              <circle cx="111.5" cy="56.5" r="1.5" fill="white" />
              {/* Secondary softer catchlight */}
              <circle cx="88.5" cy="59.5" r="0.8" fill="white" opacity="0.6" />
              <circle cx="108.5" cy="59.5" r="0.8" fill="white" opacity="0.6" />
            </g>
            {/* Eyelashes */}
            <path d="M84,50 Q87,47 93,49" fill="none" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M107,49 Q113,47 116,50" fill="none" stroke={hairColor} strokeWidth="1.5" strokeLinecap="round" />
            {/* Nose */}
            <path d="M98,62 Q100,66 102,62" fill="none" stroke={skinTone} strokeWidth="1.5" opacity="0.7" />
            {/* Lips */}
            <path d="M93,70 Q100,75 107,70" fill="none" stroke="#C46060" strokeWidth="2.2" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="83" cy="67" r="8" fill={`url(#blush-grad-${gender})`} />
            <circle cx="117" cy="67" r="8" fill={`url(#blush-grad-${gender})`} />
            {/* Bindi for Indian bride */}
            {isIndianOutfit && isBride && (
              <circle cx="100" cy="48" r="2" fill="#C41E3A" filter={`url(#soft-shadow-${gender})`} />
            )}
          </g>

          {/* Hair */}
          <g className="avatar-hair" filter={`url(#soft-shadow-${gender})`}>
            <path d={hairData.path} fill={`url(#hair-${gender})`} />
            {hairData.extra && (
              <circle cx={hairData.extra.cx} cy={hairData.extra.cy} r={hairData.extra.r} fill={`url(#hair-${gender})`} />
            )}
            {hairData.braidPath && (
              <path d={hairData.braidPath} fill={`url(#hair-${gender})`} />
            )}
          </g>

          {/* Ears */}
          <ellipse cx="72" cy="62" rx="5" ry="6" fill={skinTone} opacity="0.6" />
          <ellipse cx="128" cy="62" rx="5" ry="6" fill={skinTone} opacity="0.6" />

          {/* Shoes */}
          {isIndianOutfit ? (
            /* Juttis — traditional Indian shoes */
            <>
              <path d="M70,200 Q78,196 90,200 Q82,205 70,204Z" fill="#D4AF37" opacity="0.8" />
              <path d="M110,200 Q122,196 130,200 Q122,205 110,204Z" fill="#D4AF37" opacity="0.8" />
              <circle cx="78" cy="199" r="1" fill="#C41E3A" />
              <circle cx="122" cy="199" r="1" fill="#C41E3A" />
            </>
          ) : isBride ? (
            <>
              <ellipse cx="80" cy="202" rx="10" ry="4" fill={outfitColor} opacity="0.7" />
              <ellipse cx="120" cy="202" rx="10" ry="4" fill={outfitColor} opacity="0.7" />
            </>
          ) : (
            <>
              <ellipse cx="78" cy="202" rx="12" ry="5" fill="#1A1A1A" />
              <ellipse cx="122" cy="202" rx="12" ry="5" fill="#1A1A1A" />
            </>
          )}

          {/* Accessory */}
          {renderAccessory(accessory, gender, outfitColor, outfitHighlight)}

          {/* Grain Overlay Layer for Texture */}
          <rect x="0" y="0" width="200" height="240" fill="white" filter={`url(#grain-${gender})`} style={{ mixBlendMode: 'multiply' }} pointerEvents="none" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}
