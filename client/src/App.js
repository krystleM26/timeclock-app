import React, { useState, useEffect } from 'react';
import TimeEntryForm from './components/time-form';
import EditModal from './components/EditModal';
import FileImporter from './components/FileImporter';

const App = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    date: '',
    hoursWorked: '',
    notes: ''
  });

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5050/timeEntries')
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to fetch entries:', err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    const fullName = `${formData.firstName?.trim()} ${formData.lastName?.trim()}`.trim();

    if (!fullName || !formData.date || !formData.hoursWorked) {
      alert('Missing required fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5050/timeEntries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          date: formData.date,
          hoursWorked: formData.hoursWorked,
          notes: formData.notes
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitStatus('success');
        setEntries(prev => [...prev, data.entry]);
        setFormData({
          firstName: '',
          lastName: '',
          date: '',
          hoursWorked: '',
          notes: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('❌ Backend error:', data);
      }
    } catch (err) {
      console.error('❌ Submit error:', err);
      setSubmitStatus('error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5050/timeEntries/${id}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(entry => entry._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5050/timeEntries/${editingEntry._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEntry)
      });

      const updated = await res.json();

      if (res.ok) {
        setEntries(prev =>
          prev.map(entry => (entry._id === updated._id ? updated : entry))
        );
        setEditingEntry(null);
      } else {
        console.error('❌ Update failed:', updated);
      }
    } catch (err) {
      console.error('❌ Edit error:', err);
    }
  };

  const handleFileImport = async (parsedEntries) => {
    const results = [];

    for (const entry of parsedEntries) {
      const fullName = entry.name || `${entry.firstName || ''} ${entry.lastName || ''}`.trim();
      try {
        const res = await fetch('http://localhost:5050/timeEntries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...entry, name: fullName })
        });
        const data = await res.json();
        if (res.ok) {
          results.push(data.entry);
        } else {
          console.error('❌ Error importing entry:', data);
        }
      } catch (err) {
        console.error('❌ Error during import:', err);
      }
    }

    setEntries(prev => [...prev, ...results]);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🕒 Time Clock App</h1>

      <TimeEntryForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />

      {submitStatus === 'success' && <p style={{ color: 'green' }}>✅ Entry submitted!</p>}
      {submitStatus === 'error' && <p style={{ color: 'red' }}>❌ Something went wrong.</p>}

      <hr style={{ margin: '2rem 0' }} />

      <FileImporter onImport={handleFileImport} />

      <h2>📋 Past Time Entries</h2>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry._id}>
              <strong>{entry.name || '[No name]'}</strong> — {entry.hoursWorked} hrs on{' '}
              {new Date(entry.date).toLocaleDateString()} ({entry.notes})
              <br />
              <button onClick={() => setEditingEntry(entry)}>✏️ Edit</button>
              <button onClick={() => handleDelete(entry._id)}>🗑️ Delete</button>
            </li>
          ))}
        </ul>
      )}

      {editingEntry && (
        <EditModal
          entry={editingEntry}
          onChange={setEditingEntry}
          onCancel={() => setEditingEntry(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default App;
