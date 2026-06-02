import React, { useState } from 'react';
import { request } from '@strapi/helper-plugin';
import pluginId from '../pluginId';

interface Note {
  id: number;
  note: string;
  created_by: string;
  created_at: string;
}

interface InternalNotesProps {
  leadId: number;
  notes: Note[];
  onNoteAdded: () => void;
}

const InternalNotes: React.FC<InternalNotesProps> = ({ leadId, notes, onNoteAdded }) => {
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      await request(`/${pluginId}/leads/${leadId}/notes`, {
        method: 'POST',
        body: { note: newNote },
      });
      setNewNote('');
      onNoteAdded();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 8, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 16px' }}>Internal Notes</h3>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add an internal note..."
          rows={3}
          style={{
            width: '100%',
            padding: 8,
            border: '1px solid #ddd',
            borderRadius: 4,
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          disabled={submitting || !newNote.trim()}
          style={{
            marginTop: 8,
            padding: '6px 16px',
            background: submitting || !newNote.trim() ? '#ccc' : '#6C5CE7',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: submitting || !newNote.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {notes.length === 0 ? (
        <p style={{ color: '#666' }}>No notes yet</p>
      ) : (
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {notes.map((note) => (
            <div key={note.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <p style={{ margin: '0 0 8px', lineHeight: 1.5 }}>{note.note}</p>
              <div style={{ fontSize: 12, color: '#666' }}>
                {note.created_by} &middot; {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternalNotes;
