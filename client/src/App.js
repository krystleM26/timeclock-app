import React, { useState, useEffect } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    hoursWorked: '',
    notes: ''
  });

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Fetch past time entries on load
  useEffect(() => {
    fetch('http://localhost:5050/timeEntries')
      .then(res => res.json())
      .then(data => {
        console.log('📝 Fetched entries:', data);
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to fetch entries:', err);
        setLoading(false);
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    try {
      const res = await fetch('http://localhost:5050/timeEntries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        console.log('✅ Entry created:', data);
        setSubmitStatus('success');
        setEntries(prev => [...prev, data.entry]); // Update list with new entry
        setFormData({ name: '', date: '', hoursWorked: '', notes: '' }); // Clear form
      } else {
        console.error('❌ Backend error:', data);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setSubmitStatus('error');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🕒 Time Clock App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>First Name:</label><br />
          <input
            type="text"
            value={formData.name}
            required
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label>Last Name:</label><br />
          <input
            type="text"
            value={formData.name}
            required
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label>Date:</label><br />
          <input
            type="date"
            value={formData.date}
            required
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div>
          <label>Hours Worked:</label><br />
          <input
            type="number"
            step="0.1"
            value={formData.hoursWorked}
            required
            onChange={e => setFormData({ ...formData, hoursWorked: e.target.value })}
          />
        </div>

        <div>
          <label>Notes:</label><br />
          <textarea
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <button type="submit">Submit Entry</button>
      </form>

      {submitStatus === 'success' && <p style={{ color: 'green' }}>✅ Entry submitted!</p>}
      {submitStatus === 'error' && <p style={{ color: 'red' }}>❌ Something went wrong.</p>}

      <h2>📋 Past Time Entries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry._id}>
              <strong>{entry.userId?.name}</strong> — {entry.hoursWorked} hrs on{' '}
              {new Date(entry.date).toLocaleDateString()} ({entry.notes})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
