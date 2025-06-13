import React from 'react';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

const FileImporter = ({ onImport }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    if (fileType === 'application/pdf') {
      await parsePDF(file);
    } else if (file.name.endsWith('.csv')) {
      await parseCSV(file);
    } else if (file.name.endsWith('.json')) {
      await parseJSON(file);
    } else {
      alert('Unsupported file type.');
    }
  };

  const parseCSV = async (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validEntries = results.data.map(row => ({
          name: row.name,
          date: row.date,
          hoursWorked: parseFloat(row.hoursWorked),
          notes: row.notes || ''
        }));
        onImport(validEntries);
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
      }
    });
  };

  const parseJSON = async (file) => {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      onImport(data);
    } catch (err) {
      console.error('JSON Parse Error:', err);
    }
  };

  const parsePDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map(item => item.str).join(' ') + '\n';
    }

    console.log('📄 Extracted PDF Text:', textContent);
    // TODO: Add logic to extract structured data from textContent
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <label><strong>📂 Import Entries (CSV, JSON, PDF):</strong></label>
      <input type="file" accept=".csv,application/json,application/pdf" onChange={handleFileChange} />
    </div>
  );
};

export default FileImporter;
