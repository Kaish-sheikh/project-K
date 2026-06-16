import AvatarFigure from './AvatarFigure';
import './CoupleAvatars.css';

const DEFAULT_BRIDE = {
  skinTone: '#D4A574',
  hairStyle: 'wavy',
  hairColor: '#3B2314',
  outfitColor: '#FFFFFF',
  outfitStyle: 'western',
  height: 'average',
  accessory: 'veil',
};

const DEFAULT_GROOM = {
  skinTone: '#C19A6B',
  hairStyle: 'short',
  hairColor: '#1C1008',
  outfitColor: '#1A1A2E',
  outfitStyle: 'western',
  height: 'tall',
  accessory: 'bowtie',
};

export default function CoupleAvatars({ avatars = {}, coupleNames = {}, variant = 'light' }) {
  const bride = { ...DEFAULT_BRIDE, ...(avatars.bride || {}) };
  const groom = { ...DEFAULT_GROOM, ...(avatars.groom || {}) };

  const partner1Name = coupleNames.partner1 || 'Bride';
  const partner2Name = coupleNames.partner2 || 'Groom';

  return (
    <div className={`couple-avatars couple-avatars--${variant}`} id="couple-avatars-section">
      <div className="couple-avatars__inner">
        <h3 className="couple-avatars__title font-heading">Meet the Couple</h3>

        <div className="couple-avatars__figures">
          {/* Bride */}
          <div className="couple-avatars__person">
            <AvatarFigure
              gender="bride"
              skinTone={bride.skinTone}
              hairStyle={bride.hairStyle}
              hairColor={bride.hairColor}
              outfitColor={bride.outfitColor}
              outfitStyle={bride.outfitStyle}
              height={bride.height}
              accessory={bride.accessory}
              animated={true}
            />
            <span className="couple-avatars__name font-heading">{partner1Name}</span>
          </div>

          {/* Floating hearts between them */}
          <div className="couple-avatars__hearts" aria-hidden="true">
            <span className="couple-avatars__heart couple-avatars__heart--1">♥</span>
            <span className="couple-avatars__heart couple-avatars__heart--2">♥</span>
            <span className="couple-avatars__heart couple-avatars__heart--3">♥</span>
            <span className="couple-avatars__heart couple-avatars__heart--4">♥</span>
            <span className="couple-avatars__heart couple-avatars__heart--5">♥</span>
          </div>

          {/* Groom */}
          <div className="couple-avatars__person">
            <AvatarFigure
              gender="groom"
              skinTone={groom.skinTone}
              hairStyle={groom.hairStyle}
              hairColor={groom.hairColor}
              outfitColor={groom.outfitColor}
              outfitStyle={groom.outfitStyle}
              height={groom.height}
              accessory={groom.accessory}
              animated={true}
            />
            <span className="couple-avatars__name font-heading">{partner2Name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
