import CountdownTimer from '../components/CountdownTimer';
import CoupleAvatars from '../components/CoupleAvatars';
import RSVPForm from '../components/RSVPForm';
import Timeline from '../components/Timeline';
import PhotoGallery from '../components/PhotoGallery';
import ScrollReveal from '../components/ScrollReveal';
import { coupleData, weddingDetails, events, registryItems } from '../data/sampleData';
import { formatDate } from '../utils/helpers';
import { MapPin, Calendar, Clock, Shirt, Gift, ExternalLink } from 'lucide-react';
import './DesiRoyal.css';

// Mandala SVG pattern component
function MandalaDivider() {
  return (
    <div className="dr-mandala-divider" aria-hidden="true">
      <div className="dr-mandala-divider__line" />
      <svg viewBox="0 0 80 80" className="dr-mandala-divider__icon" xmlns="http://www.w3.org/2000/svg">
        {/* Center circle */}
        <circle cx="40" cy="40" r="6" fill="var(--dr-gold, #D4AF37)" />
        <circle cx="40" cy="40" r="3" fill="var(--dr-red, #C41E3A)" />
        {/* Inner petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <ellipse key={deg} cx="40" cy="25" rx="4" ry="10"
            fill="var(--dr-gold, #D4AF37)" opacity="0.6"
            transform={`rotate(${deg} 40 40)`} />
        ))}
        {/* Outer petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(deg => (
          <ellipse key={deg} cx="40" cy="18" rx="3" ry="8"
            fill="var(--dr-red, #C41E3A)" opacity="0.4"
            transform={`rotate(${deg} 40 40)`} />
        ))}
        {/* Outer ring */}
        <circle cx="40" cy="40" r="32" fill="none" stroke="var(--dr-gold, #D4AF37)" strokeWidth="1" opacity="0.4" />
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--dr-gold, #D4AF37)" strokeWidth="0.5" opacity="0.25" />
      </svg>
      <div className="dr-mandala-divider__line" />
    </div>
  );
}

// Indian event icon map
const EVENT_ICONS = {
  'Mehndi': '🪷',
  'Sangeet': '🎶',
  'Haldi': '🌼',
  'Baraat': '🐎',
  'Wedding Ceremony': '💍',
  'Pheras': '🔥',
  'Reception': '🎉',
  'Vidaai': '🪔',
};

