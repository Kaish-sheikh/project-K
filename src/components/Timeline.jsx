import ScrollReveal from './ScrollReveal';
import { Heart, Plane, Home, Sparkles, MapPin, Clock, Music, Coffee, Utensils, Wine } from 'lucide-react';
import './Timeline.css';

const ICONS = {
  heart: Heart,
  plane: Plane,
  home: Home,
  sparkles: Sparkles,
  mapPin: MapPin,
  clock: Clock,
  music: Music,
  coffee: Coffee,
  utensils: Utensils,
  wine: Wine,
};

export default function Timeline({ items, variant = 'light' }) {
  return (
    <div className={`timeline timeline--${variant}`} id="timeline">
      <div className="timeline__line" />
      {items.map((item, index) => {
        const Icon = ICONS[item.icon] || Heart;
        return (
          <ScrollReveal
            key={index}
            direction={index % 2 === 0 ? 'left' : 'right'}
            delay={index * 150}
          >
            <div className={`timeline__item ${index % 2 === 0 ? 'timeline__item--left' : 'timeline__item--right'}`}>
              <div className="timeline__dot">
                <Icon size={18} />
              </div>
              <div className="timeline__card">
                <span className="timeline__date">{item.date || item.time}</span>
                <h3 className="timeline__title font-heading">{item.title || item.name}</h3>
                <p className="timeline__text">{item.description}</p>
                {item.location && (
                  <p className="timeline__location">
                    <MapPin size={14} /> {item.location}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
