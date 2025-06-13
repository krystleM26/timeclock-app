import React, { useState } from 'react';
import Papa from 'papaparse';

const FileImporter = ({ onImportComplete }) => {
  const [status, setStatus] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setStatus('Parsing...');
    const ext = file.name.split('.').pop();

    let entries = [];

    if (ext === 'csv') {
      const text = await file.text();
      const parsed = Papa.parse(text, { header: true });
      entries = parsed.data;
    } else if (ext === 'json') {
      const text = await file.text();
      entries = JSON.parse(text);
    } else {
      alert('Unsupported file type');
      return;
    }

    // Normalize + filter valid entries
    const cleaned = entries.filter(e => e.name && e.date && e.hoursWorked);

    // Send each entry to backend
    let successCount = 0;

    for (const entry of cleaned) {
      try {
        const res = await fetch('http://localhost:5050/timeEntries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: entry.name,
            date: entry.date,
            hoursWorked: Number(entry.hoursWorked),
            notes: entry.notes || ''
          })
        });

        if (res.ok) {
          successCount++;
        } else {
          console.error('❌ Failed to import entry:', await res.json());
        }
      } catch (err) {
        console.error('❌ Network error:', err);
      }
    }

    setStatus(`✅ Imported ${successCount} of ${cleaned.length} entries`);
    if (onImportComplete) onImportComplete(); // Optional refresh
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>📁 Import Time Entries</h3>
      <input type="file" accept=".csv, .json" onChange={handleFileUpload} />
      {status && <p>{status}</p>}
    </div>
  );
};

export default FileImporter;
