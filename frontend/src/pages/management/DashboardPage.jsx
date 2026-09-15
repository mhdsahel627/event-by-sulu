import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  Sparkles,
  Image as ImageIcon,
  Inbox,
  Plus,
  ArrowRight,
  Phone,
  MessageSquare,
  Settings,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export default function DashboardPage() {
  const { settings } = useSettings();
  const [stats, setStats] = useState({
    total_categories: 0,
    total_designs: 0,
    total_gallery_images: 0,
    new_inquiries: 0,
    total_inquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentDesigns, setRecentDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      try {
        const [statsData, inquiriesData, designsData] = await Promise.all([
          api.getDashboardStats(),
          api.getInquiries(),
          api.getDesigns(),
        ]);
        if (isMounted) {
          setStats(statsData || {});
          setRecentInquiries((inquiriesData || []).slice(0, 5));
          setRecentDesigns((designsData || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      label: 'Decoration Categories',
      value: stats.total_categories,
      caption: 'Active collections',
      icon: FolderTree,
      color: 'var(--apple-accent)',
      bgSubtle: 'var(--apple-accent-subtle)',
      link: '/management/categories',
    },
    {
      label: 'Published Setups',
      value: stats.total_designs,
      caption: 'Catalog portfolio',
      icon: Sparkles,
      color: 'var(--apple-blue)',
      bgSubtle: 'var(--apple-blue-subtle)',
      link: '/management/designs',
    },
    {
      label: 'Gallery Photography',
      value: stats.total_gallery_images,
      caption: 'Synced to /gallery',
      icon: ImageIcon,
      color: 'var(--apple-success)',
      bgSubtle: 'var(--apple-success-subtle)',
      link: '/management/designs',
    },
    {
      label: 'Customer Enquiries',
      value: stats.total_inquiries,
      caption: stats.new_inquiries > 0 ? `${stats.new_inquiries} unread pending` : 'All caught up',
      icon: Inbox,
      color: stats.new_inquiries > 0 ? 'var(--apple-danger)' : 'var(--apple-text-secondary)',
      bgSubtle: stats.new_inquiries > 0 ? 'var(--apple-danger-subtle)' : 'rgba(255,255,255,0.05)',
      badge: stats.new_inquiries > 0 ? `${stats.new_inquiries} New` : null,
      link: '/management/inquiries',
    },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Overview Greeting Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: 'var(--apple-radius-pill)',
              backgroundColor: 'var(--apple-success-subtle)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              color: 'var(--apple-success)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--apple-success)',
                display: 'inline-block',
                boxShadow: '0 0 8px var(--apple-success)',
              }}
            />
            <span>Atelier Operational & Online</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: 600,
              color: 'var(--apple-text-primary)',
              fontFamily: 'var(--font-serif)',
              marginBottom: '6px',
              letterSpacing: '-0.015em',
            }}
          >
            Atelier Overview
          </h1>
          <p style={{ color: 'var(--apple-text-secondary)', fontSize: '14px', margin: 0 }}>
            Live performance snapshot for {settings.business_name || 'Event by Sulu'}.
          </p>
        </div>

        {/* Live Website Shortcut */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/management/settings"
            className="apple-btn apple-btn-secondary"
            style={{ minHeight: '36px' }}
          >
            <Settings size={15} />
            <span>Site Config</span>
          </Link>
          <Link
            to="/management/designs"
            className="apple-btn apple-btn-gold"
            style={{ minHeight: '36px' }}
          >
            <Plus size={15} />
            <span>Add New Setup</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        className="dashboard-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="apple-card apple-card-interactive"
              style={{
                textDecoration: 'none',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '130px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: card.bgSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--apple-hairline)',
                  }}
                >
                  <Icon size={18} color={card.color} />
                </div>
                {card.badge && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--apple-danger)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {card.badge}
                  </span>
                )}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--apple-text-primary)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {loading ? '—' : card.value}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--apple-text-secondary)',
                    marginTop: '4px',
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--apple-text-muted)',
                    marginTop: '2px',
                  }}
                >
                  {card.caption}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Dock (iOS Control Center Inspiration) */}
      <div className="apple-card" style={{ marginBottom: '28px' }}>
        <div className="apple-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--apple-accent)" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--apple-text-primary)',
              }}
            >
              Quick Actions Dock
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>
            One-touch shortcuts
          </span>
        </div>

        <div
          className="dashboard-quick-actions-grid"
          style={{
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <Link
            to="/management/designs"
            className="apple-action-btn"
            style={{
              padding: '12px 14px',
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--apple-radius-md)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--apple-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-accent)',
              }}
            >
              <Plus size={14} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Add Design
              </div>
              <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                Publish new decor setup
              </div>
            </div>
          </Link>

          <Link
            to="/management/categories"
            className="apple-action-btn"
            style={{
              padding: '12px 14px',
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--apple-radius-md)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--apple-blue-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-blue)',
              }}
            >
              <FolderTree size={14} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Manage Categories
              </div>
              <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                Reorder & edit collections
              </div>
            </div>
          </Link>

          <Link
            to="/management/inquiries"
            className="apple-action-btn"
            style={{
              padding: '12px 14px',
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--apple-radius-md)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--apple-danger-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-danger)',
              }}
            >
              <Inbox size={14} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Review Inquiries
              </div>
              <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                WhatsApp & phone requests
              </div>
            </div>
          </Link>

          <Link
            to="/management/settings"
            className="apple-action-btn"
            style={{
              padding: '12px 14px',
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--apple-radius-md)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--apple-text-secondary)',
              }}
            >
              <Settings size={14} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Brand Settings
              </div>
              <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                Phone, email & social
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Split Grid: Recent Inquiries + Recent Designs Snapshot */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        {/* Recent Inquiries List */}
        <div className="apple-card">
          <div className="apple-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={16} color="var(--apple-accent)" />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Recent Inquiries
              </span>
            </div>
            <Link
              to="/management/inquiries"
              style={{
                color: 'var(--apple-accent)',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>View All ({stats.total_inquiries || 0})</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ padding: '8px 0' }}>
            {recentInquiries.length === 0 ? (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  color: 'var(--apple-text-muted)',
                  fontSize: '13px',
                }}
              >
                No customer inquiries yet.
              </div>
            ) : (
              recentInquiries.map((inq) => {
                const cleanPhone = inq.phone?.replace(/\D/g, '') || '';
                return (
                  <div
                    key={inq.id}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid var(--apple-hairline)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      backgroundColor: inq.is_read ? 'transparent' : 'rgba(197, 168, 128, 0.03)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: 'var(--apple-text-primary)',
                            fontSize: '14px',
                          }}
                        >
                          {inq.name}
                        </span>
                        {!inq.is_read ? (
                          <span className="apple-badge apple-badge-danger">New</span>
                        ) : (
                          <span className="apple-badge apple-badge-muted">Read</span>
                        )}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>
                        {new Date(inq.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--apple-text-secondary)' }}>
                      {inq.selected_design_title && (
                        <span style={{ color: 'var(--apple-accent-light)', fontWeight: 500 }}>
                          Interest: {inq.selected_design_title} •{' '}
                        </span>
                      )}
                      <span style={{ color: 'var(--apple-text-muted)' }}>
                        {inq.message?.slice(0, 75)}...
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '4px',
                      }}
                    >
                      {cleanPhone && (
                        <>
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                              `Hi ${inq.name}, thank you for contacting ${settings.business_name || 'Event by Sulu'}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="apple-action-btn"
                            style={{
                              backgroundColor: 'rgba(37, 211, 102, 0.12)',
                              color: '#25D366',
                              borderColor: 'rgba(37, 211, 102, 0.25)',
                            }}
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${inq.phone}`}
                            className="apple-action-btn"
                            style={{ padding: '6px 10px' }}
                          >
                            <Phone size={13} />
                            <span>Call</span>
                          </a>
                        </>
                      )}
                      <Link
                        to="/management/inquiries"
                        className="apple-action-btn"
                        style={{ marginLeft: 'auto' }}
                      >
                        <span>Details</span>
                        <ChevronRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Catalog Snapshot (Recent Published Designs) */}
        <div className="apple-card">
          <div className="apple-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--apple-accent)" />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--apple-text-primary)',
                }}
              >
                Catalog Setups Snapshot
              </span>
            </div>
            <Link
              to="/management/designs"
              style={{
                color: 'var(--apple-accent)',
                fontSize: '12px',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Manage All</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ padding: '8px 0' }}>
            {recentDesigns.length === 0 ? (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  color: 'var(--apple-text-muted)',
                  fontSize: '13px',
                }}
              >
                No decoration setups published yet.
              </div>
            ) : (
              recentDesigns.map((d) => (
                <div
                  key={d.id}
                  style={{
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apple-hairline)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {d.primary_image ? (
                      <img
                        src={d.primary_image}
                        alt={d.title}
                        style={{
                          width: '46px',
                          height: '38px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid var(--apple-hairline)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '46px',
                          height: '38px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--apple-surface-elevated)',
                          border: '1px solid var(--apple-hairline)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--apple-text-muted)',
                        }}
                      >
                        <ImageIcon size={16} />
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          color: 'var(--apple-text-primary)',
                        }}
                      >
                        {d.title}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--apple-accent)',
                          marginTop: '2px',
                        }}
                      >
                        {d.category_name}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={`/management/designs/${d.id}/images`}
                      className="apple-action-btn"
                      style={{ padding: '5px 9px', fontSize: '11px' }}
                    >
                      <ImageIcon size={12} />
                      <span>{d.images_count} Photos</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Atelier Contact & Configuration Card */}
      <div className="apple-card" style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--apple-text-primary)',
                marginBottom: '4px',
              }}
            >
              Public Brand Channels
            </div>
            <div style={{ fontSize: '12px', color: 'var(--apple-text-secondary)' }}>
              Phone: <strong>{settings.phone || '—'}</strong> • WhatsApp:{' '}
              <strong>{settings.whatsapp_number || '—'}</strong> • Email:{' '}
              <strong>{settings.email || '—'}</strong>
            </div>
          </div>

          <Link
            to="/management/settings"
            className="apple-btn apple-btn-secondary"
            style={{ fontSize: '12px', minHeight: '34px' }}
          >
            <Settings size={13} />
            <span>Update Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
