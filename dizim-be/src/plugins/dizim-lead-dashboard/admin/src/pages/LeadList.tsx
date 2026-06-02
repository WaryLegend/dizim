import React, { useEffect, useState, useCallback } from 'react';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';
import LeadFilters from '../components/LeadFilters';
import LeadTable from '../components/LeadTable';
import LeadScoreBadge from '../components/LeadScoreBadge';

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

interface Filters {
  source_type?: string;
  status?: string;
  lead_level?: string;
  search?: string;
}

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 25;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.source_type) query.set('source_type', filters.source_type);
      if (filters.status) query.set('status', filters.status);
      if (filters.lead_level) query.set('lead_level', filters.lead_level);
      if (filters.search) query.set('search', filters.search);
      query.set('_start', String(page * limit));
      query.set('_limit', String(limit));

      const data = await request(`/${pluginId}/leads?${query.toString()}`, { method: 'GET' });
      setLeads(data.data || []);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleExportCSV = async () => {
    try {
      const result = await request(`/${pluginId}/export`, {
        method: 'POST',
        body: filters,
      });
      alert(`Export started. Job ID: ${result.jobId}`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Leads</h1>
        <button
          onClick={handleExportCSV}
          style={{
            padding: '8px 16px',
            background: '#6C5CE7',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>

      <LeadFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <LeadTable
            leads={leads}
            onRowClick={(id) => {
              window.location.href = `/admin/plugins/${pluginId}/leads/${id}`;
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{ padding: '8px 16px' }}
            >
              Previous
            </button>
            <span>Page {page + 1}</span>
            <button
              disabled={leads.length < limit}
              onClick={() => setPage(p => p + 1)}
              style={{ padding: '8px 16px' }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadList;
