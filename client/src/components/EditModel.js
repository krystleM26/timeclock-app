import React from 'react';

const EditModal = ({ entry, onChange, onCancel, onSubmit }) => {
  if (!entry) return null;

  return (
    <div style={modalStyle}>
      <form onSubmit={onSubmit} style={formStyle}>
        <h2>Edit Time Entry</h2>

        <label>Date:</label>
        <input
          type="date"
          value={entry.date?.substring(0, 10)}
          onChange={e => onChange({ ...entry, date: e.target.value })}
          required
        />

        <label>Hours Worked:</label>
        <input
          type="number"
          value={entry.hoursWorked}
          onChange={e => onChange({ ...entry, hoursWorked: e.target.value })}
          required
        />

        <label>Notes:</label>
        <textarea
          value={entry.notes}
          onChange={e => onChange({ ...entry, notes: e.target.value })}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="submit">✅ Save</button>
          <button type="button" onClick={onCancel}>❌ Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditModal;

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 999,
};

const formStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '8px',
  width: '300px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
};
