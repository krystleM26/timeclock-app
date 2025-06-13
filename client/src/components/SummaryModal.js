import React from 'react';

const SummaryModal = ({ summaries, onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: '10%', left: '10%', right: '10%', padding: '2rem',
      backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', zIndex: 1000
    }}>
      <h2>📊 Weekly Summary</h2>
      {Object.entries(summaries).map(([name, weeks]) => (
        <div key={name}>
          <h3>{name}</h3>
          <ul>
            {Object.entries(weeks).map(([week, total]) => (
              <li key={week}>{week}: {total} hrs</li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SummaryModal;
