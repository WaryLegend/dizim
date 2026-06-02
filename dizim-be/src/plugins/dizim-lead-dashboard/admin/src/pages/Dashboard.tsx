import React, { useEffect, useState } from 'react';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  byLevel: Record<string, number>;
  bySource: Record<string, number>;
  today: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await request(`/${pluginId}/stats`, { method: 'GET' });
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Lead Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard title="Total Leads" value={stats?.total || 0} color="#6C5CE7" />
        <StatCard title="Today" value={stats?.today || 0} color="#00B894" />
        <StatCard title="Hot Leads" value={stats?.byLevel?.hot || 0} color="#E74C3C" />
        <StatCard title="Spam" value={stats?.byStatus?.spam || 0} color="#95A5A6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <StatusBreakdown title="By Status" data={stats?.byStatus || {}} />
        <StatusBreakdown title="By Level" data={stats?.byLevel || {}} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
  <div style={{
    background: '#fff',
    borderRadius: 8,
    padding: 24,
    borderTop: `4px solid ${color}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }}>
    <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{title}</div>
    <div style={{ fontSize: 32, fontWeight: 'bold', color }}>{value}</div>
  </div>
);

const StatusBreakdown: React.FC<{ title: string; data: Record<string, number> }> = ({ title, data }) => (
  <div style={{
    background: '#fff',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }}>
    <h3 style={{ margin: '0 0 16px' }}>{title}</h3>
    {Object.entries(data).map(([key, value]) => (
      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
        <span style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
        <span style={{ fontWeight: 'bold' }}>{value}</span>
      </div>
    ))}
  </div>
);

export default Dashboard;
