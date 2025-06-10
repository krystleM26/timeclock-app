import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    hoursWorked: '',
    notes: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/timeEntries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('Time entry submitted!');
        setFormData({ name: '', date: '', hoursWorked: '', notes: '' });
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting time entry');
    }
  };

  return (
    <div className="App">
      <h1>Staff Time Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Staff Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="hoursWorked"
          placeholder="Hours Worked"
          value={formData.hoursWorked}
          onChange={handleChange}
          required
        />
        <textarea
          name="notes"
          placeholder="Optional Notes"
          value={formData.notes}
          onChange={handleChange}
        />
        <button type="submit">Submit Entry</button>
      </form>
    </div>
  );
}

export default App;
