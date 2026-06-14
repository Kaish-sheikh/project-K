import CountdownTimer from '../components/CountdownTimer';
import RSVPForm from '../components/RSVPForm';
import Timeline from '../components/Timeline';
import PhotoGallery from '../components/PhotoGallery';
import ScrollReveal from '../components/ScrollReveal';
import { coupleData, weddingDetails, events, registryItems } from '../data/sampleData';
import { formatDate } from '../utils/helpers';
import { MapPin, Calendar, Clock, Shirt, Gift, ExternalLink, Leaf, Flower2 } from 'lucide-react';
import './Garden.css';

export default function Garden({ customData = {}, weddingId }) {
  const couple = customData.couple || coupleData;
  const wedding = customData.wedding || weddingDetails;

  const galleryPhotos = wedding.gallery && wedding.gallery.length > 0 
    ? wedding.gallery.map((url, i) => ({ id: i, src: url, caption: `Beautiful Moment ${i+1}` }))
    : undefined;

  return (
    <div className="garden" id="garden-template">
      {/* Hero */}
      <section className="gd-hero" id="gd-hero">
        <div className="gd-hero__florals">
          <div className="gd-hero__floral gd-hero__floral--tl">🌿</div>
          <div className="gd-hero__floral gd-hero__floral--tr">🌸</div>
          <div className="gd-hero__floral gd-hero__floral--bl">🌷</div>
          <div className="gd-hero__floral gd-hero__floral--br">🍃</div>
        </div>
        <div className="gd-hero__content">
          <ScrollReveal>
            <div className="gd-hero__frame">
              <p className="gd-hero__label">Together with their families</p>
              <h1 className="gd-hero__names font-script">
                {couple.partner1.firstName} & {couple.partner2.firstName}
              </h1>
              <div className="gd-hero__flourish">
                <Leaf size={16} className="gd-hero__leaf" />
              </div>
              <p className="gd-hero__invite">invite you to celebrate their wedding</p>
              <p className="gd-hero__date">{formatDate(wedding.date)}</p>
              <p className="gd-hero__venue">{wedding.venue.ceremony.name}</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={500}>
            <div className="gd-hero__countdown">
              <CountdownTimer targetDate={wedding.date} variant="light" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="gd-section gd-section--blush" id="gd-story">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="gd-section__header">
              <Flower2 size={20} className="gd-section__icon" />
              <h2 className="gd-title font-script">Our Love Story</h2>
            </div>
          </ScrollReveal>
          <div className="gd-story__bios">
            <ScrollReveal direction="left">
              <div className="gd-bio">
                <div className="gd-bio__avatar">{couple.partner1.firstName[0]}</div>
                <h3 className="gd-bio__name font-heading">{couple.partner1.firstName} {couple.partner1.lastName}</h3>
                <p className="gd-bio__text">{couple.partner1.bio}</p>
              </div>
            </ScrollReveal>
            <div className="gd-bio__heart font-script">&</div>
            <ScrollReveal direction="right">
              <div className="gd-bio">
                <div className="gd-bio__avatar">{couple.partner2.firstName[0]}</div>
                <h3 className="gd-bio__name font-heading">{couple.partner2.firstName} {couple.partner2.lastName}</h3>
                <p className="gd-bio__text">{couple.partner2.bio}</p>
              </div>
            </ScrollReveal>
          </div>
          <div className="gd-timeline-wrap">
            <Timeline items={couple.story} variant="light" />
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="gd-section" id="gd-events">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="gd-section__header">
              <Flower2 size={20} className="gd-section__icon" />
              <h2 className="gd-title font-script">Wedding Celebrations</h2>
            </div>
          </ScrollReveal>

          <div className="gd-events__list">
            {events.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 100}>
                <div className="gd-event-card">
                  <div className="gd-event-card__leaf">🌿</div>
                  <div className="gd-event-card__content">
                    <span className="gd-event-card__date"><Calendar size={14} /> {event.date}</span>
                    <h3 className="gd-event-card__title font-heading">{event.name}</h3>
                    <p className="gd-event-card__info"><Clock size={14} /> {event.time} · <MapPin size={14} /> {event.location}</p>
                    <p className="gd-event-card__desc">{event.description}</p>
                    {event.name === 'Wedding Ceremony' && wedding.venue?.ceremony?.photos && wedding.venue.ceremony.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {wedding.venue.ceremony.photos.map((url, idx) => (
                          <img key={idx} src={url} alt="Venue" style={{ height: '120px', minWidth: '160px', borderRadius: '8px', objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="gd-dresscode">
              <Shirt size={16} />
              <span>Dress Code: <strong>{wedding.dressCode}</strong></span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="gd-section gd-section--blush" id="gd-gallery">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="gd-section__header">
              <Flower2 size={20} className="gd-section__icon" />
              <h2 className="gd-title font-script">Our Moments</h2>
            </div>
          </ScrollReveal>
          <PhotoGallery variant="light" photos={galleryPhotos} />
        </div>
      </section>

      {/* Registry */}
      <section className="gd-section" id="gd-registry">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="gd-section__header">
              <Flower2 size={20} className="gd-section__icon" />
              <h2 className="gd-title font-script">Gift Registry</h2>
              <p className="gd-section__subtitle">Your presence at our wedding is the greatest gift of all.</p>
            </div>
          </ScrollReveal>
          <div className="gd-registry__grid">
            {registryItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a href={item.url} className="gd-registry-card">
                  <Gift size={24} className="gd-registry-card__icon" />
                  <h3 className="font-heading">{item.name}</h3>
                  <p>{item.store}</p>
                  <ExternalLink size={14} className="gd-registry-card__ext" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="gd-section gd-section--blush" id="gd-rsvp">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="gd-section__header">
              <Flower2 size={20} className="gd-section__icon" />
              <h2 className="gd-title font-script">Kindly Respond</h2>
              <p className="gd-section__subtitle">We can't wait to celebrate with you!</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <RSVPForm variant="light" weddingId={weddingId} />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="gd-footer" id="gd-footer">
        <div className="gd-footer__florals">🌸 🌿 🌷</div>
        <p className="gd-footer__names font-script">
          {couple.partner1.firstName} & {couple.partner2.firstName}
        </p>
        <p className="gd-footer__date">{formatDate(wedding.date)}</p>
        <p className="gd-footer__hashtag">{couple.hashtag}</p>
      </footer>
    </div>
  );
}
