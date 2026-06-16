import CountdownTimer from '../components/CountdownTimer';
import CoupleAvatars from '../components/CoupleAvatars';
import RSVPForm from '../components/RSVPForm';
import Timeline from '../components/Timeline';
import PhotoGallery from '../components/PhotoGallery';
import ScrollReveal from '../components/ScrollReveal';
import { coupleData, weddingDetails, events, faqItems, registryItems } from '../data/sampleData';
import { formatDate } from '../utils/helpers';
import { MapPin, Calendar, Clock, Shirt, Gift, ExternalLink, Sparkles } from 'lucide-react';
import './Opulence.css';

export default function Opulence({ customData = {}, weddingId }) {
  const couple = customData.couple || coupleData;
  const wedding = customData.wedding || weddingDetails;

  const galleryPhotos = wedding.gallery && wedding.gallery.length > 0 
    ? wedding.gallery.map((url, i) => ({ id: i, src: url, caption: `Memory ${i+1}` }))
    : undefined;

  return (
    <div className="opulence" id="opulence-template">
      {/* Hero */}
      <section className="op-hero" id="op-hero">
        <div className="op-hero__overlay" />
        <div className="op-hero__deco op-hero__deco--tl" />
        <div className="op-hero__deco op-hero__deco--br" />
        <div className="op-hero__content">
          <ScrollReveal>
            <div className="op-hero__badge">
              <Sparkles size={14} />
              <span>The Wedding of</span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="op-hero__names font-display">
              {couple.partner1.firstName}
              <span className="op-hero__amp">&</span>
              {couple.partner2.firstName}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="op-hero__ornament">
              <div className="op-hero__line" />
              <Sparkles size={16} className="op-hero__star" />
              <div className="op-hero__line" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <p className="op-hero__date">{formatDate(wedding.date)}</p>
            <p className="op-hero__venue">{wedding.venue.ceremony.name}</p>
          </ScrollReveal>
          <ScrollReveal delay={800}>
            <div className="op-hero__countdown">
              <CountdownTimer targetDate={wedding.date} variant="gold" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Animated Couple Avatars */}
      {couple.avatars?.showOnWebsite && (
        <ScrollReveal>
          <CoupleAvatars
            avatars={couple.avatars}
            coupleNames={{ partner1: couple.partner1.firstName, partner2: couple.partner2.firstName }}
            variant="dark"
          />
        </ScrollReveal>
      )}

      {/* Our Story */}
      <section className="op-section" id="op-story">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="op-section__header">
              <Sparkles size={14} className="op-section__star" />
              <span className="op-tag">Our Journey</span>
              <h2 className="op-title font-display">How It All Began</h2>
            </div>
          </ScrollReveal>
          <Timeline items={couple.story} variant="dark" />
        </div>
      </section>

      {/* Events */}
      <section className="op-section op-section--alt" id="op-events">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="op-section__header">
              <Sparkles size={14} className="op-section__star" />
              <span className="op-tag">The Celebration</span>
              <h2 className="op-title font-display">Wedding Events</h2>
            </div>
          </ScrollReveal>

          <div className="op-events__grid">
            {events.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 120}>
                <div className="op-event-card">
                  <div className="op-event-card__glow" />
                  <div className="op-event-card__date">
                    <Calendar size={14} /> {event.date}
                  </div>
                  <h3 className="op-event-card__title font-display">{event.name}</h3>
                  <div className="op-event-card__details">
                    <span><Clock size={14} /> {event.time}</span>
                    <span><MapPin size={14} /> {event.location}</span>
                  </div>
                  <p className="op-event-card__desc">{event.description}</p>
                  {event.name === 'Wedding Ceremony' && wedding.venue?.ceremony?.photos && wedding.venue.ceremony.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {wedding.venue.ceremony.photos.map((url, idx) => (
                        <img key={idx} src={url} alt="Venue" style={{ height: '140px', minWidth: '200px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(212, 175, 55, 0.2)' }} />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="op-dresscode">
              <Shirt size={16} />
              <span>Dress Code: <strong>{wedding.dressCode}</strong></span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="op-section" id="op-gallery">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="op-section__header">
              <Sparkles size={14} className="op-section__star" />
              <span className="op-tag">Captured Moments</span>
              <h2 className="op-title font-display">Our Gallery</h2>
            </div>
          </ScrollReveal>
          <PhotoGallery variant="dark" photos={galleryPhotos} />
        </div>
      </section>

      {/* Registry */}
      <section className="op-section op-section--alt" id="op-registry">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="op-section__header">
              <Sparkles size={14} className="op-section__star" />
              <span className="op-tag">Gifts</span>
              <h2 className="op-title font-display">Our Registry</h2>
              <p className="op-section__subtitle">Your love and presence mean the world to us.</p>
            </div>
          </ScrollReveal>
          <div className="op-registry__grid">
            {registryItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a href={item.url} className="op-registry-card">
                  <Gift size={24} className="op-registry-card__icon" />
                  <h3 className="font-display">{item.name}</h3>
                  <p>{item.store}</p>
                  <ExternalLink size={14} className="op-registry-card__ext" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="op-section" id="op-rsvp">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="op-section__header">
              <Sparkles size={14} className="op-section__star" />
              <span className="op-tag">Respond</span>
              <h2 className="op-title font-display">RSVP</h2>
              <p className="op-section__subtitle">We would be honored by your presence.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <RSVPForm variant="gold" weddingId={weddingId} />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="op-footer" id="op-footer">
        <div className="op-footer__ornament">
          <div className="op-footer__line" />
          <Sparkles size={18} className="op-footer__star" />
          <div className="op-footer__line" />
        </div>
        <p className="op-footer__names font-display">
          {couple.partner1.firstName} & {couple.partner2.firstName}
        </p>
        <p className="op-footer__date">{formatDate(wedding.date)}</p>
        <p className="op-footer__hashtag">{couple.hashtag}</p>
      </footer>
    </div>
  );
}
