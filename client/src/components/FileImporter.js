import React, { useRef } from 'react';

const FileImporter = ({ onImport }) => {
  const fileInputRef = useRef();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop();

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        let entries = [];

        if (ext === 'json') {
          entries = JSON.parse(event.target.result);
        } else if (ext === 'csv') {
          const lines = event.target.result.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          entries = lines.slice(1).map(line => {
            const values = line.split(',');
            const entry = {};
            headers.forEach((h, i) => {
              entry[h] = values[i]?.trim();
            });
            return entry;
          });
        } else {
          return alert('Unsupported file type');
        }

        onImport(entries);
      } catch (err) {
        console.error('❌ File parse error:', err);
        alert('Failed to process file.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>📂 Import Entries (CSV or JSON)</h3>
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.json"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileImporter;
