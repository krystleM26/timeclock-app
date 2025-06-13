import React, { useState, useEffect } from 'react';
import TimeEntryForm from './components/time-form';
import EditModal from './components/EditModel';
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

  // Fetch entries on mount
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

  // Handle create
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!formData.firstName || !formData.lastName) {
      alert('First and last name are required.');
      return;
    }

    const fullName = `${formData.firstName?.trim()} ${formData.lastName?.trim()}`.trim();
    console.log('📤 Submitting full name:', fullName);

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
        console.error('❌ Backend error:', data);
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error('❌ Submit error:', err);
      setSubmitStatus('error');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5050/timeEntries/${id}`, {
        method: 'DELETE'
      });
      setEntries(prev => prev.filter(entry => entry._id !== id));
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
  };

  // Handle edit submit
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

  const handleBulkImport = async (entriesToImport) => {
    const formatted = entriesToImport.map((e) => ({
      name: e.name,
      date: e.date,
      hoursWorked: Number(e.hoursWorked),
      notes: e.notes || '',
    }));
  
    try {
      for (let entry of formatted) {
        const res = await fetch('http://localhost:5050/timeEntries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(prev => [...prev, data.entry]);
        }
      }
      alert('✅ Import complete!');
    } catch (err) {
      console.error('❌ Bulk import error:', err);
      alert('Import failed.');
    }
  };

  

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🕒 Time Clock App</h1>

      <TimeEntryForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
      <FileImporter onImport={handleBulkImport} />

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
