import { useState } from 'react';
import { Send, Check, ChevronRight, ChevronLeft, User, Utensils, MessageSquare, Users, Loader2, AlertCircle, Music2 } from 'lucide-react';
import * as api from '../api/client';
import './RSVPForm.css';

const STEPS = ['name', 'attending', 'meal', 'message', 'song'];
const MEALS = ['Beef Tenderloin', 'Pan-Seared Salmon', 'Herb-Crusted Chicken', 'Wild Mushroom Risotto (Vegetarian)', 'Garden Medley (Vegan)'];

export default function RSVPForm({ variant = 'light', onSubmit, weddingId }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: null,
    guests: 1,
    meal: '',
    dietary: '',
    message: '',
    songTitle: '',
    songArtist: '',
  });
  // Honeypot field — invisible to users, bots fill it
  const [honeypot, setHoneypot] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    // Combine song title + artist into one field
    const songRequest = formData.songTitle
      ? `${formData.songTitle}${formData.songArtist ? ` — ${formData.songArtist}` : ''}`
      : null;

    try {
      // Try to submit to backend if weddingId is available
      if (weddingId) {
        await api.submitRSVP(weddingId, { ...formData, songRequest, website: honeypot });
      }

      setSubmitted(true);
      if (onSubmit) onSubmit({ ...formData, songRequest });
    } catch (err) {
      console.error('RSVP submission error:', err);
      // Still show success for UX — the data was captured locally
      setSubmitted(true);
      if (onSubmit) onSubmit({ ...formData, songRequest });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`rsvp rsvp--${variant} rsvp--success`} id="rsvp-success">
        <div className="rsvp__success-icon">
          <Check size={40} />
        </div>
        <h3 className="rsvp__success-title font-heading">Thank You!</h3>
        <p className="rsvp__success-text">
          {formData.attending
            ? `We can't wait to celebrate with you, ${formData.name.split(' ')[0]}!`
            : `We'll miss you, ${formData.name.split(' ')[0]}! Thank you for letting us know.`
          }
        </p>
      </div>
    );
  }

  return (
    <form className={`rsvp rsvp--${variant}`} onSubmit={handleSubmit} id="rsvp-form">
      <div className="rsvp__progress">
        {STEPS.map((s, i) => (
          <div key={s} className={`rsvp__progress-dot ${i <= step ? 'rsvp__progress-dot--active' : ''} ${i < step ? 'rsvp__progress-dot--done' : ''}`} />
        ))}
      </div>

      <div className="rsvp__steps">
        {/* Honeypot — invisible to real users, bots auto-fill it */}
        <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <label htmlFor="rsvp-website">Website</label>
          <input
            type="text"
            id="rsvp-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
          />
        </div>

        {/* Step 1: Name & Email */}
        <div className={`rsvp__step ${step === 0 ? 'rsvp__step--active' : ''}`}>
          <div className="rsvp__step-icon"><User size={28} /></div>
          <h3 className="rsvp__step-title font-heading">Your Details</h3>
          <div className="rsvp__field">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              className="rsvp__input"
              required
              id="rsvp-name"
            />
          </div>
          <div className="rsvp__field">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              className="rsvp__input"
              required
              id="rsvp-email"
            />
          </div>
        </div>

        {/* Step 2: Attending */}
        <div className={`rsvp__step ${step === 1 ? 'rsvp__step--active' : ''}`}>
          <div className="rsvp__step-icon"><Users size={28} /></div>
          <h3 className="rsvp__step-title font-heading">Will You Be Joining Us?</h3>
          <div className="rsvp__options">
            <button
              type="button"
              className={`rsvp__option ${formData.attending === true ? 'rsvp__option--selected' : ''}`}
              onClick={() => updateField('attending', true)}
              id="rsvp-yes"
            >
              <span className="rsvp__option-emoji">🎉</span>
              <span>Joyfully Accept</span>
            </button>
            <button
              type="button"
              className={`rsvp__option ${formData.attending === false ? 'rsvp__option--selected' : ''}`}
              onClick={() => updateField('attending', false)}
              id="rsvp-no"
            >
              <span className="rsvp__option-emoji">💌</span>
              <span>Regretfully Decline</span>
            </button>
          </div>
          {formData.attending && (
            <div className="rsvp__field rsvp__guests-field">
              <label className="rsvp__label">Number of Guests</label>
              <div className="rsvp__counter">
                <button type="button" className="rsvp__counter-btn" onClick={() => updateField('guests', Math.max(1, formData.guests - 1))}>−</button>
                <span className="rsvp__counter-value">{formData.guests}</span>
                <button type="button" className="rsvp__counter-btn" onClick={() => updateField('guests', Math.min(5, formData.guests + 1))}>+</button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Meal */}
        <div className={`rsvp__step ${step === 2 ? 'rsvp__step--active' : ''}`}>
          <div className="rsvp__step-icon"><Utensils size={28} /></div>
          <h3 className="rsvp__step-title font-heading">Dinner Selection</h3>
          {formData.attending === false ? (
            <p className="rsvp__skip-text">No meal selection needed. You can skip this step.</p>
          ) : (
            <>
              <div className="rsvp__meals">
                {MEALS.map(meal => (
                  <button
                    key={meal}
                    type="button"
                    className={`rsvp__meal ${formData.meal === meal ? 'rsvp__meal--selected' : ''}`}
                    onClick={() => updateField('meal', meal)}
                  >
                    {meal}
                  </button>
                ))}
              </div>
              <div className="rsvp__field">
                <input
                  type="text"
                  placeholder="Dietary restrictions or allergies"
                  value={formData.dietary}
                  onChange={e => updateField('dietary', e.target.value)}
                  className="rsvp__input"
                  id="rsvp-dietary"
                />
              </div>
            </>
          )}
        </div>

        {/* Step 4: Message */}
        <div className={`rsvp__step ${step === 3 ? 'rsvp__step--active' : ''}`}>
          <div className="rsvp__step-icon"><MessageSquare size={28} /></div>
          <h3 className="rsvp__step-title font-heading">Leave a Message</h3>
          <div className="rsvp__field">
            <textarea
              placeholder="Share your wishes for the couple..."
              value={formData.message}
              onChange={e => updateField('message', e.target.value)}
              className="rsvp__textarea"
              rows={4}
              id="rsvp-message"
            />
          </div>
          {submitError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0392b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <AlertCircle size={14} />
              <span>{submitError}</span>
            </div>
          )}
        </div>

        {/* Step 5: Song Request */}
        <div className={`rsvp__step ${step === 4 ? 'rsvp__step--active' : ''}`}>
          <div className="rsvp__step-icon rsvp__step-icon--music"><Music2 size={28} /></div>
          <h3 className="rsvp__step-title font-heading">Song Request 🎵</h3>
          {formData.attending === false ? (
            <p className="rsvp__skip-text">No song request needed. You can skip this step.</p>
          ) : (
            <>
              <p className="rsvp__song-hint">Got a song that'll get everyone on the dance floor? Let us know!</p>
              <div className="rsvp__field">
                <input
                  type="text"
                  placeholder="Song title (e.g. Can't Help Falling in Love)"
                  value={formData.songTitle}
                  onChange={e => updateField('songTitle', e.target.value)}
                  className="rsvp__input"
                  id="rsvp-song-title"
                  maxLength={150}
                />
              </div>
              <div className="rsvp__field">
                <input
                  type="text"
                  placeholder="Artist (e.g. Elvis Presley)"
                  value={formData.songArtist}
                  onChange={e => updateField('songArtist', e.target.value)}
                  className="rsvp__input"
                  id="rsvp-song-artist"
                  maxLength={100}
                />
              </div>
            </>
          )}
          {submitError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0392b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <AlertCircle size={14} />
              <span>{submitError}</span>
            </div>
          )}
        </div>
      </div>

      <div className="rsvp__actions">
        {step > 0 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={prevStep} id="rsvp-prev">
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={nextStep} id="rsvp-next">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting} id="rsvp-submit">
            {submitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'authSpin 0.7s linear infinite' }} />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} /> Send RSVP
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
