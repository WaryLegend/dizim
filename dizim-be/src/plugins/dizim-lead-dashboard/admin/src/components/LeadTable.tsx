import React from 'react';
import LeadScoreBadge from './LeadScoreBadge';

interface Lead {
  id: number;
  source_type: string;
  full_name: string;
  email: string;
  company: string | null;
  status: string;
  lead_score: number | null;
  lead_level: string | null;
  created_at: string;
}

interface LeadTableProps {
  leads: Lead[];
  onRowClick: (id: number) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onRowClick }) => {
  const statusColors: Record<string, string> = {
    new: '#DFE6E9',
    processing: '#74B9FF',
    resolved: '#00B894',
    spam: '#B2BEC3',
  };

  if (leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: '#666' }}>
        No leads found
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Name</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Email</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Source</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Score</th>
            <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', color: '#666' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              onClick={() => onRowClick(lead.id)}
              style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F8F9FA'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
            >
              <td style={{ padding: '12px 16px', fontWeight: 500 }}>{lead.full_name}</td>
              <td style={{ padding: '12px 16px', color: '#666' }}>{lead.email}</td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>{lead.source_type}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 3,
                  fontSize: 12,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  background: statusColors[lead.status] || '#DFE6E9',
                  color: lead.status === 'new' ? '#636E72' : '#fff',
                }}>
                  {lead.status}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <LeadScoreBadge score={lead.lead_score} level={lead.lead_level} />
              </td>
              <td style={{ padding: '12px 16px', color: '#666', fontSize: 13 }}>
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
