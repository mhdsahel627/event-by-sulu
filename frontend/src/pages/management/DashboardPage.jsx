import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Sparkles, Image as ImageIcon, Inbox, Plus, ArrowRight, Phone, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total_categories: 0,
    total_designs: 0,
    total_gallery_images: 0,
    new_inquiries: 0,
    total_inquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, inquiriesData] = await Promise.all([
          api.getDashboardStats(),
          api.getInquiries(),
        ]);
        setStats(statsData || {});
        setRecentInquiries((inquiriesData || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const statCards = [
    { label: 'Total Categories', value: stats.total_categories, icon: FolderTree, color: '#C5A880', link: '/management/categories' },
    { label: 'Total Designs', value: stats.total_designs, icon: Sparkles, color: '#60A5FA', link: '/management/designs' },
    { label: 'Gallery Photos', value: stats.total_gallery_images, icon: ImageIcon, color: '#34D399', link: '/management/designs' },
    { label: 'Unread Enquiries', value: stats.new_inquiries, icon: Inbox, color: stats.new_inquiries > 0 ? '#F87171' : '#94A3B8', link: '/management/inquiries' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '28px', color: '#F8FAFC', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>
          Atelier Overview
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '15px' }}>
          Welcome back. Here is the current snapshot of your decoration catalog and customer inquiries.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              style={{
                backgroundColor: '#12151B',
                border: '1px solid #1E232E',
                borderRadius: '8px',
                padding: '24px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2E3544';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1E232E';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {card.label}
                </span>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={card.color} />
                </div>
              </div>

              <div style={{ fontSize: '36px', fontWeight: 600, color: '#F8FAFC' }}>
                {loading ? '...' : card.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div
        style={{
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '16px', color: '#F8FAFC', marginBottom: '4px' }}>Quick Catalog Actions</h3>
          <p style={{ color: '#94A3B8', fontSize: '13px' }}>Add a new category or publish a decoration design setup.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link
            to="/management/categories"
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#2A303C', color: '#E2E8F0' }}
          >
            <Plus size={14} />
            <span>Manage Categories</span>
          </Link>

          <Link
            to="/management/designs"
            className="btn btn-gold btn-sm"
          >
            <Plus size={14} />
            <span>Manage Designs & Photos</span>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Snippet */}
      <div
        style={{
          backgroundColor: '#12151B',
          border: '1px solid #1E232E',
          borderRadius: '8px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: '#F8FAFC', fontFamily: 'var(--font-serif)' }}>
            Recent Customer Inquiries
          </h3>
          <Link
            to="/management/inquiries"
            style={{ color: '#C5A880', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>View All ({stats.total_inquiries || 0})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
            No inquiries received yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentInquiries.map((inq) => (
              <div
                key={inq.id}
                style={{
                  padding: '16px',
                  borderRadius: '6px',
                  backgroundColor: inq.is_read ? '#161922' : '#1A1F2C',
                  border: inq.is_read ? '1px solid #232836' : '1px solid rgba(197, 168, 128, 0.3)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#F8FAFC', fontSize: '15px' }}>{inq.name}</span>
                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>• {inq.phone}</span>
                    {!inq.is_read && (
                      <span style={{ backgroundColor: '#EF4444', color: '#FFFFFF', fontSize: '10px', padding: '2px 6px', borderRadius: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    {inq.selected_design_title ? `Interested in: ${inq.selected_design_title} — ` : ''}
                    {inq.message?.slice(0, 90)}...
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for contacting Event by Sulu.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${inq.phone}`}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#2A303C', color: '#E2E8F0' }}
                  >
                    <Phone size={13} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
