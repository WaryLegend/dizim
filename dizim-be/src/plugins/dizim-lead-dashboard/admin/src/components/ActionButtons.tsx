import React, { useState } from 'react';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

interface ActionButtonsProps {
  leadId: number;
  currentStatus: string;
  onAction: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ leadId, currentStatus, onAction }) => {
  const [markingSpam, setMarkingSpam] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const handleMarkSpam = async () => {
    if (!confirm('Mark this lead as spam?')) return;
    setMarkingSpam(true);
    try {
      await request(`/${pluginId}/leads/${leadId}/mark-spam`, { method: 'POST' });
      onAction();
    } catch (error) {
      console.error('Failed to mark spam:', error);
    } finally {
      setMarkingSpam(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    setChangingStatus(true);
    try {
      await request(`/${pluginId}/leads/${leadId}`, {
        method: 'PUT',
        body: { status },
      });
      onAction();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setChangingStatus(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 16px' }}>Actions</h3>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Change Status</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['new', 'processing', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={changingStatus || currentStatus === status}
              style={{
                padding: '6px 12px',
                background: currentStatus === status ? '#DFE6E9' : '#fff',
                color: currentStatus === status ? '#636E72' : '#333',
                border: `1px solid ${currentStatus === status ? '#B2BEC3' : '#ddd'}`,
                borderRadius: 4,
                cursor: changingStatus || currentStatus === status ? 'not-allowed' : 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleMarkSpam}
        disabled={markingSpam || currentStatus === 'spam'}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: markingSpam ? '#ccc' : '#E74C3C',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: markingSpam || currentStatus === 'spam' ? 'not-allowed' : 'pointer',
        }}
      >
        {currentStatus === 'spam' ? 'Already Marked as Spam' : markingSpam ? 'Marking...' : 'Mark as Spam'}
      </button>
    </div>
  );
};

export default ActionButtons;
