import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, UserCheck, UserX, Clock, Search, Download,
  Filter, BarChart3, Eye, Settings, Bell, TrendingUp,
  Utensils, ArrowLeft, Loader2, RefreshCw, LogOut, Trash2, Music2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/client';
import { getRSVPStats } from '../utils/helpers';
import './Dashboard.css';

const MEAL_COLORS = {
  beef: '#C75050',
  'beef tenderloin': '#C75050',
  fish: '#5B8BA8',
  'pan-seared salmon': '#5B8BA8',
  chicken: '#D4A037',
  'herb-crusted chicken': '#D4A037',
  vegetarian: '#6B9B6B',
  'wild mushroom risotto (vegetarian)': '#6B9B6B',
  vegan: '#8BA888',
  'garden medley (vegan)': '#8BA888',
};

function getMealColor(meal) {
  if (!meal) return '#ccc';
  const key = meal.toLowerCase();
  return MEAL_COLORS[key] || '#ccc';
}

function MiniPieChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 140;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const total = Object.values(data).reduce((s, v) => s + v, 0);
    if (total === 0) return;

    let startAngle = -Math.PI / 2;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 50;
    const innerRadius = 30;

    Object.entries(data).forEach(([key, value]) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const color = getMealColor(key);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      startAngle += sliceAngle;
    });
  }, [data]);

  return <canvas ref={canvasRef} style={{ width: 140, height: 140 }} />;
}

