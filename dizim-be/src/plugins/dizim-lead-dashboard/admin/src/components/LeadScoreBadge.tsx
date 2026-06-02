import React from 'react';

interface LeadScoreBadgeProps {
  score: number | null;
  level: string | null;
}

const levelColors: Record<string, string> = {
  HOT: '#E74C3C',
  WARM: '#F39C12',
  COLD: '#3498DB',
};

const levelBackgrounds: Record<string, string> = {
  HOT: '#FDEDEC',
  WARM: '#FEF5E7',
  COLD: '#EBF5FB',
};

const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({ score, level }) => {
  if (!score && !level) {
    return <span style={{ color: '#95A5A6', fontSize: 13 }}>Not scored</span>;
  }

  const normalizedLevel = (level || 'COLD').toUpperCase();
  const color = levelColors[normalizedLevel] || '#95A5A6';
  const bg = levelBackgrounds[normalizedLevel] || '#F8F9FA';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold',
      background: bg,
      color,
    }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
      }} />
      <span>{normalizedLevel}</span>
      {score !== null && score !== undefined && (
        <span style={{ opacity: 0.7 }}>({score})</span>
      )}
    </span>
  );
};

export default LeadScoreBadge;
