import { useState, useEffect } from 'react';
import { getCountdown } from '../utils/helpers';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate, variant = 'light' }) {
  const [time, setTime] = useState(getCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.passed) {
    return (
      <div className={`countdown countdown--${variant}`}>
        <p className="countdown__passed font-heading">The celebration has begun!</p>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ];

  return (
    <div className={`countdown countdown--${variant}`} id="countdown-timer">
      {units.map((unit, i) => (
        <div key={unit.label} className="countdown__unit" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="countdown__card">
            <span className="countdown__value">{String(unit.value).padStart(2, '0')}</span>
          </div>
          <span className="countdown__label">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