export default function Dashboard() {
  const { weddingId, logout, user } = useAuth();
  const [guests, setGuests] = useState([]);
  const [songs, setSongs] = useState([]);
  const [stats, setStats] = useState({ total: 0, attending: 0, declined: 0, pending: 0, totalGuests: 0, totalSongs: 0, meals: {}, attendingPercent: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async (showRefresh = false) => {
    if (!weddingId) return;

    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [guestsData, statsData, songsData] = await Promise.all([
        api.getGuests(weddingId),
        api.getStats(weddingId),
        api.getSongs(weddingId),
      ]);
      setGuests(guestsData);
      setStats(statsData);
      setSongs(songsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Fall back to computing stats locally if stats endpoint fails
      if (guests.length > 0) {
        setStats(getRSVPStats(guests));
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [weddingId]);

  const handleDeleteGuest = async (guestId) => {
    if (!confirm('Remove this guest?')) return;
    try {
      await api.deleteGuest(guestId);
      loadData(true);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || g.rsvp === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    const headers = 'Name,Email,RSVP,Meal,Guests,Message,Song Request\n';
    const rows = guests.map(g =>
      `"${g.name}","${g.email}","${g.rsvp}","${g.meal || ''}",${g.guests},"${g.message}","${g.songRequest || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard" id="dashboard-page">
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '0.75rem', color: 'var(--color-muted)' }}>
          <Loader2 size={20} style={{ animation: 'authSpin 0.7s linear infinite' }} />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard" id="dashboard-page">
      <Navbar />

      <div className="dashboard__layout">
        {/* Sidebar Nav */}
        <aside className="dashboard__nav">
          <div className="dashboard__nav-section">
            <Link to="/" className="dashboard__nav-back" id="dash-back">
              <ArrowLeft size={16} /> Back to Site
            </Link>
          </div>
          <nav className="dashboard__nav-links">
            <a href="#" className="dashboard__nav-link dashboard__nav-link--active" id="dash-nav-overview">
              <BarChart3 size={18} /> Overview
            </a>
            <a href="#" className="dashboard__nav-link" id="dash-nav-guests">
              <Users size={18} /> Guest List
            </a>
            <a href="#" className="dashboard__nav-link" id="dash-nav-site">
              <Eye size={18} /> My Website
            </a>
            <a href="#" className="dashboard__nav-link" id="dash-nav-settings">
              <Settings size={18} /> Settings
            </a>
          </nav>
          <div style={{ marginTop: 'auto', padding: '1rem' }}>
            <button
              className="dashboard__nav-link"
              onClick={logout}
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-muted)', fontSize: '0.85rem', padding: '0.6rem 0.75rem', borderRadius: '8px' }}
              id="dash-logout"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard__main">
          <div className="dashboard__header">
            <div>
              <h1 className="dashboard__title font-heading">Wedding Dashboard</h1>
              <p className="dashboard__subtitle">
                {user ? `Welcome, ${user.name}` : 'Manage your guest list, RSVPs, and more.'}
              </p>
            </div>
            <div className="dashboard__header-actions">
              <button
                className="dashboard__notif"
                onClick={() => loadData(true)}
                title="Refresh data"
                id="dash-refresh"
                style={{ position: 'relative' }}
              >
                <RefreshCw size={18} style={refreshing ? { animation: 'authSpin 0.7s linear infinite' } : {}} />
              </button>
              <button className="dashboard__notif" id="dash-notifications">
                <Bell size={18} />
                {stats.pending > 0 && (
                  <span className="dashboard__notif-badge">{stats.pending}</span>
                )}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard__stats" id="dash-stats">
            <div className="stat-card stat-card--total">
              <div className="stat-card__icon"><Users size={20} /></div>
              <div className="stat-card__info">
                <span className="stat-card__value">{stats.total}</span>
                <span className="stat-card__label">Total Invited</span>
              </div>
            </div>
            <div className="stat-card stat-card--attending">
              <div className="stat-card__icon"><UserCheck size={20} /></div>
              <div className="stat-card__info">
                <span className="stat-card__value">{stats.attending}</span>
                <span className="stat-card__label">Attending</span>
              </div>
              <span className="stat-card__badge">{stats.totalGuests} guests</span>
            </div>
            <div className="stat-card stat-card--declined">
              <div className="stat-card__icon"><UserX size={20} /></div>
              <div className="stat-card__info">
                <span className="stat-card__value">{stats.declined}</span>
                <span className="stat-card__label">Declined</span>
              </div>
            </div>
            <div className="stat-card stat-card--pending">
              <div className="stat-card__icon"><Clock size={20} /></div>
              <div className="stat-card__info">
                <span className="stat-card__value">{stats.pending}</span>
                <span className="stat-card__label">Pending</span>
              </div>
            </div>
            <div className="stat-card stat-card--songs">
              <div className="stat-card__icon"><Music2 size={20} /></div>
              <div className="stat-card__info">
                <span className="stat-card__value">{stats.totalSongs || 0}</span>
                <span className="stat-card__label">Song Requests</span>
              </div>
            </div>
          </div>

          {/* Charts & Meals Row */}
          <div className="dashboard__charts">
            <div className="chart-card" id="dash-response-rate">
              <h3 className="chart-card__title">Response Rate</h3>
              <div className="chart-card__bar-wrap">
                <div className="chart-card__bar">
                  <div className="chart-card__bar-fill chart-card__bar-fill--attending" style={{ width: `${stats.total > 0 ? (stats.attending / stats.total) * 100 : 0}%` }} />
                  <div className="chart-card__bar-fill chart-card__bar-fill--declined" style={{ width: `${stats.total > 0 ? (stats.declined / stats.total) * 100 : 0}%` }} />
                </div>
                <div className="chart-card__legend">
                  <span className="chart-card__legend-item"><span className="chart-card__dot chart-card__dot--attending" /> Attending ({stats.attending})</span>
                  <span className="chart-card__legend-item"><span className="chart-card__dot chart-card__dot--declined" /> Declined ({stats.declined})</span>
                  <span className="chart-card__legend-item"><span className="chart-card__dot chart-card__dot--pending" /> Pending ({stats.pending})</span>
                </div>
              </div>
              <div className="chart-card__percent">
                <TrendingUp size={16} />
                <span>{stats.attendingPercent}% response rate</span>
              </div>
            </div>

            <div className="chart-card" id="dash-meals">
              <h3 className="chart-card__title">Meal Preferences</h3>
              {Object.keys(stats.meals).length > 0 ? (
                <div className="chart-card__pie-wrap">
                  <MiniPieChart data={stats.meals} />
                  <div className="chart-card__pie-legend">
                    {Object.entries(stats.meals).map(([meal, count]) => (
                      <div key={meal} className="chart-card__pie-item">
                        <span className="chart-card__dot" style={{ background: getMealColor(meal) }} />
                        <span>{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                        <span className="chart-card__pie-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                  No meal selections yet
                </div>
              )}
            </div>
          </div>

          {/* Guest List Table */}
          <div className="dashboard__table-section" id="dash-guest-list">
            <div className="dashboard__table-header">
              <h3 className="dashboard__table-title font-heading">Guest List</h3>
              <div className="dashboard__table-controls">
                <div className="dashboard__search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search guests..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="dashboard__search-input"
                    id="dash-search"
                  />
                </div>
                <div className="dashboard__filters">
                  {['all', 'attending', 'declined', 'pending'].map(status => (
                    <button
                      key={status}
                      className={`dashboard__filter ${filterStatus === status ? 'dashboard__filter--active' : ''}`}
                      onClick={() => setFilterStatus(status)}
                      id={`dash-filter-${status}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={exportCSV} id="dash-export">
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="dashboard__table-wrap">
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Email</th>
                    <th>RSVP</th>
                    <th>Meal</th>
                    <th>Guests</th>
                    <th>Song Request</th>
                    <th>Message</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map(guest => (
                    <tr key={guest.id}>
                      <td className="dashboard__td-name">{guest.name}</td>
                      <td className="dashboard__td-email">{guest.email}</td>
                      <td>
                        <span className={`dashboard__status dashboard__status--${guest.rsvp}`}>
                          {guest.rsvp}
                        </span>
                      </td>
                      <td>{guest.meal || '—'}</td>
                      <td>{guest.guests}</td>
                      <td className="dashboard__td-song">
                        {guest.songRequest ? (
                          <span className="dashboard__song-badge">
                            <Music2 size={12} />
                            {guest.songRequest}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="dashboard__td-message">{guest.message || '—'}</td>
                      <td>
                        <button
                          className="dashboard__delete-btn"
                          onClick={() => handleDeleteGuest(guest.id)}
                          title="Remove guest"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '4px', borderRadius: '4px', transition: 'color 0.2s' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredGuests.length === 0 && (
                <div className="dashboard__empty">
                  <p>{guests.length === 0 ? 'No RSVPs received yet. Share your wedding link to start collecting responses!' : 'No guests match your search.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Song Requests Panel */}
          <div className="dashboard__songs-section" id="dash-songs">
            <div className="dashboard__songs-header">
              <h3 className="dashboard__table-title font-heading">
                <Music2 size={20} /> Song Requests
              </h3>
              <span className="dashboard__songs-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            </div>
            {songs.length > 0 ? (
              <div className="dashboard__songs-grid">
                {songs.map((song, idx) => {
                  const parts = song.songRequest.split(' — ');
                  const title = parts[0];
                  const artist = parts[1] || null;
                  return (
                    <div key={idx} className="song-card" id={`song-card-${idx}`}>
                      <div className="song-card__icon">
                        <Music2 size={18} />
                      </div>
                      <div className="song-card__info">
                        <span className="song-card__title">{title}</span>
                        {artist && <span className="song-card__artist">{artist}</span>}
                        <span className="song-card__guest">Requested by {song.guestName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="dashboard__songs-empty">
                <Music2 size={40} style={{ opacity: 0.2 }} />
                <p>No song requests yet. They'll appear here after guests RSVP!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
