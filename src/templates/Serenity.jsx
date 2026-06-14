import CountdownTimer from '../components/CountdownTimer';
import RSVPForm from '../components/RSVPForm';
import Timeline from '../components/Timeline';
import PhotoGallery from '../components/PhotoGallery';
import ScrollReveal from '../components/ScrollReveal';
import { coupleData, weddingDetails, events, faqItems, registryItems } from '../data/sampleData';
import { formatDate } from '../utils/helpers';
import { MapPin, Calendar, Clock, Shirt, Gift, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './Serenity.css';

export default function Serenity({ customData = {}, weddingId }) {
  const couple = customData.couple || coupleData;
  const wedding = customData.wedding || weddingDetails;
  const [openFaq, setOpenFaq] = useState(null);

  const galleryPhotos = wedding.gallery && wedding.gallery.length > 0 
    ? wedding.gallery.map((url, i) => ({ id: i, src: url, caption: `Memory ${i+1}` }))
    : undefined;

  return (
    <div className="serenity" id="serenity-template">
      {/* Hero */}
      <section className="ser-hero" id="ser-hero">
        <div className="ser-hero__content">
          <ScrollReveal>
            <p className="ser-hero__label">We're Getting Married</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="ser-hero__names font-heading">
              {couple.partner1.firstName} <span className="ser-hero__amp font-script">&</span> {couple.partner2.firstName}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="ser-hero__divider" />
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <p className="ser-hero__date">{formatDate(wedding.date)}</p>
            <p className="ser-hero__venue">{wedding.venue.ceremony.name}</p>
          </ScrollReveal>
          <ScrollReveal delay={800}>
            <div className="ser-hero__countdown">
              <CountdownTimer targetDate={wedding.date} variant="light" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="ser-section ser-story" id="ser-story">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">Our Journey</span>
              <h2 className="ser-title font-heading">Our Love Story</h2>
            </div>
          </ScrollReveal>
          <Timeline items={couple.story} variant="light" />
        </div>
      </section>

      {/* Event Details */}
      <section className="ser-section ser-events" id="ser-events">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">The Details</span>
              <h2 className="ser-title font-heading">Wedding Events</h2>
            </div>
          </ScrollReveal>

          <div className="ser-events__grid">
            {events.map((event, i) => (
              <ScrollReveal key={event.id} delay={i * 100}>
                <div className="ser-event-card">
                  <div className="ser-event-card__header">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="ser-event-card__title font-heading">{event.name}</h3>
                  <p className="ser-event-card__time"><Clock size={14} /> {event.time}</p>
                  <p className="ser-event-card__location"><MapPin size={14} /> {event.location}</p>
                  <p className="ser-event-card__desc">{event.description}</p>
                  {event.name === 'Wedding Ceremony' && wedding.venue?.ceremony?.photos && wedding.venue.ceremony.photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {wedding.venue.ceremony.photos.map((url, idx) => (
                        <img key={idx} src={url} alt="Venue" style={{ height: '140px', minWidth: '200px', borderRadius: '8px', objectFit: 'cover' }} />
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="ser-dresscode">
              <Shirt size={18} />
              <span>Dress Code: <strong>{wedding.dressCode}</strong></span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="ser-section ser-gallery" id="ser-gallery">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">Memories</span>
              <h2 className="ser-title font-heading">Our Gallery</h2>
            </div>
          </ScrollReveal>
          <PhotoGallery variant="light" photos={galleryPhotos} />
        </div>
      </section>

      {/* Registry */}
      <section className="ser-section ser-registry" id="ser-registry">
        <div className="container container-lg">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">Gifts</span>
              <h2 className="ser-title font-heading">Our Registry</h2>
              <p className="ser-section__subtitle">Your presence is the greatest gift. But if you wish to contribute, here are some options.</p>
            </div>
          </ScrollReveal>
          <div className="ser-registry__grid">
            {registryItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <a href={item.url} className="ser-registry-card">
                  <Gift size={24} />
                  <h3 className="font-heading">{item.name}</h3>
                  <p>{item.store}</p>
                  <ExternalLink size={14} className="ser-registry-card__link" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ser-section ser-faq" id="ser-faq">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">Questions</span>
              <h2 className="ser-title font-heading">Frequently Asked</h2>
            </div>
          </ScrollReveal>
          <div className="ser-faq__list">
            {faqItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`ser-faq-item ${openFaq === i ? 'ser-faq-item--open' : ''}`}>
                  <button className="ser-faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{item.question}</span>
                    {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  <div className="ser-faq-item__answer">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="ser-section ser-rsvp" id="ser-rsvp">
        <div className="container container-sm">
          <ScrollReveal>
            <div className="ser-section__header">
              <span className="ser-tag">Respond</span>
              <h2 className="ser-title font-heading">RSVP</h2>
              <p className="ser-section__subtitle">Please let us know if you'll be joining us. We can't wait to celebrate with you!</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <RSVPForm variant="light" weddingId={weddingId} />
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="ser-footer" id="ser-footer">
        <div className="container">
          <p className="ser-footer__names font-script">
            {couple.partner1.firstName} & {couple.partner2.firstName}
          </p>
          <p className="ser-footer__date">{formatDate(wedding.date)}</p>
          <p className="ser-footer__hashtag">{couple.hashtag}</p>
        </div>
      </footer>
    </div>
  );
}
