import React from 'react';

const TotalHoursSummary = ({ entries }) => {
  const totals = {};

  entries.forEach(entry => {
    const name = entry.name || '[No name]';
    if (!totals[name]) totals[name] = 0;
    totals[name] += entry.hoursWorked;
  });

  return (
    <div>
      <h3>🧾 Total Hours by Staff</h3>
      <ul>
        {Object.entries(totals).map(([name, total]) => (
          <li key={name}><strong>{name}:</strong> {total} hrs</li>
        ))}
      </ul>
    </div>
  );
};

export default TotalHoursSummary;
