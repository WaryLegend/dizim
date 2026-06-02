import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';
import LeadScoreBadge from '../components/LeadScoreBadge';
import QualificationPanel from '../components/QualificationPanel';
import InternalNotes from '../components/InternalNotes';
import ActionButtons from '../components/ActionButtons';

interface Lead {
  id: number;
  source_type: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  inquiry_type: string | null;
  expected_platform: string | null;
  monthly_orders: number | null;
  message: string | null;
  status: string;
  lead_score: number | null;
  lead_level: string | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
  activities: any[];
  notes: any[];
}

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const data = await request(`/${pluginId}/leads/${id}`, { method: 'GET' });
      setLead(data.data);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>{lead.full_name}</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>{lead.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <LeadScoreBadge score={lead.lead_score} level={lead.lead_level} />
          <span style={{
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            background: lead.status === 'new' ? '#DFE6E9' : lead.status === 'processing' ? '#74B9FF' : lead.status === 'resolved' ? '#00B894' : '#B2BEC3',
            color: lead.status === 'new' ? '#636E72' : '#fff',
          }}>
            {lead.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div>
          <LeadInfoCard lead={lead} />
          <QualificationPanel
            leadId={lead.id}
            currentScore={lead.lead_score}
            currentLevel={lead.lead_level}
            aiSummary={lead.ai_summary}
            onRequalify={fetchLead}
          />
          <InternalNotes leadId={lead.id} notes={lead.notes || []} onNoteAdded={fetchLead} />
        </div>
        <div>
          <ActivityTimeline activities={lead.activities || []} />
          <ActionButtons
            leadId={lead.id}
            currentStatus={lead.status}
            onAction={fetchLead}
          />
        </div>
      </div>
    </div>
  );
};

const LeadInfoCard: React.FC<{ lead: Lead }> = ({ lead }) => (
  <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3>Contact Information</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {[
          ['Source', lead.source_type],
          ['Phone', lead.phone || '-'],
          ['Company', lead.company || '-'],
          ['Inquiry Type', lead.inquiry_type || '-'],
          ['Expected Platform', lead.expected_platform || '-'],
          ['Monthly Orders', lead.monthly_orders?.toLocaleString() || '-'],
          ['Created', new Date(lead.created_at).toLocaleString()],
        ].map(([label, value]) => (
          <tr key={label as string}>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #eee', fontWeight: 500, width: 180 }}>{label}</td>
            <td style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>{value as string}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {lead.message && (
      <div style={{ marginTop: 16 }}>
        <h4>Message</h4>
        <p style={{ background: '#F8F9FA', padding: 16, borderRadius: 4 }}>{lead.message}</p>
      </div>
    )}
  </div>
);

const ActivityTimeline: React.FC<{ activities: any[] }> = ({ activities }) => (
  <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3>Activity Timeline</h3>
    {activities.length === 0 ? (
      <p style={{ color: '#666' }}>No activities recorded</p>
    ) : (
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {activities.map((activity: any) => (
          <div key={activity.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{
                padding: '2px 6px',
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                background: '#E8E8E8',
              }}>
                {activity.action.replace(/_/g, ' ')}
              </span>
              <span style={{ fontSize: 12, color: '#666' }}>
                {new Date(activity.created_at || activity.createdAt).toLocaleString()}
              </span>
            </div>
            {activity.performed_by && (
              <div style={{ fontSize: 12, color: '#666' }}>by {activity.performed_by}</div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default LeadDetail;
