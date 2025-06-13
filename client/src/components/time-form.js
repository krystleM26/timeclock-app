import React from 'react';

const TimeEntryForm = ({ formData, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '2rem' }}>
      <div>
        <label>First Name:</label><br />
        <input
          type="text"
          value={formData.firstName}
          required
          onChange={e => onChange({ ...formData, firstName: e.target.value })}
        />
      </div>

      <div>
        <label>Last Name:</label><br />
        <input
          type="text"
          value={formData.lastName}
          required
          onChange={e => onChange({ ...formData, lastName: e.target.value })}
        />
      </div>

      <div>
        <label>Date:</label><br />
        <input
          type="date"
          value={formData.date}
          required
          onChange={e => onChange({ ...formData, date: e.target.value })}
        />
      </div>

      <div>
        <label>Hours Worked:</label><br />
        <input
          type="number"
          step="0.1"
          value={formData.hoursWorked}
          required
          onChange={e => onChange({ ...formData, hoursWorked: e.target.value })}
        />
      </div>

      <div>
        <label>Notes:</label><br />
        <textarea
          value={formData.notes}
          onChange={e => onChange({ ...formData, notes: e.target.value })}
        />
      </div>

      <button type="submit">Submit Entry</button>
    </form>
  );
};

export default TimeEntryForm;