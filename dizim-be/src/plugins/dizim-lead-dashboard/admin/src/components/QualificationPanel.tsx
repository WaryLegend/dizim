import React, { useState } from 'react';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

interface QualificationPanelProps {
  leadId: number;
  currentScore: number | null;
  currentLevel: string | null;
  aiSummary: string | null;
  onRequalify: () => void;
}

const QualificationPanel: React.FC<QualificationPanelProps> = ({
  leadId,
  currentScore,
  currentLevel,
  aiSummary,
  onRequalify,
}) => {
  const [requalifying, setRequalifying] = useState(false);

  const handleRequalify = async () => {
    setRequalifying(true);
    try {
      await request(`/${pluginId}/leads/${leadId}/requalify`, { method: 'POST' });
      onRequalify();
    } catch (error) {
      console.error('Requalification failed:', error);
    } finally {
      setRequalifying(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>AI Qualification</h3>
        <button
          onClick={handleRequalify}
          disabled={requalifying}
          style={{
            padding: '6px 12px',
            background: requalifying ? '#ccc' : '#6C5CE7',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: requalifying ? 'not-allowed' : 'pointer',
          }}
        >
          {requalifying ? 'Re-qualifying...' : 'Re-qualify'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Score</div>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>
            {currentScore !== null ? currentScore : '-'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Level</div>
          <div style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: currentLevel?.toUpperCase() === 'HOT' ? '#E74C3C' : currentLevel?.toUpperCase() === 'WARM' ? '#F39C12' : '#3498DB',
          }}>
            {currentLevel || '-'}
          </div>
        </div>
      </div>

      {aiSummary && (
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>AI Summary</div>
          <p style={{ background: '#F8F9FA', padding: 12, borderRadius: 4, margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            {aiSummary}
          </p>
        </div>
      )}
    </div>
  );
};

export default QualificationPanel;