function getEventIcon(eventName) {
  for (const [key, icon] of Object.entries(EVENT_ICONS)) {
    if (eventName.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '🪔';
}

export default function DesiRoyal({ customData = {}, weddingId }) {
  const couple = customData.couple || coupleData;
  const wedding = customData.wedding || weddingDetails;

  const galleryPhotos = wedding.gallery && wedding.gallery.length > 0
    ? wedding.gallery.map((url, i) => ({ id: i, src: url, caption: `Cherished Moment ${i + 1}` }))
    : undefined;

  return (
    <div className="desiroyal" id="desiroyal-template">
      {/* ---- Hero ---- */}
      <section className="dr-hero" id="dr-hero">
        {/* Decorative mandala overlay */}
        <div className="dr-hero__mandala dr-hero__mandala--tl" aria-hidden="true" />
        <div className="dr-hero__mandala dr-hero__mandala--br" aria-hidden="true" />
        <div className="dr-hero__overlay" />

        <div className="dr-hero__content">
          <ScrollReveal>
            <div className="dr-hero__badge">
              <span>🪷</span>
              <span>शुभ विवाह</span>
              <span>🪷</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="dr-hero__invites">Together with their families</p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <h1 className="dr-hero__names font-display">
              {couple.partner1.firstName}
              <span className="dr-hero__amp">&</span>
              {couple.partner2.firstName}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <MandalaDivider />
          </ScrollReveal>

          <ScrollReveal delay={700}>
            <p className="dr-hero__invite-text">
              Request the honour of your presence at their wedding celebration
            </p>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <p className="dr-hero__date">{formatDate(wedding.date)}</p>
            <p className="dr-hero__venue">{wedding.venue.ceremony.name}</p>
          </ScrollReveal>

          <ScrollReveal delay={1000}>
            <div className="dr-hero__countdown">
              <CountdownTimer targetDate={wedding.date} variant="gold" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Animated Couple Avatars ---- */}
      {couple.avatars?.showOnWebsite && (
        <ScrollReveal>
          <CoupleAvatars
            avatars={couple.avatars}
            coupleNames={{ partner1: couple.partner1.firstName, partner2: couple.partner2.firstName }}
            variant="indian"
          />
        </ScrollReveal>
      )}

      {/* ---- Our Story ---- */}
      <section className="dr-section" id="dr-story">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="dr-section__header">
              <span className="dr-tag">🪷 Our Journey 🪷</span>
              <h2 className="dr-title font-display">Our Love Story</h2>
            </div>
          </ScrollReveal>

          <div className="dr-story__bios">
            <ScrollReveal direction="left">
              <div className="dr-bio">
                <div className="dr-bio__avatar">{couple.partner1.firstName[0]}</div>
                <h3 className="dr-bio__name font-heading">{couple.partner1.firstName} {couple.partner1.lastName}</h3>
                <p className="dr-bio__text">{couple.partner1.bio}</p>
              </div>
            </ScrollReveal>
            <div className="dr-bio__heart font-display">&</div>
            <ScrollReveal direction="right">
              <div className="dr-bio">
                <div className="dr-bio__avatar">{couple.partner2.firstName[0]}</div>
                <h3 className="dr-bio__name font-heading">{couple.partner2.firstName} {couple.partner2.lastName}</h3>
                <p className="dr-bio__text">{couple.partner2.bio}</p>
              </div>
            </ScrollReveal>
          </div>

          <div className="dr-timeline-wrap">
            <Timeline items={couple.story} variant="dark" />
          </div>
        </div>
      </section>

      {/* ---- Wedding Celebrations ---- */}
      <section className="dr-section dr-section--cream" id="dr-events">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="dr-section__header">
              <span className="dr-tag">🎊 The Celebrations 🎊</span>
              <h2 className="dr-title font-display">Wedding Events</h2>
              <p className="dr-section__subtitle">Join us through every beautiful tradition</p>
            </div>
          </ScrollReveal>

          <div className="dr-events__grid">
            {events.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 120}>
                <div className="dr-event-card">
                  <div className="dr-event-card__icon-wrap">
                    <span className="dr-event-card__icon">{getEventIcon(event.name)}</span>
                  </div>
                  <div className="dr-event-card__content">
                    <span className="dr-event-card__date"><Calendar size={13} /> {event.date}</span>
                    <h3 className="dr-event-card__title font-heading">{event.name}</h3>
                    <p className="dr-event-card__details">
                      <span><Clock size={13} /> {event.time}</span>
                      <span><MapPin size={13} /> {event.location}</span>
                    </p>
                    <p className="dr-event-card__desc">{event.description}</p>
                    {event.name === 'Wedding Ceremony' && wedding.venue?.ceremony?.photos && wedding.venue.ceremony.photos.length > 0 && (
                      <div className="dr-event-card__photos">
                        {wedding.venue.ceremony.photos.map((url, idx) => (
                          <img key={idx} src={url} alt="Venue" className="dr-event-card__photo" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="dr-dresscode">
              <Shirt size={16} />
              <span>Dress Code: <strong>{wedding.dressCode}</strong></span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Gallery ---- */}
      <section className="dr-section" id="dr-gallery">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="dr-section__header">
              <span className="dr-tag">📸 Captured Moments 📸</span>
              <h2 className="dr-title font-display">Our Gallery</h2>
            </div>
          </ScrollReveal>
          <PhotoGallery variant="dark" photos={galleryPhotos} />
        </div>
      </section>

      {/* ---- Registry / Blessings ---- */}
      <section className="dr-section dr-section--cream" id="dr-registry">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="dr-section__header">
              <span className="dr-tag">🎁 Blessings & Gifts 🎁</span>
              <h2 className="dr-title font-display">Gift Registry</h2>
              <p className="dr-section__subtitle">Your blessings and presence mean the world to us.</p>
            </div>
          </ScrollReveal>
          <div className="dr-registry__grid">
            {registryItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a href={item.url} className="dr-registry-card">
                  <Gift size={24} className="dr-registry-card__icon" />
                  <h3 className="font-heading">{item.name}</h3>
                  <p>{item.store}</p>
                  <ExternalLink size={14} className="dr-registry-card__ext" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- RSVP ---- */}
      <section className="dr-section" id="dr-rsvp">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="dr-section__header">
              <span className="dr-tag">🪷 Respond 🪷</span>
              <h2 className="dr-title font-display">RSVP</h2>
              <p className="dr-section__subtitle">We would be honoured by your gracious presence.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <RSVPForm variant="gold" weddingId={weddingId} />
          </ScrollReveal>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="dr-footer" id="dr-footer">
        <MandalaDivider />
        <p className="dr-footer__names font-display">
          {couple.partner1.firstName} & {couple.partner2.firstName}
        </p>
        <p className="dr-footer__date">{formatDate(wedding.date)}</p>
        <p className="dr-footer__hashtag">{couple.hashtag}</p>
        <p className="dr-footer__blessing">🙏 सदा सुखी रहो 🙏</p>
      </footer>
    </div>
  );
}
