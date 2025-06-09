const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hoursWorked: { type: Number, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
