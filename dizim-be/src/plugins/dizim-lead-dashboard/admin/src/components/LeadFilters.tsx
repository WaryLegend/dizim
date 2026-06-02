import React, { useState } from 'react';

interface Filters {
  source_type?: string;
  status?: string;
  lead_level?: string;
  search?: string;
}

interface LeadFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleChange = (key: keyof Filters, value: string) => {
    const updated = { ...filters, [key]: value || undefined };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div style={{
      display: 'flex',
      gap: 12,
      padding: 16,
      background: '#fff',
      borderRadius: 8,
      marginBottom: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      flexWrap: 'wrap',
    }}>
      <input
        type="text"
        placeholder="Search by name, email, company..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: 4,
          flex: 1,
          minWidth: 200,
        }}
      />

      <select
        value={filters.source_type || ''}
        onChange={(e) => handleChange('source_type', e.target.value)}
        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
      >
        <option value="">All Sources</option>
        <option value="contact">Contact</option>
        <option value="demo">Demo</option>
        <option value="chatbot">Chatbot</option>
        <option value="cta">CTA</option>
      </select>

      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
      >
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="processing">Processing</option>
        <option value="resolved">Resolved</option>
        <option value="spam">Spam</option>
      </select>

      <select
        value={filters.lead_level || ''}
        onChange={(e) => handleChange('lead_level', e.target.value)}
        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
      >
        <option value="">All Levels</option>
        <option value="cold">Cold</option>
        <option value="warm">Warm</option>
        <option value="hot">Hot</option>
      </select>
    </div>
  );
};

export default LeadFilters;
